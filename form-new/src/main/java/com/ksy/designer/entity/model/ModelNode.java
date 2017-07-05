package com.ksy.designer.entity.model;

import org.apache.commons.lang3.ObjectUtils;

public abstract class ModelNode {
    public static final int TYPE_ROOT = 0;
    public static final int TYPE_FIELD = 1;
    public static final int TYPE_GROUP = 2;
    private String id;
    private String name;

    public ModelNode(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public abstract int getType();

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
        ModelNode other = (ModelNode) obj;
        if (!ObjectUtils.equals(this.id, other.id)) {
            return false;
        }
        if (!ObjectUtils.equals(this.name, other.name)) {
            return false;
        }
        return true;
    }
}
