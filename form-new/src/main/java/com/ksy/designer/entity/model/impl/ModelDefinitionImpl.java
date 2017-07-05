package com.ksy.designer.entity.model.impl;

import com.ksy.designer.entity.model.IModelDefinition;
import com.ksy.designer.entity.model.ModelGroupNode;

public class ModelDefinitionImpl extends ModelGroupNode implements IModelDefinition {

    public ModelDefinitionImpl(String id, String name) {
        super(id, name);
    }

    @Override
    public int getType() {
        return TYPE_ROOT;
    }
}
