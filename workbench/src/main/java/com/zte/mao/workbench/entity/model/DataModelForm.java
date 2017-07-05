package com.zte.mao.workbench.entity.model;

public class DataModelForm {
    private String formId;
    private String formName;
    private String modelId;
    private String modelName;
    private String bindTable;

    public String getFormId() {
        return formId;
    }

    public DataModelForm setFormId(String formId) {
        this.formId = formId;
        return this;
    }

    public String getFormName() {
        return formName;
    }

    public DataModelForm setFormName(String formName) {
        this.formName = formName;
        return this;
    }

    public String getModelId() {
        return modelId;
    }

    public DataModelForm setModelId(String modelId) {
        this.modelId = modelId;
        return this;
    }

    public String getModelName() {
        return modelName;
    }

    public DataModelForm setModelName(String modelName) {
        this.modelName = modelName;
        return this;
    }

    public String getBindTable() {
        return bindTable;
    }

    public DataModelForm setBindTable(String bindTable) {
        this.bindTable = bindTable;
        return this;
    }
}
