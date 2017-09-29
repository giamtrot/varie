REM @echo off
set BASE_DIR=%~dp0
set catalina.base=%BASE_DIR%Tomcat
REM echo %catalina.base%
set wtp.deploy=%BASE_DIR%..

set tomcat.cmd=start S:\tools\jdk1.6.0_45\bin\java.exe "-Dcatalina.base=%catalina.base%" "-Dcatalina.home=S:\tools\apache-tomcat-7.0.29" "-Djava.endorsed.dirs=S:\tools\apache-tomcat-7.0.29\endorsed" -Dfile.encoding=Cp1252 -classpath "S:\tools\apache-tomcat-7.0.29\bin\bootstrap.jar;S:\tools\apache-tomcat-7.0.29\bin\tomcat-juli.jar;S:\tools\jdk1.6.0_45\lib\tools.jar" org.apache.catalina.startup.Bootstrap

%tomcat.cmd% start
explorer http://localhost:9080/varie/

echo kill Tomcat?
pause 

%tomcat.cmd% stop
