package com.zte.mao.workbench.def;

public interface TSingleTableDefinitionTable {
    
    int ENUM_TABLE_TYPE_SINGLE_TABLE = 0;
    int ENUM_TABLE_TYPE_VIEW = 1;
    
    String SCHEMA = TSingleTableDefinitionTable.NAME;
    String NAME = "SINGLE_TABLE_DEFINITION_TABLE";
    String COL_NAME_TABLE_NAME = "TABLE_NAME";
    String COL_NAME_DESCRIPTION = "DESCRIPTION";
    String COL_NAME_TABLE_TYPE = "TABLE_TYPE";
}
