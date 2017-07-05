package com.zte.mao.bpm.entity.model;

public class ModelMethodBizServiceMethod {
    private String modelMethodId;
    private String modelId;
    private String bizServiceId;
    private String bizMethodId;
    private String bizMethodExpression;
    private String dataSourceMethod;

    public String getModelMethodId() {
        return modelMethodId;
    }

    public ModelMethodBizServiceMethod setModelMethodId(String modelMethodId) {
        this.modelMethodId = modelMethodId;
        return this;
    }

    public String getModelId() {
        return modelId;
    }

    public ModelMethodBizServiceMethod setModelId(String modelId) {
        this.modelId = modelId;
        return this;
    }

    public String getBizServiceId() {
        return bizServiceId;
    }

    public ModelMethodBizServiceMethod setBizServiceId(String bizServiceId) {
        this.bizServiceId = bizServiceId;
        return this;
    }

    public String getBizMethodId() {
        return bizMethodId;
    }

    public ModelMethodBizServiceMethod setBizMethodId(String bizMethodId) {
        this.bizMethodId = bizMethodId;
        return this;
    }

    public String getBizMethodExpression() {
        return bizMethodExpression;
    }

    public ModelMethodBizServiceMethod setBizMethodExpression(String bizMethodExpression) {
        this.bizMethodExpression = bizMethodExpression;
        return this;
    }

    public String getDataSourceMethod() {
        return dataSourceMethod;
    }

    public ModelMethodBizServiceMethod setDataSourceMethod(String dataSourceMethod) {
        this.dataSourceMethod = dataSourceMethod;
        return this;
    }
}
