package com.ksy.designer.entity.model;

public interface IModelMethod {
    String getName();
    String getId();
    String getInputModel();
    String getOutputModel();
    ModelRequest getRequest();
    String getAdapterId();
}
