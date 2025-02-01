set BASE_DIR=%~dp0
cd /d "%BASE_DIR%"

set URL=https://www.raiplaysound.it/audiolibri/cuoredicane.json
set NOME=CuoreDiCane
set PRIMO_GIORNO=01/02/2025

call groovy %BASE_DIR%AudioLibroToRss.groovy %URL% %NOME% %PRIMO_GIORNO%
explorer https://raw.githubusercontent.com/giamtrot/varie/refs/heads/master/rss/%NOME%.xml