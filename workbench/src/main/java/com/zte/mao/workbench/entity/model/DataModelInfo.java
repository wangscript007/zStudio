package com.zte.mao.workbench.entity.model;

import java.util.List;

public class DataModelInfo {
    private DataModelBaisc baisc;
    private List<DataModelItem> itemList;
    private List<DataModelGroup> groupList;

    public DataModelInfo() {
        this(null, null, null);
    }

    public DataModelInfo(DataModelBaisc baisc, List<DataModelItem> itemList, List<DataModelGroup> groupList) {
        this.baisc = baisc;
        this.itemList = itemList;
        this.groupList = groupList;
    }

    public DataModelBaisc getBaisc() {
        return baisc;
    }

    public void setBaisc(DataModelBaisc baisc) {
        this.baisc = baisc;
    }

    public List<DataModelItem> getItemList() {
        return itemList;
    }

    public void setItemList(List<DataModelItem> itemList) {
        this.itemList = itemList;
    }

    public List<DataModelGroup> getGroupList() {
        return groupList;
    }

    public void setGroupList(List<DataModelGroup> groupList) {
        this.groupList = groupList;
    }
}
