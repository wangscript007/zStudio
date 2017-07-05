package com.ksy.designer.entity.model;

import com.ksy.designer.service.model.IModelComponentChecker;
import com.ksy.designer.service.model.ModelAdapterService;
import com.ksy.designer.service.model.ModelDefinitionService;
import com.ksy.designer.service.model.ModelMethodService;
import com.ksy.designer.service.model.ModelViewService;

public enum ModelComponentEnum {
    DEFINITION(".md", "def", ModelDefinitionService.class),
    METHOD(".mm", "method", ModelMethodService.class), 
    VIEW(".mv", "view", ModelViewService.class),
    ADAPTER(".ma", "adap", ModelAdapterService.class);
    private String name;
    private String suffixName;
    private String dataDirName;
    private Class<? extends IModelComponentChecker> modelCompentService;

    private ModelComponentEnum(
            String suffixName,
            String dataDirName,
            Class<? extends IModelComponentChecker> modelCompentService) {
        this.name = this.name().toLowerCase();
        this.suffixName = suffixName;
        this.dataDirName = dataDirName;
        this.modelCompentService = modelCompentService;
    }

    public String getSuffixName() {
        return suffixName;
    }

    public String getDataDirName() {
        return dataDirName;
    }

    public Class<?> getModelCompentService() {
        return modelCompentService;
    }

    public String toString() {
        return this.name;
    }
}
