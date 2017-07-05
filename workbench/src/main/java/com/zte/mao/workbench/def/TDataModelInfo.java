package com.zte.mao.workbench.def;

public interface TDataModelInfo {
    String DATE_PATTERN = "yyyy-MM-dd HH:mm:ss";

    int ENUM_SCENE_EXIST_TABLE = 1;
    int ENUM_SCENE_NEW_TABLE = 2;
    int ENUM_SCENE_SCRIPT = 3;

    String SCHEMA = STenant.NAME;
    String NAME = "DATA_MODEL_INFO_TABLE";
    String COL_NAME_ID = "ID";
    String COL_NAME_NAME = "NAME";
    String COL_NAME_DESCRIPTION = "DESCRIPTION";
    String COL_NAME_SCENE = "SCENE";
    String COL_NAME_CREATOR = "CREATOR";
    String COL_NAME_CREATE_TIME = "CREATE_TIME";
    String COL_NAME_UPDATE_TIME = "UPDATE_TIME";
    String COL_NAME_BIND_TABLE_NAME = "BIND_TABLE_NAME";
    String COL_NAME_SCRIPT = "SCRIPT";
    String COL_NAME_I18N = "I18N";
    String COL_NAME_PACKAGE_ID = "PACKAGE_ID";
}
