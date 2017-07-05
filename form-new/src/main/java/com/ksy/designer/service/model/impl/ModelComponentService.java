package com.ksy.designer.service.model.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.ksy.designer.common.DesignerException;
import com.ksy.designer.entity.IComponent;
import com.ksy.designer.entity.model.IModelDefinition;
import com.ksy.designer.entity.model.IModelMethod;
import com.ksy.designer.entity.model.impl.ModelComponent;
import com.ksy.designer.service.AbstractComponentService;
import com.ksy.designer.service.model.ModelDesignerService;

@Service
public class ModelComponentService extends AbstractComponentService {
    @Resource
    private ModelDesignerService modelDesignerService; 

    @Override
    public List<IComponent> getComponentList() throws DesignerException {
        List<IComponent> componentlist = new ArrayList<IComponent>();
        List<IModelDefinition> modelDefList = modelDesignerService.getModelDef();
        for (IModelDefinition modelDef : modelDefList) {
            componentlist.add(ModelComponent.getModelComponent(modelDef));
        }
        List<IModelMethod> modelSvcList = modelDesignerService.getModelMethod();
        for (IModelMethod modelSvc : modelSvcList) {
            componentlist.add(ModelComponent.getModelComponent(modelSvc));
        }
        return componentlist;
    }

}
