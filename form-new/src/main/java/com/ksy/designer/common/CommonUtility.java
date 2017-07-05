package com.ksy.designer.common;

/**
 * 公共方法
 * 
 * @author 10089289
 *
 */
public class CommonUtility {
    public static String convertFileName2Path(String fileName) {
        fileName = fileName.replace(':', '@').replace('/', '$');
        return fileName;
    }

}
