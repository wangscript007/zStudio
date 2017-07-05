package com.ksy.designer.service.model;

import com.ksy.designer.common.DesignerException;

public interface IModelComponentChecker {
    void checkContent(String modelComponentId, String content) throws DesignerException;
}
