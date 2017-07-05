FROM 10.74.216.3:5000/tomcat

WORKDIR $CATALINA_HOME

ADD files $CATALINA_HOME/webapps

COPY setenv.sh $CATALINA_HOME/bin/
RUN chmod a+x $CATALINA_HOME/bin/setenv.sh

VOLUME $CATALINA_HOME/logs

ENTRYPOINT cd $CATALINA_HOME/bin && ./catalina.sh run

EXPOSE 8080
CMD tail -f $CATALINA_HOME/logs/catalina.out
