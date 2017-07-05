package com.ksy.designer.entity.model;

import org.apache.commons.lang3.ObjectUtils;

public class ModelRequest {
    private String urn;
    private String httpMethod;
    public ModelRequest() {
    }

    public ModelRequest(String urn, String httpMethod) {
        super();
        this.urn = urn;
        this.httpMethod = httpMethod;
    }

    public String getUrn() {
        return urn;
    }

    public void setUrn(String urn) {
        this.urn = urn;
    }

    public String getHttpMethod() {
        return httpMethod;
    }

    public void setHttpMethod(String httpMethod) {
        this.httpMethod = httpMethod;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((httpMethod == null) ? 0 : httpMethod.hashCode());
        result = prime * result + ((urn == null) ? 0 : urn.hashCode());
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
        ModelRequest other = (ModelRequest) obj;
        if (!ObjectUtils.equals(this.httpMethod, other.httpMethod)) {
            return false;
        }
        if (!ObjectUtils.equals(this.urn, other.urn)) {
            return false;
        }
        return true;
    }
}
