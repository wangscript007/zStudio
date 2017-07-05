package com.ksy.designer.entity.model.impl;

import org.apache.commons.lang3.ObjectUtils;

import com.ksy.designer.entity.model.IModelMethod;
import com.ksy.designer.entity.model.ModelRequest;

public class ModelMethodImpl implements IModelMethod {
    private String name;
    private String id;
    private String inputModel;
    private String outputModel;
    private ModelRequest request;
    private String adapterId;

    public ModelMethodImpl() {
    }

    public ModelMethodImpl(String id,
                            String name,
                            String inputModel,
                            String outputModel,
                            ModelRequest request,
                            String adapterId) {
        this.name = name;
        this.id = id;
        this.inputModel = inputModel;
        this.outputModel = outputModel;
        this.request = request;
        this.adapterId = adapterId;
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
    public String getInputModel() {
        return this.inputModel;
    }

    @Override
    public String getOutputModel() {
        return this.outputModel;
    }

    @Override
    public ModelRequest getRequest() {
        return this.request;
    }

    @Override
    public String getAdapterId() {
        return this.adapterId;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((adapterId == null) ? 0 : adapterId.hashCode());
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((inputModel == null) ? 0 : inputModel.hashCode());
        result = prime * result + ((name == null) ? 0 : name.hashCode());
        result = prime * result + ((outputModel == null) ? 0 : outputModel.hashCode());
        result = prime * result + ((request == null) ? 0 : request.hashCode());
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
        ModelMethodImpl other = (ModelMethodImpl) obj;
        if (!ObjectUtils.equals(this.adapterId, other.adapterId)) {
            return false;
        }
        if (!ObjectUtils.equals(this.id, other.id)) {
            return false;
        }
        if (!ObjectUtils.equals(this.inputModel, other.inputModel)) {
            return false;
        }
        if (!ObjectUtils.equals(this.name, other.name)) {
            return false;
        }
        if (!ObjectUtils.equals(this.outputModel, other.outputModel)) {
            return false;
        }
        if (!ObjectUtils.equals(this.request, other.request)) {
            return false;
        }
        return true;
    }
    
}
