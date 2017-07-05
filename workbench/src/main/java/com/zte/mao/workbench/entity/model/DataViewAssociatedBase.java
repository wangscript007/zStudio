package com.zte.mao.workbench.entity.model;

public class DataViewAssociatedBase {
    private String associatedType;
    private String associatedTableName;

    public DataViewAssociatedBase() {
        super();
        // TODO Auto-generated constructor stub
    }

    public DataViewAssociatedBase(String associatedType,
            String associatedTableName) {
        super();
        this.associatedType = associatedType;
        this.associatedTableName = associatedTableName;
    }

    public String getAssociatedType() {
        return associatedType;
    }

    public void setAssociatedType(String associatedType) {
        this.associatedType = associatedType;
    }

    public String getAssociatedTableName() {
        return associatedTableName;
    }

    public void setAssociatedTableName(String associatedTableName) {
        this.associatedTableName = associatedTableName;
    }

}
