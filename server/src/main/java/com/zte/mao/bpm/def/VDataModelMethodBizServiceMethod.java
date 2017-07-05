package com.zte.mao.bpm.def;

public interface VDataModelMethodBizServiceMethod {
    String SCHEMA = STenant.NAME;
    String NAME = "DATA_MODEL_METHOD_BIZ_SERVICE_METHOD_VIEW";

    String COL_NAME_MODEL_METHOD_ID = "MODEL_METHOD_ID";
    String COL_NAME_MODEL_ID = "MODEL_ID";
    String COL_NAME_BIZ_SERVICE_ID = "BIZ_SERVICE_ID";
    String COL_NAME_BIZ_METHOD_ID = "BIZ_METHOD_ID";
    String COL_NAME_BIZ_METHOD_EXPRESSION = "BIZ_METHOD_EXPRESSION";
    String COL_NAME_DATA_SOURCE_METHOD = "DATA_SOURCE_METHOD";

    String[] COLUMNS = new String[] {
            COL_NAME_MODEL_METHOD_ID,
            COL_NAME_MODEL_ID,
            COL_NAME_BIZ_SERVICE_ID,
            COL_NAME_BIZ_METHOD_ID,
            COL_NAME_BIZ_METHOD_EXPRESSION,
            COL_NAME_DATA_SOURCE_METHOD
        };
}
