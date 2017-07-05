package com.zte.mao.workbench.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.log4j.Logger;

import com.zte.ums.bcp.orm.tabledata.controller.QueryRecordController;

public class DateUtil {
    private static final Logger logger = Logger.getLogger(DateUtil.class.getName());

    public static final String PATTERN_YYYY_MM_DD_HH_MM_SS = "yyyy-MM-dd HH:mm:ss";
    private static SimpleDateFormat TIMESTAMP_FORMAT = new SimpleDateFormat("yyyyMMddHHmmssSSS");
    public static String format(Date date, String pattern) {
        return new SimpleDateFormat(pattern).format(date);
    }

    public synchronized static String getTimestamp() {
        try {
            Thread.currentThread().sleep(10);
        } catch (InterruptedException e) {
            // 线程异常，不影响
            logger.error(e.getMessage(), e);
        }
        return TIMESTAMP_FORMAT.format(new Date(System.currentTimeMillis()));
    }
}
