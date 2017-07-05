package com.ksy.designer.entity.model;

import com.fasterxml.jackson.databind.JsonNode;

public enum ModelFieldAttributeEnum {
    NULLABLE("nullable", DataType.BOOLEAN),
    DEFAULT("default",DataType.STRING),
    PRECISION("precision", DataType.INT),
    LENGTH("length", DataType.INT),
    FIELD_TYPE("fieldType", DataType.INT);
    public static final int DATATYPE_INT = 1;
    private String name;
    private DataType dataType;

    private ModelFieldAttributeEnum(String name, DataType dataType) {
        this.name = name;
        this.dataType = dataType;
    }

    @Override
    public String toString() {
        return name;
    }
    
    public Object getJsonNodeValue(JsonNode node) {
        switch (dataType) {
        case INT:
            return new Integer(node.intValue());
        case BOOLEAN:
            return new Boolean(node.booleanValue());
        default:
            return node.textValue();
        }
    }
    
    private enum DataType{
        INT,STRING,BOOLEAN,DATA;
    }
}
