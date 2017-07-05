package com.zte.mao.workbench.entity.model;

public class DataViewAssociatedConditon {
    private String mainTableName;
    private String mainColumnName;
    private String childTableName;
    private String childColumnName;
    private String comparison;

    public DataViewAssociatedConditon() {
        super();
        // TODO Auto-generated constructor stub
    }

    public DataViewAssociatedConditon(String mainTableName,
            String mainColumnName, String childTableName,
            String childColumnName, String comparison) {
        super();
        this.mainTableName = mainTableName;
        this.mainColumnName = mainColumnName;
        this.childTableName = childTableName;
        this.childColumnName = childColumnName;
        this.comparison = comparison;
    }

    public String getMainTableName() {
        return mainTableName;
    }

    public void setMainTableName(String mainTableName) {
        this.mainTableName = mainTableName;
    }

    public String getMainColumnName() {
        return mainColumnName;
    }

    public void setMainColumnName(String mainColumnName) {
        this.mainColumnName = mainColumnName;
    }

    public String getChildTableName() {
        return childTableName;
    }

    public void setChildTableName(String childTableName) {
        this.childTableName = childTableName;
    }

    public String getChildColumnName() {
        return childColumnName;
    }

    public void setChildColumnName(String childColumnName) {
        this.childColumnName = childColumnName;
    }

    public String getComparison() {
        return comparison;
    }

    public void setComparison(String comparison) {
        this.comparison = comparison;
    }


}
