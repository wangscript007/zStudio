package com.zte.mao.workbench.response.model;

import java.util.Collection;
import java.util.Map;

public class DataModelDefinition {
    private String id;
    private String name;
    private String bindTable;
    private Collection<DataModelMetadata> metadata;
    private Map<String, String> groupMap;

    public DataModelDefinition(
            String id,
            String name,
            String bindTable,
            Collection<DataModelMetadata> metadata,
            Map<String, String> groupMap) {
        this.id = id;
        this.name = name;
        this.bindTable = bindTable;
        this.metadata = metadata;
        this.groupMap = groupMap;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getBind_table() {
        return bindTable;
    }

    public Collection<DataModelMetadata> getMetadata() {
        return metadata;
    }

    public Map<String, String> getGroupMap() {
        return groupMap;
    }
}
