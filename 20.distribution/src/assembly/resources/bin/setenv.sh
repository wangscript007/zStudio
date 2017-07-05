#!/bin/sh
export JAVA_OPTS="-server -Xms32m -Xmx512m -XX:MetaspaceSize=32M -XX:MaxMetaspaceSize=128M"

SCENE=`sed '/^scene=/!d;s/.*=//' ${CATALINA_HOME}/conf/zstudio.properties`
if [ "$SCENE" = "design" ];then
  echo "platform.type=design" > ${CATALINA_HOME}/webapps/dataservice/WEB-INF/classes/mao-dataservice-config.properties
  echo "platform.type=mock" > ${CATALINA_HOME}/server/dataservice/WEB-INF/classes/mao-dataservice-config.properties
  echo "platform.type=mock" > ${CATALINA_HOME}/server/server/WEB-INF/classes/mao-server-config.properties
fi
if [ "$SCENE" = "runtime" ];then
  echo "platform.type=runtime" > ${CATALINA_HOME}/server/dataservice/WEB-INF/classes/mao-dataservice-config.properties
  echo "platform.type=runtime" > ${CATALINA_HOME}/server/server/WEB-INF/classes/mao-server-config.properties
fi
declare -x CATALINA_OPTS="${CATALINA_OPTS} -server -Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=8899" 
