set BASE_DIR=%~dp0
cd /d "%BASE_DIR%"
@REM set GROOVY="%BASE_DIR%tools\groovy-3.0.7\bin\groovy"
set JAVA_HOME=C:\Users\giamt\scoop\apps\openjdk\current
@REM echo %JAVA_HOME%
call groovy -version

call groovy IlPost.groovy
call IlPostGit.cmd

explorer https://raw.githubusercontent.com/giamtrot/varie/refs/heads/master/rss/IlPost.xml
