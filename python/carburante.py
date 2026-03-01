"""
carburante.py
Scarica automaticamente l'ultimo trimestre disponibile dal portale MIMIT
(https://www.mimit.gov.it/index.php/it/open-data/elenco-dataset/carburanti-archivio-prezzi)
ed esegue un'analisi dei prezzi per un dato impianto e tipo di carburante.

Uso:
    python carburante.py [--impianto ID] [--carburante TIPO] [--anno ANNO] [--trim TRIMESTRE]

Esempi:
    python carburante.py                          # ultimo trimestre, impianto e carburante di default
    python carburante.py --impianto 11712 --carburante Benzina
    python carburante.py --anno 2025 --trim 3     # terzo trimestre 2025
"""

import argparse
import datetime
import io
import os
import re
import tarfile
import tempfile
import urllib.request
from collections import defaultdict

# ── Configurazione default ──────────────────────────────────────────────────
DEFAULT_IMPIANTO   = "11712"
DEFAULT_CARBURANTE = "Benzina"

BASE_URL = (
    "https://opendatacarburanti.mise.gov.it/categorized/prezzo_alle_8"
    "/{anno}/{anno}_{trim}_tr.tar.gz"
)


# ── Logica trimestre ────────────────────────────────────────────────────────
def current_quarter(dt: datetime.date) -> tuple[int, int]:
    """Restituisce (anno, trimestre) del trimestre corrente."""
    return dt.year, (dt.month - 1) // 3 + 1


def prev_quarter(anno: int, trim: int) -> tuple[int, int]:
    """Restituisce il trimestre precedente."""
    if trim == 1:
        return anno - 1, 4
    return anno, trim - 1


def latest_available_quarter() -> tuple[int, int]:
    """
    Determina l'ultimo trimestre pubblicato provando a raggiungere l'URL.
    Parte dal trimestre corrente e scala indietro finché trova un file valido.
    """
    today = datetime.date.today()
    anno, trim = current_quarter(today)

    for _ in range(6):  # controlla al massimo 6 trimestri indietro
        url = BASE_URL.format(anno=anno, trim=trim)
        try:
            req = urllib.request.Request(url, method="HEAD")
            with urllib.request.urlopen(req, timeout=10) as resp:
                if resp.status == 200:
                    return anno, trim
        except Exception:
            pass
        anno, trim = prev_quarter(anno, trim)

    raise RuntimeError("Impossibile trovare un trimestre disponibile sul server.")


# ── Download ────────────────────────────────────────────────────────────────
def download_tar(anno: int, trim: int, dest_dir: str) -> str:
    """Scarica il .tar.gz nel dest_dir e restituisce il percorso locale."""
    url = BASE_URL.format(anno=anno, trim=trim)
    filename = f"{anno}_{trim}_tr.tar.gz"
    dest_path = os.path.join(dest_dir, filename)

    print(f"Download: {url}")
    with urllib.request.urlopen(url, timeout=60) as resp:
        total = int(resp.headers.get("Content-Length", 0))
        downloaded = 0
        with open(dest_path, "wb") as f:
            while chunk := resp.read(65536):
                f.write(chunk)
                downloaded += len(chunk)
                if total:
                    pct = downloaded / total * 100
                    print(f"\r  {downloaded/1_048_576:.1f}/{total/1_048_576:.1f} MB ({pct:.0f}%)", end="", flush=True)
    print()
    return dest_path


# ── Parsing CSV ─────────────────────────────────────────────────────────────
def parse_price_lines(tar_path: str, impianto: str, carburante: str) -> list[dict]:
    """
    Apre il tar.gz in memoria, scorre ogni CSV e raccoglie le righe
    che corrispondono all'impianto e al carburante richiesti.

    Formato CSV (semicolon-separato):
      idImpianto;descCarburante;prezzo;isSelf;dtComu
    """
    pattern = re.compile(
        rf"^{re.escape(impianto)};{re.escape(carburante)};",
        re.IGNORECASE,
    )
    records = []

    with tarfile.open(tar_path, "r:gz") as tar:
        for member in tar.getmembers():
            if not member.isfile():
                continue
            f = tar.extractfile(member)
            if f is None:
                continue
            try:
                text = io.TextIOWrapper(f, encoding="utf-8", errors="replace")
                for line in text:
                    line = line.strip()
                    if pattern.match(line):
                        parts = line.split(";")
                        if len(parts) < 5:
                            continue
                        try:
                            price = float(parts[2].replace(",", "."))
                            dt = datetime.datetime.strptime(parts[4], "%d/%m/%Y %H:%M:%S")
                            records.append({
                                "price":   price,
                                "is_self": parts[3].strip() == "1",
                                "date":    dt,
                            })
                        except (ValueError, IndexError):
                            pass
            except Exception as e:
                print(f"  Avviso: impossibile leggere {member.name}: {e}")

    return records


# ── Analisi ─────────────────────────────────────────────────────────────────
def analyse(records: list[dict], impianto: str, carburante: str, anno: int, trim: int):
    if not records:
        print("Nessun dato trovato per i parametri specificati.")
        return

    # Raggruppa per mese e modalità (servito / self)
    monthly: dict[str, dict[str, list[float]]] = defaultdict(lambda: {"servito": [], "self": []})
    for r in records:
        key = r["date"].strftime("%Y-%m")
        mode = "self" if r["is_self"] else "servito"
        monthly[key][mode].append(r["price"])

    print()
    print("=" * 60)
    print(f"  Impianto : {impianto}")
    print(f"  Carburante: {carburante}")
    print(f"  Trimestre : {trim}-{anno}")
    print(f"  Rilevazioni totali: {len(records)}")
    print("=" * 60)
    print(f"{'Mese':<10}  {'Modalità':<8}  {'Media':>7}  {'Min':>7}  {'Max':>7}  {'N':>5}")
    print("-" * 60)

    for month in sorted(monthly):
        for mode in ("servito", "self"):
            prices = monthly[month][mode]
            if not prices:
                continue
            avg = sum(prices) / len(prices)
            print(
                f"{month:<10}  {mode:<8}  {avg:>7.3f}  "
                f"{min(prices):>7.3f}  {max(prices):>7.3f}  {len(prices):>5}"
            )

    # Riepilogo globale
    all_prices = [r["price"] for r in records]
    print("-" * 60)
    global_avg = sum(all_prices) / len(all_prices)
    print(f"{'TOTALE':<10}  {'':8}  {global_avg:>7.3f}  "
          f"{min(all_prices):>7.3f}  {max(all_prices):>7.3f}  {len(all_prices):>5}")
    print("=" * 60)


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(
        description="Analisi prezzi carburante da dati MIMIT open data"
    )
    parser.add_argument("--impianto",   default=DEFAULT_IMPIANTO,   help="ID impianto (default: %(default)s)")
    parser.add_argument("--carburante", default=DEFAULT_CARBURANTE, help="Tipo carburante (default: %(default)s)")
    parser.add_argument("--anno",       type=int, default=None,      help="Anno trimestre (default: automatico)")
    parser.add_argument("--trim",       type=int, default=None,      help="Numero trimestre 1-4 (default: automatico)")
    args = parser.parse_args()

    # Determina anno/trimestre
    if args.anno and args.trim:
        anno, trim = args.anno, args.trim
    else:
        print("Ricerca dell'ultimo trimestre disponibile...")
        anno, trim = latest_available_quarter()
        print(f"Trimestre rilevato: {trim}-{anno}")

    # Download in cartella temporanea
    with tempfile.TemporaryDirectory(prefix="carburante_") as tmp:
        tar_path = download_tar(anno, trim, tmp)

        print(f"Analisi per impianto={args.impianto}, carburante={args.carburante} ...")
        records = parse_price_lines(tar_path, args.impianto, args.carburante)

    analyse(records, args.impianto, args.carburante, anno, trim)


if __name__ == "__main__":
    main()