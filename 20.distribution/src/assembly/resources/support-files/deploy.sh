#!/bin/sh
print_log()
{
  echo "[`date '+%Y-%m-%d %H:%M:%S'`]--------------"
}
if [ -z "$ZSTUDIO_HOME" ];then
  ZSTUDIO_HOME=`dirname $0`/..
  ZSTUDIO_HOME=`cd "$ZSTUDIO_HOME" && pwd`
fi

DB_HOST=$1
DB_PORT=$2
DB_ADMIN=$3
DB_PWD=$4
SCENE=$5
if [ -z "$SCENE" ];then
  SCENE="runtime"
fi
PRODUCT_NAME="ZSTUDIO"
if [ ! "${SCENE}" = "design" ];then
  SCENE="runtime"
  PRODUCT_NAME="ZSERVER"
fi
echo `print_log`${PRODUCT_NAME}_HOME:${ZSTUDIO_HOME}

echo "db.host=${DB_HOST}" > ${ZSTUDIO_HOME}/conf/zstudio.properties
echo "db.port=${DB_PORT}" >> ${ZSTUDIO_HOME}/conf/zstudio.properties
echo "db.admin=${DB_ADMIN}" >> ${ZSTUDIO_HOME}/conf/zstudio.properties
echo "db.passwd=${DB_PWD}" >> ${ZSTUDIO_HOME}/conf/zstudio.properties
echo "scene=${SCENE}" >> ${ZSTUDIO_HOME}/conf/zstudio.properties

chmod +x ${ZSTUDIO_HOME}/initdb.sh
chmod +x ${ZSTUDIO_HOME}/bin/*.sh

echo `print_log`Finished to deploy $PRODUCT_NAME 
