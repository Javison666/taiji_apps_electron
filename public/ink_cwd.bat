@echo off


del /f /q %userprofile%\×ÀÃæ\ÆôÃ÷ÐÇ.lnk
del /f /q %userprofile%\desktop\ÆôÃ÷ÐÇ.lnk
del /f /q %alluserprofile%\×ÀÃæ\ÆôÃ÷ÐÇ.lnk
del /f /q %alluserprofile%\desktop\ÆôÃ÷ÐÇ.lnk
del /f /q %PUBLIC%\×ÀÃæ\ÆôÃ÷ÐÇ.lnk
del /f /q %PUBLIC%\desktop\ÆôÃ÷ÐÇ.lnk

cd ..
cd ..

set Program=%cd%\ÆôÃ÷ÐÇ.exe

set LnkName=ÆôÃ÷ÐÇ

set WorkDir=%cd%\

set Desc=

if not defined WorkDir call:GetWorkDir "%Program%"
(echo Set WshShell=CreateObject("WScript.Shell"^)
echo strDesKtop=WshShell.SpecialFolders("DesKtop"^)
echo Set oShellLink=WshShell.CreateShortcut(strDesKtop^&"\%LnkName%.lnk"^)
echo oShellLink.TargetPath="%Program%"
echo oShellLink.WorkingDirectory="%WorkDir%"
::echo oShellLink.WindowStyle=1
echo oShellLink.Description="%Desc%"
echo oShellLink.Save)>makelnk.vbs
makelnk.vbs
del /f /q makelnk.vbs
exit
goto :eof
:GetWorkDir
set WorkDir=%~dp1
set WorkDir=%WorkDir:~,-1%
goto :eof
