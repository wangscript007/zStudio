@echo off
setlocal enabledelayedexpansion

set dbHost=
set dbPort=
set dbAdmin=
set dbPasswd=
echo %time:~,8%--------------read zstudio.properties
for /f "tokens=1,2 delims==" %%i in (%~dp0\conf\zstudio.properties) do (
  if "%%i" == "db.host" (
    if not "%%j" == "" (
      set dbHost=%%j
    )
  )
  if "%%i" == "db.port" (
    if not "%%j" == "" (
      set dbPort=%%j
    )
  )
  if "%%i" == "db.admin" (
    if not "%%j" == "" (
      set dbAdmin=%%j
    )
  )
  if "%%i" == "db.passwd" (
    if not "%%j" == "" (
      set dbPasswd=%%j
    )
  )
)

for /f "tokens=1-3 delims= " %%a in (%~dp0\dbscript\dbscript-zh\mysql\design\run.cnf) do (
  set user=
  set passwd=
  if "%%a"=="root" (
     set user=%dbAdmin%
     set passwd=%dbPasswd%
  ) else (
     set user=%%a
     set passwd=U_mao_2015
  )
  set schema=
  if "%%b"=="null" (
     set schema=
  ) else (
     set schema=-D%%b
  )
  set scriptName=%%c
  set scriptName=!scriptName:../=!
  echo %time:~,8%--------------begin to run design !scriptName!
  mysql -h%dbHost% -P%dbPort% -u!user! -p!passwd! !schema!<%~dp0\dbscript\dbscript-zh\mysql\design\%%c
  echo %time:~,8%--------------end to run design !scriptName!
 )

echo %time:~,8%--------------Finished to initialize database.
pause