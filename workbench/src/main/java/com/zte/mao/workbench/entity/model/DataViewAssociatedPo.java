package com.zte.mao.workbench.entity.model;

public class DataViewAssociatedPo extends DataViewAssociatedBase {
    private String id;
    private String viewId;

    public DataViewAssociatedPo(String id, String viewId) {
        super();
        this.id = id;
        this.viewId = viewId;
    }

    public DataViewAssociatedPo() {
        super();
        // TODO Auto-generated constructor stub
    }

    public DataViewAssociatedPo(String associatedType,
            String associatedTableName, String id, String viewId) {
        super(associatedType, associatedTableName);
        this.id = id;
        this.viewId = viewId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getViewId() {
        return viewId;
    }

    public void setViewId(String viewId) {
        this.viewId = viewId;
    }

}
