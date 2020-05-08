set BASE_DIR=%~dp0
cd /d "%BASE_DIR%"
groovy %BASE_DIR%AudioLibroToRss.groovy %1 %2
call git add -v *
call git commit * -m "Update after update"
call git push -u origin master
explorer https://raw.githubusercontent.com/giamtrot/varie/master/rss/%2.xml