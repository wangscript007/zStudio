package com.zte.mao.workbench.response.model;

import com.zte.mao.workbench.entity.model.DataModelItem;

public class DataModelMetadata {
    private String itemId;
    private String itemName;
    private int itemType;
    private int itemLenth;
    private int itemDecimal = 0;
    private String itemDefault;
    private boolean isRequired = false;
    private boolean isInputPara = false;
    private boolean isOutputPara = true;
    private int componentType;
    private boolean uiVisible;
    private int layout;
    private int dataBlock;
    
    public DataModelMetadata() {
    }

    public DataModelMetadata(DataModelItem modelItem) {
        this.itemId = modelItem.getId();
        this.itemName = modelItem.getName();
        this.itemType = modelItem.getType();
        this.itemLenth = modelItem.getLenth();
        this.itemDecimal = modelItem.getDecimal();
        this.itemDefault = modelItem.getDefaultValue();
        this.isRequired = !modelItem.isNull();
        this.isInputPara = modelItem.isFilter();
        this.componentType = modelItem.getComponentType();
        this.uiVisible = modelItem.isUiVisible();
        this.layout = modelItem.getLayout();
        this.dataBlock = modelItem.getDataBlock();
    }

    public String getItem_id() {
        return itemId;
    }

    public DataModelMetadata setItemId(String itemId) {
        this.itemId = itemId;
        return this;
    }

    public String getItem_name() {
        return itemName;
    }

    public DataModelMetadata setItemName(String itemName) {
        this.itemName = itemName;
        return this;
    }

    public int getItem_type() {
        return itemType;
    }

    public DataModelMetadata setItemType(int itemType) {
        this.itemType = itemType;
        return this;
    }

    public int getItem_lenth() {
        return itemLenth;
    }

    public DataModelMetadata setItemLenth(int itemLenth) {
        this.itemLenth = itemLenth;
        return this;
    }

    public int getItem_decimal() {
        return itemDecimal;
    }

    public DataModelMetadata setItemDecimal(int itemDecimal) {
        this.itemDecimal = itemDecimal;
        return this;
    }

    public String getItem_default() {
        return itemDefault;
    }

    public void setItemDefault(String itemDefault) {
        this.itemDefault = itemDefault;
    }

    public boolean isRequired() {
        return isRequired;
    }

    public DataModelMetadata setRequired(boolean isRequired) {
        this.isRequired = isRequired;
        return this;
    }

    public boolean isInputPara() {
        return isInputPara;
    }

    public DataModelMetadata setInputPara(boolean isInputPara) {
        this.isInputPara = isInputPara;
        return this;
    }

    public boolean isOutputPara() {
        return isOutputPara;
    }

    public DataModelMetadata setOutputPara(boolean isOutputPara) {
        this.isOutputPara = isOutputPara;
        return this;
    }

    public int getComponent_type() {
        return componentType;
    }

    public DataModelMetadata setComponentType(int componentType) {
        this.componentType = componentType;
        return this;
    }

    public boolean isUi_visible() {
        return uiVisible;
    }

    public DataModelMetadata setUiVisible(boolean uiVisible) {
        this.uiVisible = uiVisible;
        return this;
    }

    public int getLayout() {
        return layout;
    }

    public DataModelMetadata setLayout(int layout) {
        this.layout = layout;
        return this;
    }

    public int getDataBlock() {
        return dataBlock;
    }

    public DataModelMetadata setDataBlock(int dataBlock) {
        this.dataBlock = dataBlock;
        return this;
    }
}
