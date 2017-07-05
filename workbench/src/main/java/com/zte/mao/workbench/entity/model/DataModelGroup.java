package com.zte.mao.workbench.entity.model;

import java.util.HashMap;
import java.util.Map;

import com.zte.mao.workbench.def.TDataModelGroup;

public class DataModelGroup {
    private String id;
    private String name;
    private String modelId;

    public String getId() {
        return id;
    }

    public DataModelGroup setId(String id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public DataModelGroup setName(String name) {
        this.name = name;
        return this;
    }

    public String getModelId() {
        return modelId;
    }

    public DataModelGroup setModelId(String modelId) {
        this.modelId = modelId;
        return this;
    }

    public Map<String, String> toMap(DataModelGroup dataModelItemGroup) {
        Map<String, String> map = new HashMap<String, String>();
        map.put(TDataModelGroup.COL_NAME_ID, String.valueOf(dataModelItemGroup.getId()));
        map.put(TDataModelGroup.COL_NAME_NAME, dataModelItemGroup.getName());
        map.put(TDataModelGroup.COL_NAME_MODEL_ID, dataModelItemGroup.getModelId());
        return map;
    }
}
