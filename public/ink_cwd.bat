@echo off


del /f /q %userprofile%\����\������.lnk
del /f /q %userprofile%\desktop\������.lnk
del /f /q %alluserprofile%\����\������.lnk
del /f /q %alluserprofile%\desktop\������.lnk
del /f /q %PUBLIC%\����\������.lnk
del /f /q %PUBLIC%\desktop\������.lnk

cd ..
cd ..

set Program=%cd%\������.exe

set LnkName=������

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
