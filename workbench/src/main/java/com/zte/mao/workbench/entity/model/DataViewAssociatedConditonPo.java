package com.zte.mao.workbench.entity.model;

public class DataViewAssociatedConditonPo extends DataViewAssociatedConditon {
    private String associatedId;
    private String viewId;

    public DataViewAssociatedConditonPo() {
        super();
        // TODO Auto-generated constructor stub
    }

    public DataViewAssociatedConditonPo(String associatedId, String viewId) {
        super();
        this.associatedId = associatedId;
        this.viewId = viewId;
    }

    public DataViewAssociatedConditonPo(String mainTableName,
            String mainColumnName, String childTableName,
            String childColumnName, String comparison) {
        super(mainTableName, mainColumnName, childTableName, childColumnName,
                comparison);
        // TODO Auto-generated constructor stub
    }

    public DataViewAssociatedConditonPo(String mainTableName,
            String mainColumnName, String childTableName,
            String childColumnName, String comparison, String associatedId,
            String viewId) {
        super(mainTableName, mainColumnName, childTableName, childColumnName,
                comparison);
        this.associatedId = associatedId;
        this.viewId = viewId;
    }

    public String getAssociatedId() {
        return associatedId;
    }

    public void setAssociatedId(String associatedId) {
        this.associatedId = associatedId;
    }

    public String getViewId() {
        return viewId;
    }

    public void setViewId(String viewId) {
        this.viewId = viewId;
    }

}
