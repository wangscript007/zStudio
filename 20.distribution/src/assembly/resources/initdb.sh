#!/bin/sh
print_log()
{
  echo "[`date '+%Y-%m-%d %H:%M:%S'`]--------------"
}

if [ -z "$ZSTUDIO_HOME" ];then
  ZSTUDIO_HOME=`dirname $0`
  ZSTUDIO_HOME=`cd "$ZSTUDIO_HOME" && pwd`
fi

load_config()
{
  DB_HOST=`sed '/^db.host=/!d;s/.*=//' ${ZSTUDIO_HOME}/conf/zstudio.properties`
  DB_PORT=`sed '/^db.port=/!d;s/.*=//' ${ZSTUDIO_HOME}/conf/zstudio.properties`
  DB_ADMIN=`sed '/^db.admin=/!d;s/.*=//' ${ZSTUDIO_HOME}/conf/zstudio.properties`
  DB_ROOT_PWD=`sed '/^db.passwd=/!d;s/.*=//' ${ZSTUDIO_HOME}/conf/zstudio.properties`
  SCENE=`sed '/^scene=/!d;s/.*=//' ${ZSTUDIO_HOME}/conf/zstudio.properties`

  if [ -z "${SCENE}" ];then
    SCENE="runtime"
  fi
  PRODUCT_NAME="ZSTUDIO"
  if [ ! "${SCENE}" = "design" ];then
    SCENE="runtime"
    PRODUCT_NAME="ZSERVER"
  fi
  echo `print_log`${PRODUCT_NAME}_HOME:${ZSTUDIO_HOME}
}

runDBScripts()
{
  while read line; do
    if [ "${line// /}" == "" ];then
      continue
    fi
    USER_CNF=`echo $line|awk '{print $1}'`
    SCHEMA_CNF=`echo $line|awk '{print $2}'`
    SCRIPT_CNF=`echo $line|awk '{print $3}'`
    PASSWD=
    if [ "$USER_CNF" = "root" ];then
      USER_CNF=${DB_ADMIN}
      PASSWD=${DB_ROOT_PWD}
    else
      PASSWD=U_mao_2015
    fi  
    SCHEMA=
    if [ "$SCHEMA_CNF" = "null" ];then
      SCHEMA=
    else
      SCHEMA=-D$SCHEMA_CNF
    fi
    echo `print_log`run $SCENE ${SCRIPT_CNF#../} ...
    mysql -h${DB_HOST} -P${DB_PORT} -u$USER_CNF -p$PASSWD $SCHEMA < $1/$SCRIPT_CNF
    RESULT=$?
    if [ $RESULT != 0 ] ; then
      echo "Error:Failed to execute script!"
      exit 1
    fi
  done < $1/run.cnf
}

load_config

if [ "$SCENE" = "runtime" ];then
  runDBScripts ${ZSTUDIO_HOME}/dbscript/dbscript-zh/mysql/operation
else
  runDBScripts ${ZSTUDIO_HOME}/dbscript/dbscript-zh/mysql/design
fi

echo `print_log`Finished to initialize database.
