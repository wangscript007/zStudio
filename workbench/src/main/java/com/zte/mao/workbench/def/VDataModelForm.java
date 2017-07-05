package com.zte.mao.workbench.def;

public interface VDataModelForm {
    String SCHEMA = STenant.NAME;
    String NAME = "DATA_MODEL_FORM_VIEW";

    String COL_NAME_FORM_ID = "FORM_ID";
    String COL_NAME_FORM_NAME = "FORM_NAME";
    String COL_NAME_APP_ID = "APP_ID";
    String COL_NAME_MODEL_ID = "MODEL_ID";
    String COL_NAME_MODEL_NAME = "MODEL_NAME";
    String COL_NAME_BIND_TABLE_NAME = "BIND_TABLE_NAME";

    String[] COLUMNS = new String[] {
            COL_NAME_FORM_ID,
            COL_NAME_FORM_NAME,
            COL_NAME_APP_ID,
            COL_NAME_MODEL_ID,
            COL_NAME_MODEL_NAME,
            COL_NAME_BIND_TABLE_NAME};
}
