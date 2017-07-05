package com.ksy.designer.service;

import java.util.List;

import com.ksy.designer.common.DesignerException;
import com.ksy.designer.entity.IComponent;

public abstract class AbstractComponentService {

    public abstract List<IComponent> getComponentList() throws DesignerException;
}
