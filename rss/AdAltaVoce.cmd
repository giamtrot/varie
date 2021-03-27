set BASE_DIR=%~dp0
cd /d "%BASE_DIR%"
set GROOVY=C:\Users\giamt\Desktop\Locale\groovy-3.0.7\bin\groovy
call %GROOVY% %BASE_DIR%AudioLibroToRss.groovy %1 %2
call git add -v *
call git commit * -m "Update after update"
call git push https://giamtrot:5b1e379c2f3dc94efdc538346785fec3b35cd267@github.com/giamtrot/varie
explorer https://raw.githubusercontent.com/giamtrot/varie/master/rss/%2.xml