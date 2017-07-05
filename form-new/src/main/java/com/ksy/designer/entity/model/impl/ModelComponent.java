package com.ksy.designer.entity.model.impl;

import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ksy.designer.common.DesignerException;
import com.ksy.designer.entity.IComponent;
import com.ksy.designer.entity.model.IModelDefinition;
import com.ksy.designer.entity.model.IModelMethod;

public class ModelComponent implements IComponent {
    private String id;
    private String name;
    private Map<?, ?> attributeMap;

    public ModelComponent(String id, String name, Map<?, ?> attributeMap) {
        this.id = id;
        this.name = name;
        this.attributeMap = attributeMap;
    }

    public static ModelComponent getModelComponent(IModelDefinition modelDef) throws DesignerException {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            Map<?, ?> attributeMap = objectMapper.readValue(objectMapper.writeValueAsString(modelDef), Map.class);
            return new ModelComponent(modelDef.getId(), modelDef.getName(), attributeMap);
        } catch (Exception e) {
            throw new DesignerException(e.getLocalizedMessage(), e);
        }
    }

    public static ModelComponent getModelComponent(IModelMethod modelSvc) throws DesignerException {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            Map<?, ?> attributeMap = objectMapper.readValue(objectMapper.writeValueAsString(modelSvc), Map.class);
            return new ModelComponent(modelSvc.getId(), modelSvc.getName(), attributeMap);
        } catch (Exception e) {
            throw new DesignerException(e.getLocalizedMessage(), e);
        }
    }

    @Override
    public String getName() {
        return this.name;
    }

    @Override
    public String getId() {
        return this.id;
    }

    @Override
    public Map<?, ?> getAttribute() {
        return this.attributeMap;
    }

}
