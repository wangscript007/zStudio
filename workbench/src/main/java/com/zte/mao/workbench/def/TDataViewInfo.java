package com.zte.mao.workbench.def;

public interface TDataViewInfo {
    String DATE_PATTERN = "yyyy-MM-dd HH:mm:ss";
    
    String SCHEMA = STenant.NAME;
    String NAME = "DATA_VIEW_INFO_TABLE";
    String COL_NAME_ID = "ID";
    String COL_NAME_CREATOR = "CREATOR";
    String COL_NAME_CREATE_TIME = "CREATE_TIME";
    String COL_NAME_UPDATE_TIME = "UPDATE_TIME";
    String COL_NAME_MAIN_TABLE_NAME = "MAIN_TABLE_NAME";
}
