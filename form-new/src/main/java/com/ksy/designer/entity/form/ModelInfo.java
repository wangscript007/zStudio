package com.ksy.designer.entity.form;

import java.util.List;

import com.ksy.designer.entity.model.IModelDefinition;
import com.ksy.designer.entity.model.IModelMethod;

public class ModelInfo {
    private List<IModelMethod> modelMethodlist;
    private List<IModelDefinition> modelDefList;

    public ModelInfo(List<IModelMethod> modelMethodlist, List<IModelDefinition> modelDefList) {
        this.modelMethodlist = modelMethodlist;
        this.modelDefList = modelDefList;
    }

    public List<IModelMethod> getModelMethodlist() {
        return modelMethodlist;
    }

    public void setModelMethodlist(List<IModelMethod> modelMethodlist) {
        this.modelMethodlist = modelMethodlist;
    }

    public List<IModelDefinition> getModelDefList() {
        return modelDefList;
    }

    public void setModelDefList(List<IModelDefinition> modelDefList) {
        this.modelDefList = modelDefList;
    }
}
