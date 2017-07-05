package com.zte.mao.workbench.entity.model;

import java.util.List;

public class DataViewInfo {
    private DataViewBase dataViewBase;
    private List<DataViewItem> dataViewItems;
    private List<DataViewAssociated> dataViewAssociateds;
    
    public DataViewInfo() {
        super();
        // TODO Auto-generated constructor stub
    }
    public DataViewInfo(DataViewBase dataViewBase,
            List<DataViewItem> dataViewItems,
            List<DataViewAssociated> dataViewAssociateds) {
        super();
        this.dataViewBase = dataViewBase;
        this.dataViewItems = dataViewItems;
        this.dataViewAssociateds = dataViewAssociateds;
    }
    public DataViewBase getDataViewBase() {
        return dataViewBase;
    }
    public DataViewInfo setDataViewBase(DataViewBase dataViewBase) {
        this.dataViewBase = dataViewBase;
        return this;
    }
    public List<DataViewItem> getDataViewItems() {
        return dataViewItems;
    }
    public DataViewInfo setDataViewItems(List<DataViewItem> dataViewItems) {
        this.dataViewItems = dataViewItems;
        return this;
    }
    public List<DataViewAssociated> getDataViewAssociateds() {
        return dataViewAssociateds;
    }
    public DataViewInfo setDataViewAssociateds(List<DataViewAssociated> dataViewAssociateds) {
        this.dataViewAssociateds = dataViewAssociateds;
        return this;
    }
}
