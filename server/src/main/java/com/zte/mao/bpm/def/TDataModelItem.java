package com.zte.mao.bpm.def;

public interface TDataModelItem {
    int ENUM_TYPE_STRING = 1;
    int ENUM_TYPE_LONG_STRING = 2;
    int ENUM_TYPE_BOOLEAN = 3;
    int ENUM_TYPE_INTERGE = 4;
    int ENUM_TYPE_FLOAT = 5;
    int ENUM_TYPE_DATE = 6;

    String SCHEMA = STenant.NAME;
    String NAME = "DATA_MODEL_ITEM_TABLE";

    String COL_NAME_ID = "ID";
    String COL_NAME_NAME = "NAME";
    String COL_NAME_MODEL_ID = "MODEL_ID";
    String COL_NAME_TYPE = "TYPE";
    String COL_NAME_IS_NULL = "IS_NULL";
    String COL_NAME_LENGTH = "LENGTH";
    String COL_NAME_DECIMAL = "DECIMAL";
    String COL_NAME_DEFAULT = "DEFAULT";
    String COL_NAME_FILTER = "FILTER";
}
