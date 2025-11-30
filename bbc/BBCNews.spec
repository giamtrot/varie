# -*- mode: python ; coding: utf-8 -*-

import os


def _walk_dir(src, dest_prefix):
    """Return list of (srcpath, destpath) for all files under src."""
    result = []
    if not os.path.exists(src):
        return result
    for root, _, files in os.walk(src):
        for f in files:
            full = os.path.join(root, f)
            rel = os.path.relpath(full, src)
            dest = os.path.join(dest_prefix, rel)
            result.append((full, dest))
    return result


# Ensure PyInstaller searches from the project root
# Note: __file__ is not available in PyInstaller spec context, so use getcwd()
project_root = os.path.abspath(os.getcwd())
a = Analysis(
    ['app.py'],
    pathex=[project_root],
    binaries=[],
    # Include the built React app folder.
    # The JSON files are now handled externally.
    datas=_walk_dir(os.path.join(project_root, 'frontend', 'build'), os.path.join('frontend', 'build')),
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='BBCNews',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
