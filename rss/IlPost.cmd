set BASE_DIR=%~dp0
cd /d "%BASE_DIR%"
@REM set GROOVY="%BASE_DIR%tools\groovy-3.0.7\bin\groovy"
@REM set JAVA_HOME=%BASE_DIR%tools\jdk1.8.0_272
@REM echo %JAVA_HOME%
call groovy -version

call groovy IlPost.groovy
call IlPostGit.cmd

explorer https://raw.githubusercontent.com/giamtrot/varie/refs/heads/master/rss/IlPost.xml
