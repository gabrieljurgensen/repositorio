@echo off
set /p msg=Mensagem do commit: 
git add .
git commit -m "%msg%"
git push origin main
pause