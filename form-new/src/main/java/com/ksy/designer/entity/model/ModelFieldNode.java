package com.ksy.designer.entity.model;

import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.lang3.ObjectUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ModelFieldNode extends ModelNode {
    private Map<ModelFieldAttributeEnum, Object> attributeMap;
    
    public ModelFieldNode(String id, String name) {
        super(id, name);
        attributeMap = new LinkedHashMap<ModelFieldAttributeEnum, Object>();
    }

    @Override
    public int getType() {
        return TYPE_FIELD;
    }

    public Map<ModelFieldAttributeEnum, Object> getAttributeMap() {
        return attributeMap;
    }

    public void put(ModelFieldAttributeEnum key, Object value) {
        attributeMap.put(key, value);
    }

    public void putAll(Map<? extends ModelFieldAttributeEnum, ? extends Object> m) {
        attributeMap.putAll(m);
    }
    
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = super.hashCode();
        result = prime * result + ((attributeMap == null) ? 0 : attributeMap.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (!super.equals(obj))
            return false;
        if (getClass() != obj.getClass())
            return false;
        ModelFieldNode other = (ModelFieldNode) obj;
        if (!ObjectUtils.equals(this.attributeMap, other.attributeMap)) {
            return false;
        }
        return true;
    }

    public static void main(String[] args) {
        ModelFieldNode fieldNode = new ModelFieldNode("userid","用户编号");
        fieldNode.put(ModelFieldAttributeEnum.DEFAULT, "122");
        fieldNode.put(ModelFieldAttributeEnum.LENGTH, new Integer(10));
        fieldNode.put(ModelFieldAttributeEnum.NULLABLE, Boolean.FALSE);

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            System.out.println(objectMapper.writeValueAsString(fieldNode));
        } catch (JsonProcessingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}
