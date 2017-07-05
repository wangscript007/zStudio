package com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata;

public class Group extends Field {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    public Group(Field field) {
        super.setDatabaseName(field.getDatabaseName());
        super.setTableName(field.getTableName());
        super.setName(field.getName());
    }
}
