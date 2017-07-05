package com.zte.mao.workbench.entity.model;

public class DataViewItemPo extends DataViewItem {
    private String viewId;

    public DataViewItemPo() {
        super();
        // TODO Auto-generated constructor stub
    }

    public DataViewItemPo(String viewId) {
        super();
        this.viewId = viewId;
    }
    
    public DataViewItemPo(String id, String tableName, String alisaName) {
        super(id, tableName, alisaName);
        // TODO Auto-generated constructor stub
    }

    public DataViewItemPo(String id, String viewId, String tableName,
            String alisaName) {
        super(id, tableName, alisaName);
    }

    public String getViewId() {
        return viewId;
    }

    public DataViewItemPo setViewId(String viewId) {
        this.viewId = viewId;
        return this;
    }
}
