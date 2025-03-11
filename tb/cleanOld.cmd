@echo off
echo %~dpnx0
set FND=wsl find

set BASE_DIR=/mnt/c/Users/giamt/Downloads/tab
%FND% %BASE_DIR% -type f -cmin +120 -print ^| wc -l
%FND% %BASE_DIR% -type f -cmin +120 -print -exec rm -f {} \;

pause