package com.zte.mao.bpm.entity.model;

import com.zte.mao.bpm.def.TDataModelItem;

public class ModelItem {
    public static int ENUM_TYPE_STRING = TDataModelItem.ENUM_TYPE_STRING;
    public static int ENUM_TYPE_LONG_STRING = TDataModelItem.ENUM_TYPE_LONG_STRING;
    public static int ENUM_TYPE_BOOLEAN = TDataModelItem.ENUM_TYPE_BOOLEAN;
    public static int ENUM_TYPE_INTERGE = TDataModelItem.ENUM_TYPE_INTERGE;
    public static int ENUM_TYPE_FLOAT = TDataModelItem.ENUM_TYPE_FLOAT;
    public static int ENUM_TYPE_DATE = TDataModelItem.ENUM_TYPE_DATE;

    private String id;
    private String name;
    private String modelId;
    private int type;
    private boolean isNull = true;
    private int lenth;
    private int decimal = 0;
    private String defaultValue;
    private boolean isFilter = false;

    public String getId() {
        return id;
    }

    public ModelItem setId(String id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public ModelItem setName(String name) {
        this.name = name;
        return this;
    }

    public String getModelId() {
        return modelId;
    }

    public ModelItem setModelId(String modelId) {
        this.modelId = modelId;
        return this;
    }

    public int getType() {
        return type;
    }

    public ModelItem setType(int type) {
        this.type = type;
        return this;
    }

    public boolean isNull() {
        return isNull;
    }

    public ModelItem setNull(boolean isNull) {
        this.isNull = isNull;
        return this;
    }

    public int getLenth() {
        return lenth;
    }

    public ModelItem setLenth(int lenth) {
        this.lenth = lenth;
        return this;
    }

    public int getDecimal() {
        return decimal;
    }

    public ModelItem setDecimal(int decimal) {
        this.decimal = decimal;
        return this;
    }

    public String getDefaultValue() {
        return defaultValue;
    }

    public ModelItem setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
        return this;
    }

    public boolean isFilter() {
        return isFilter;
    }

    public ModelItem setFilter(boolean isFilter) {
        this.isFilter = isFilter;
        return this;
    }

}
