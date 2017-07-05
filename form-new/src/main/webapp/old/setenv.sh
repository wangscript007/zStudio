#!/bin/sh
export JAVA_OPTS="-server -Xms32m -Xmx512m -XX:PermSize=16M -XX:MaxPermSize=64M"
declare -x CATALINA_OPTS="-server -Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=8899" 
