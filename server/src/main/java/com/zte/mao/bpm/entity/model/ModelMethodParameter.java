package com.zte.mao.bpm.entity.model;

import com.zte.mao.bpm.def.VDataModelMethodParameter;

public class ModelMethodParameter {
    public static final int ENUM_MAP_TYPE_BIND = VDataModelMethodParameter.ENUM_MAP_TYPE_BIND;
    public static final int ENUM_MAP_TYPE_CONST = VDataModelMethodParameter.ENUM_MAP_TYPE_CONST;

    private String modelId;
    private String methodId;
    private String bizVariableId;
    private ModelItem modelItem;
    private int parameterType;
    private int mapType;
    private String mapValue;

    public String getModelId() {
        return modelId;
    }

    public ModelMethodParameter setModelId(String modelId) {
        this.modelId = modelId;
        return this;
    }

    public String getMethodId() {
        return methodId;
    }

    public ModelMethodParameter setMethodId(String methodId) {
        this.methodId = methodId;
        return this;
    }

    public String getBizVariableId() {
        return bizVariableId;
    }

    public ModelMethodParameter setBizVariableId(String bizVariableId) {
        this.bizVariableId = bizVariableId;
        return this;
    }

    public ModelItem getModelItem() {
        return modelItem;
    }

    public ModelMethodParameter setModelItem(ModelItem modelItem) {
        this.modelItem = modelItem;
        return this;
    }

    public int getParameterType() {
        return parameterType;
    }

    public ModelMethodParameter setParameterType(int parameterType) {
        this.parameterType = parameterType;
        return this;
    }

    public int getMapType() {
        return mapType;
    }

    public ModelMethodParameter setMapType(int mapType) {
        this.mapType = mapType;
        return this;
    }

    public String getMapValue() {
        return mapValue;
    }

    public ModelMethodParameter setMapValue(String mapValue) {
        this.mapValue = mapValue;
        return this;
    }
}
