package com.zte.mao.workbench.entity.model;

public class DataViewItem {
    private String id;
    private String tableName;
    private String alisaName;

    public DataViewItem() {
        super();
        // TODO Auto-generated constructor stub
    }

    public DataViewItem(String id, String tableName,
            String alisaName) {
        super();
        this.id = id;
        this.tableName = tableName;
        this.alisaName = alisaName;
    }

    public String getId() {
        return id;
    }

    public DataViewItem setId(String id) {
        this.id = id;
        return this;
    }

    public String getTableName() {
        return tableName;
    }

    public DataViewItem setTableName(String tableName) {
        this.tableName = tableName;
        return this;
    }

    public String getAlisaName() {
        return alisaName;
    }

    public DataViewItem setAlisaName(String alisaName) {
        this.alisaName = alisaName;
        return this;
    }
}
