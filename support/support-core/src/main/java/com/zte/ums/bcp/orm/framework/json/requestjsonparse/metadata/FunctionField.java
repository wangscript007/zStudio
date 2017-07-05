package com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata;

import org.apache.commons.lang3.ObjectUtils;

public class FunctionField extends Field {
    private static final long serialVersionUID = 1L;

    private Function function;
    
    public FunctionField(Function function, Field field) {
        super.setDatabaseName(field.getDatabaseName());
        super.setTableName(field.getTableName());
        super.setName(field.getName());
        this.function = function;
    }

    public Function getFunction() {
        return function;
    }

    public void setFunction(Function function) {
        this.function = function;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = super.hashCode();
        result = prime * result + ObjectUtils.hashCode(function);
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
        FunctionField other = (FunctionField) obj;
        if (ObjectUtils.equals(function, other.function) == false) {
            return false;
        }
        return true;
    }
    
}
