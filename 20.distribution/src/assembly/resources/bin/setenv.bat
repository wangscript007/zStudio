set TITLE=MAO-Workbench 8899
set JAVA_OPTS=-server -Xms32m -Xmx512m -XX:MetaspaceSize=32M -XX:MaxMetaspaceSize=128M
set CATALINA_OPTS=

for /f "tokens=1,2 delims==" %%i in (%CATALINA_HOME%\conf\zstudio.properties) do (
  if "%%i" == "scene" (
    if not "%%j" == "" (
      set scene=%%j
    )
  )
)
if "%scene%" == "design" (
  echo platform.type=design > %CATALINA_HOME%\webapps\dataservice\WEB-INF\classes\mao-dataservice-config.properties
  echo platform.type=mock > %CATALINA_HOME%\server\dataservice\WEB-INF\classes\mao-dataservice-config.properties
  echo platform.type=mock > %CATALINA_HOME%\server\server\WEB-INF\classes\mao-server-config.properties
)
if "%scene%" == "runtime" (
  echo platform.type=runtime > %CATALINA_HOME%\server\dataservice\WEB-INF\classes\mao-dataservice-config.properties
  echo platform.type=runtime > %CATALINA_HOME%\server\server\WEB-INF\classes\mao-server-config.properties
)
set CATALINA_OPTS=%CATALINA_OPTS% -server -Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=8899