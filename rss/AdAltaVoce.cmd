set BASE_DIR=%~dp0
cd /d "%BASE_DIR%"
set GROOVY="%BASE_DIR%tools\groovy-3.0.7\bin\groovy"
set JAVA_HOME=%BASE_DIR%tools\jdk1.8.0_272
echo %JAVA_HOME%

set URL=https://www.raiplaysound.it/audiolibri/casadaltri.json
set NOME=casadaltri
set PRIMO_GIORNO=01/11/2024

call %GROOVY% %BASE_DIR%AudioLibroToRss.groovy %URL% %NOME% %PRIMO_GIORNO%
explorer https://raw.githubusercontent.com/giamtrot/varie/refs/heads/master/rss/%NOME%.xml