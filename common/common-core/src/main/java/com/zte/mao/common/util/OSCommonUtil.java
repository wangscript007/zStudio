package com.zte.mao.common.util;

import java.util.Properties;

public class OSCommonUtil {
    private static OSCommonUtil osCommonUtil = null;
    private boolean isWindows = true;
    
    public static synchronized OSCommonUtil getInstanse() {
        if (osCommonUtil == null) {
            osCommonUtil = new OSCommonUtil();
        }
        return osCommonUtil;
    }
    
    private OSCommonUtil() {
        Properties env = System.getProperties();
        String osName = env.getProperty("os.name");
//        String systemArchName = env.getProperty("os.arch");
        if (osName != null) {
            if (osName.indexOf("Win") >= 0) {
                isWindows = true;
//            } else if (osName.indexOf("SunOS") >= 0) {
//                isWindows = false;
//            } else if (osName.indexOf("AIX") >= 0) {
//                isWindows = false;
//            } else if (osName.indexOf("Linux") >= 0) {
//                isWindows = false;
            } else {
                isWindows = false;
            }
        }
    }

    public boolean isWindows() {
        return isWindows;
    }
}
