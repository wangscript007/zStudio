package com.zte.mao.bpm.def;

public interface VDataModelDataSource {
    String SCHEMA = STenant.NAME;
    String NAME = "DATA_MODEL_DATA_SOURCE_VIEW";

    String COL_NAME_DATA_MODEL_ID = "DATA_MODEL_ID";
    String COL_NAME_DATA_SOURCE_ID = "DATA_SOURCE_ID";
    String COL_NAME_NAME = "NAME";
    String COL_NAME_DESCRIPTION = "DESCRIPTION";
    String COL_NAME_ADAPTER_TYPE = "ADAPTER_TYPE";
    String COL_NAME_HOST = "HOST";
    String COL_NAME_PORT = "PORT";
    String COL_NAME_SCHEMA = "SCHEMA";
    String COL_NAME_USER = "USER";
    String COL_NAME_PASSWORD = "PASSWORD";

    String[] COLUMNS = new String[] {
            COL_NAME_DATA_MODEL_ID,
            COL_NAME_DATA_SOURCE_ID,
            COL_NAME_NAME,
            COL_NAME_DESCRIPTION,
            COL_NAME_ADAPTER_TYPE,
            COL_NAME_HOST,
            COL_NAME_PORT,
            COL_NAME_SCHEMA,
            COL_NAME_USER,
            COL_NAME_PASSWORD
            };
}
