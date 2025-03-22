@Grab('org.jsoup:jsoup:1.17.2')
// @Grab('org.ccil.cowan.tagsoup:tagsoup:1.2')

import org.jsoup.Jsoup
import groovy.json.JsonSlurper
import java.text.SimpleDateFormat
import groovy.xml.MarkupBuilder
import groovy.xml.XmlSlurper
import groovy.json.JsonSlurper

final RSS_DIR = "./"
final DATE_FILE = RSS_DIR + "AdAltaVoce.date"
// final TO_EXCLUDE = ["Alice nel paese delle meraviglie", "Alpinisti ciabattoni", "Amuleto", "Cuore di tenebra", "Diario di Anna Frank", "Febbre", 
// "Fiabe dei fratelli Grimm", "Flush. Una biografia", "Gioventù senza Dio", "I Malavoglia", "I dolori del giovane Werther", "I mille da Genova a Capua", "I promessi sposi", 
// "I ragazzi della Via Pal", "I viaggi di Gulliver", "Il Milione", "Il cappello del prete", "Il fu Mattia Pascal", "Il giardino dei Finzi Contini", 
// "Il giornalino di Gian Burrasca", "Il grande Gatsby", "Il libro della giungla", "Il mago di Oz", "Il ritratto di Dorian Gray", "Il sistema periodico", 
// "La coscienza di Zeno", "La metamorfosi", "Le avventure di Pinocchio", "Le avventure di Tom Sawyer", "Lo stadio di Wimbledon", 
// "Ma gli androidi sognano pecore elettriche?", "Peter Pan", "Sorelle Materassi", "Sostiene Pereira", "Ventimila leghe sotto i mari", ]

final TO_EXCLUDE = ["alicenelpaesedellemeraviglie", "alpinisticiabattoni", "amuleto", "cuoreditenebra", "diariodiannafrank", "febbre", 
"fiabedeifratelligrimm", "flushunabiografia", "gioventusenzadio", "imalavoglia", "idoloridelgiovanewerther", "imilledagenovaacapua", "ipromessisposi", "iragazzidellaviapal", 
"iviaggidigulliver", "ilmilione", "ilcappellodelprete", "ilfumattiapascal", "ilgiardinodeifinzicontini", "ilgiornalinodigianburrasca", "ilgrandegatsby", "illibrodellagiungla",
"ilmagodioz", "ilritrattodidoriangray", "ilsistemaperiodico", "lacoscienzadizeno", "lametamorfosi", "leavventuredipinocchio", "leavventureditomsawyer", "lostadiodiwimbledon",
"magliandroidisognanopecoreelettriche", "peterpan", "sorellematerassi", "sostienepereira", "ventimilaleghesottoimari", ]

final TO_INCLUDE = ["16ottobre1943", "acidolattico", "agostino", "amatissima", "amoreeginnastica", "andaidentrolanotteilluminata", "aranciameccanica", "artemisia", 
"bartlebyloscrivano", "belami", "cameraconvista", "cannealvento", "casadaltri", "cattedrale", "cattivonatale", "cenere", "chissadoveroquel25aprile", "ciaulascoprelaluna", 
"collettori-limonata", "congliocchichiusi", "conservazione", "cristosiefermatoaeboli", "cuoredicane", "daquartoalvolturno", "decamerone", "dialledonnecheusciamo", 
"diario1941-1943", "diariodiunpazzo", "dieciindianiecampoindiano", "distanza", "doppiosogno", "dracula", "emma", "fame", "fosca", "frankenstein", "girodivite", 
"gliindifferenti", "gliocchialidoro", "gliultimiannidicleliatrotti", "grandefiumedaiduecuori", "grandisperanze", "grishaeilraccontodelgiardinierecapo", 
"hoservitoilredinghilterra", "idiecigiornichesconvolseroilmondo", "imieipremi", "ipadrilontani", "iraccontidialbertomoravia", "iraccontidiantoncechov", 
"iraccontidiernesthemingway", "iraccontidifranzkafka", "iraccontidigracepaley", "iraccontidiitalocalvino", "iraccontidijacklondon", "iraccontidikatherinemansfield", 
"iraccontidilevtolstoj", "iraccontidiluigipirandello", "iraccontidiraymondcarver", "iraccontidiryunosukeakutagawa", "itremoschettieri", "ivecchieigiovani", 
"ilcontedimontecristo", "ilcommesso", "ilcompagno", "ilcomunista", "ilconformista", "ildesertodellalibia", "ildiavoloincorpo", "ildiavolosullecolline", 
"ildisperso", "ilfondodellabottiglia", "ilgiocodeiregni", "ilgiornodelgiudizio", "ilgiuocodelleperledivetro", "ilgrandebob", "ilmaestroemargherita", 
"ilmantello", "ilmisterodiedwindrood", "ilmonaco", "ilnaso", "ilnomedellarosa", "ilpaesedicuccagna", "ilpiacere", "ilpranzodibabette", "ilritratto", 
"ilrossoeilnero", "ilsentierodeinididiragno", "ilsergentenellaneve", "ilsoccombente", "jakobvongunten", "janeeyre", "julesejim", "liguana", "limperatorediportugallia", 
"lagentesegreto", "ledera", "leducazionesentimentale", "loraditutti", "labellaestate", "lalineadombra", "lalunaeifalo", "lamortediivanilich", "laparete", 
"lapaura", "lapelle", "lapeste", "laricorrenza", "laricreazioneefinita", "lascopertadelbambino", "lasignoradalloway", "latregua", "laverginenelgiardino", 
"lazarillodetormes", "lelineedombra", "lememoriedibarrylindon", "lemeravigliedelduemila", "leterredelsacramento", "letigridimompracem", "levocidellasera", 
"levocidimarrakech", "liberalakareninacheeinte", "lidamantovani", "madamebovary", "martineden", "memoriedelsottosuolo", "mephisto", "metello", 
"nemiciunastoriadamore", "nientedinuovosulfronteoccidentale", "oblomov", "ognunomuoresolo", "orgoglioepregiudizio", "ottoebrei", "padriefigli", 
"panchinecomeusciredalmondosenzauscirne", "panorama", "passaggioinindia", "pennywirtonesuamadre", "prospettivanevskij", "raccontiromani", "ragazzidivita", "resurrezione", 
"revolutionaryroad", "riflessiinunocchiodoro", "ritrattodisarahmalcolm", "sequestoeunuomo", "senilita", "sottoilvulcano", "spiaperscommessa", "tradonnesole", "ultimovieneilcorvo", 
"unannosullaltipiano", "unuomochedorme", "unacosadivertentechenonfaromaipiu", "unanottedel43", "unastoriadilettevoledellamusica", "unavitaviolenta", "unostudioinrosso", 
"unonessunoecentomila", "uovafatali", "utz", "ventannidopo", "vitadigalileo", "vitaprecariaeamoreeterno", ]

def lastDate = new GregorianCalendar()
lastDate.setTime(Date.parse("dd/MM/yyyy", "15/02/2025"))

def dateFile = new File(DATE_FILE)
if (dateFile.exists()) {
	dateFile.withReader { reader ->
		def line = reader.readLine()
		if (line) {
			lastDate.setTime(Date.parse("dd/MM/yyyy", line.split(": ")[1]))
		}
	}
}

println "Last Date: ${lastDate.time.format('dd/MM/yyyy')}"
def today = new GregorianCalendar().clearTime()
// def today = new GregorianCalendar()
// today.setTime(Date.parse("dd/MM/yyyy", "16/03/2025"))
if (lastDate.time >= today.time) {
	println "No new episodes"
	System.exit(0)
}

def baseUrl = new URI("https://www.raiplaysound.it/programmi/adaltavoce/audiolibri")
def document
try {
	document = Jsoup.connect(baseUrl.toString()).timeout(10000).get()
}
catch (SocketTimeoutException e) {
	println "Timeout connecting to $baseUrl"
	return
}

def articles = document.select("article > a").eachAttr("href")
articles = articles.collect { it.replace("/audiolibri/", "") }
articles = articles.findAll { article ->
	!TO_EXCLUDE.any { exclude -> article.toLowerCase().contains(exclude) }
}

// println "Articles: ${articles}"

def newArticles = articles.findAll { article ->
	!TO_INCLUDE.any { exclude -> article.toLowerCase().contains(exclude) }
}

println "New Books: ${newArticles}"
def newArticlesFile = new File(RSS_DIR + "AdAltaVoce.new")
newArticlesFile.withWriter { writer ->
	newArticles.each { article ->
		writer.writeLine(article)
	}
}

// println readXML("IRaccontiDiRyunosukeAkutagawa.xml")

def done = false
def allItems = []

TO_INCLUDE.forEach{ href -> {
	if (!done) {
		def article = baseUrl.resolve("/audiolibri/" + href).toString() + ".json"
		// println article
		def book = new JsonSlurper().parse(new URL(article))
		def bookTitle = book.title.trim()
		def fileName = nameToFile(bookTitle) + '.xml'

		def file = new File(fileName)
		if (file.exists()) {
			def items = readXML(fileName)
			allItems.addAll(items)
		}
		if (!file.exists()) {
			def items = readBook(book, lastDate)
			allItems.addAll(items)
			makeRSSFromItems(fileName, bookTitle, items)
			done = true
		}
	}
}}

makeRSSFromItems("AdAltaVoce.xml", "Ad Alta Voce", allItems)

dateFile.withWriter { writer ->
	writer.writeLine("Last Date: ${lastDate.time.format('dd/MM/yyyy')}")
}

//===============================

def readBook(book, lastDate) {
	def formatter = new SimpleDateFormat('EEE, d MMM yyyy hh:mm:ss Z', Locale.ENGLISH)

	def items = []
	book.block.cards.each{ n->
		def urlAudio = n.downloadable_audio ?: n.audio
		def title = n.audio.title
		def link = urlAudio.url
		def description =n.audio.title
		def enclosure = [type: "audio/mpeg", url:urlAudio.url]
		def pubDate = formatter.format(lastDate.time)
		def guid = urlAudio.url
		lastDate.add(Calendar.DATE, 1)
		items << [title: title, link: link, description: description, enclosure: enclosure, pubDate: pubDate, guid: guid]
	}

	return items
}

def readXML(fileName) {
	def xmlFile = new File(fileName)
	if (!xmlFile.exists()) {
		println "File not found: $fileName"
		return
	}

	def xmlContent = new XmlSlurper().parse(xmlFile)
	// println "Title: ${xmlContent.channel.title.text()}"
	def items = []
	xmlContent.channel.item.each { item ->
		items << [
			title: item.title.text(),
			link: item.link.text(),
			description: item.description.text(),
			enclosure: [type: item.enclosure.@type.text(), url: item.enclosure.@url.text()],
			pubDate: item.pubDate.text(),
			guid: item.guid.text()
		]
	}
	// println items[0].enclosure
	return items
}

def open(filename) {
	def shellCommand = "explorer https://raw.githubusercontent.com/giamtrot/varie/refs/heads/master/rss/${filename}"
	def process = shellCommand.execute()
	def output = new StringBuffer()
	process.consumeProcessOutput(output, System.err)
	process.waitFor()
	println output.toString()
}

def nameToFile(String name) {
    name = name.replaceAll(/['’,]/, '')
    name = name.split(/\s+/).collect { it.capitalize() }.join('')
    name
}

def makeRSSFromItems(fileName, titleValue, items) {
	def xmlWriter = new StringWriter()
	def xmlMarkup = new MarkupBuilder(xmlWriter)

	println "$fileName, $titleValue"
	xmlMarkup.rss {
		channel {
			title(titleValue)
			items.each{ i ->
				'item' {
					title(i.title)
					link(i.link)
					description(i.description)
					enclosure(type: i.enclosure.type, url:i.enclosure.url)
					pubDate(i.pubDate)
					guid(i.guid)
				}
			}
		}
	}

	// // println  xmlWriter.toString()
	new File(fileName).write(xmlWriter.toString())
}

def makeRSS(fileName, book, lastDate) {
	def formatter = new SimpleDateFormat('EEE, d MMM yyyy hh:mm:ss Z', Locale.ENGLISH)

	def xmlWriter = new StringWriter()
	def xmlMarkup = new MarkupBuilder(xmlWriter)

	xmlMarkup.rss {
		channel {
			title(book.title)
			book.block.cards.each{ n->
				'item' {
					def urlAudio = n.downloadable_audio ?: n.audio
					// println urlAudio
					title(n.audio.title)
					link(urlAudio.url)
					description(n.audio.title)
					enclosure(type: "audio/mpeg", url:urlAudio.url)
					pubDate(formatter.format(lastDate.time))
					guid(urlAudio.url)
					lastDate.add(Calendar.DATE, 1)
				}
			}
		}
	}

	// println  xmlWriter.toString()
	new File(fileName).write( xmlWriter.toString() )
}

