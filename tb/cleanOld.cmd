REM @echo off
echo %~dpnx0
set FND=wsl find

set BASE_DIR=/mnt/c/Users/rgiammario/Downloads/tab
%FND% %BASE_DIR% -type f -mtime +1 -print ^| wc -l
%FND% %BASE_DIR% -type f -atime +365 -print -exec rm -f {} \;
