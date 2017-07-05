package com.ksy.designer.common;

public interface CommonConst {
//  ***********************************************************************
//                         不建议在接口里面调用方法
//  ***********************************************************************
//	/**
//	 * 框架路径采用配置的方式进行保存
//	 */
//	String FRAME_FILE_PATH = CommonUtility.getFramePath();
//	/**
//	 * 工程设计文件备份路径
//	 */
//	String FRAME_FILE_BACKUP_PATH = CommonUtility.getFramePath()+File.separator+"backup";
//	
//	boolean IS_CSV_FILE =  CommonUtility.isCsvFile();
//  ***********************************************************************

    int DEFAULT_APP_ID = -1;

    String UTF_8 = "UTF-8";

    String FRAME_FIEDLS_FILE_SUFFIX = ".fields";
    String GENERATOR_HTML_SUFFIX = ".html";
    String GENERATOR_JS_SUFFIX = ".js";
    String GENERATOR_CSV_SUFFIX = ".csv";
    String GENERATOR_JSON_SUFFIX = ".json";

    String VM_TYPE_FORM = "form";
    String VM_TYPE_TABLE = "table";
    String VM_TYPE_CHART = "chart";
    String VM_TYPE_DISPLAY = "display";

    String SUCCESS = "success";
    String ERROR = "error";
}
