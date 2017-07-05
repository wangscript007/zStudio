package com.zte.mao.workbench.def;

public interface TDataViewAssociatedConditon {
    String SCHEMA = STenant.NAME;
    String NAME = "DATA_VIEW_ASSOCIATED_CONDITON_TABLE";

    String COL_NAME_MAIN_TABLE_NAME = "MAIN_TABLE_NAME";
    String COL_NAME_MAIN_COLUMN_NAME = "MAIN_COLUMN_NAME";
    String COL_NAME_CHILD_TABLE_NAME = "CHILD_TABLE_NAME";
    String COL_NAME_CHILD_COLUMN_NAME = "CHILD_COLUMN_NAME";
    String COL_NAME_COMPARISON = "COMPARISON";
    String COL_NAME_VIEW_ID = "VIEW_ID";
    String COL_NAME_ASSOCIATED_ID = "ASSOCIATED_ID";
    String COL_NAME_INDEX = "INDEX";
}