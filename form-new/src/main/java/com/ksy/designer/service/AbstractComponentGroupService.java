package com.ksy.designer.service;

import java.util.List;

import com.ksy.designer.common.DesignerException;
import com.ksy.designer.entity.IComponentGroup;

public abstract class AbstractComponentGroupService {
    public abstract List<IComponentGroup> getComponentGroupList() throws DesignerException;
}
