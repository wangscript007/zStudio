package com.zte.iui.layoutit.cmd;

import org.apache.log4j.Logger;


/**
 * 默认的信息解析类，根据日志打印级别将信息打印到日志中
 * @author jiangyong188311
 *
 */
public class DefaultParse implements LineParser {
    protected static Logger logger = Logger.getLogger(DefaultParse.class);
    protected LogLevel level;
    protected String infoPrefix;

    public DefaultParse(String infoPrefix, LogLevel level) {
        this.infoPrefix = infoPrefix;
        this.level = level;
    }

    public String parse(String line) {
        String sb = line;
        if(infoPrefix != null){
            sb = infoPrefix + " " + line;
        }
        switch (level) {
            case DEBUG:
                logger.debug(sb);
                break;
            case WARN:
                logger.warn(sb);
                break;
            case ERROR:
                logger.error(sb);
                break;
            default:
                logger.info(sb);
            }
        return line;
    }
}