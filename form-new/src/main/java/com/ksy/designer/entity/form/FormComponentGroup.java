package com.ksy.designer.entity.form;

import java.util.Objects;

import com.ksy.designer.entity.IComponentGroup;

public class FormComponentGroup implements IComponentGroup {
    private String id;
    private String name;

    @Override
    public String getId() {
        return this.id;
    }

    @Override
    public String getName() {
        return this.name;
    }

    public FormComponentGroup setGroupid(String id) {
        this.id = id;
        return this;
    }

    public FormComponentGroup setName(String name) {
        this.name = name;
        return this;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((name == null) ? 0 : name.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        FormComponentGroup other = (FormComponentGroup) obj;
        if (Objects.equals(this.id, other.id) == false) {
            return false;
        }
        if (Objects.equals(this.name, other.name) == false) {
            return false;
        }
        return true;
    }

    
}
