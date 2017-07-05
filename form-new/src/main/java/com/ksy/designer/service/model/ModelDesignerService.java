package com.ksy.designer.service.model;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.ksy.designer.entity.model.IModelDefinition;
import com.ksy.designer.entity.model.IModelMethod;
import com.ksy.designer.service.DesignerEnvService;

@Service
public class ModelDesignerService {
    private static final Logger LOGGER = Logger.getLogger(ModelDesignerService.class.getName());
    @Resource
    private ModelDefinitionService modelDefinitionService;
    @Resource
    private ModelMethodService modelMethodService;
    @Resource
    private DesignerEnvService designerEnvService;

    public List<IModelDefinition> getModelDef() {
        return modelDefinitionService.getModelDefs(null);
    }

    public List<IModelMethod> getModelMethod() {
        return modelMethodService.getModelMethod();
    }

    public Map<String,List<?>> getModelMethodWithDef() {
        List<IModelMethod> modelMethodList = modelMethodService.getModelMethod();
        Set<String> modelDefIdList = new HashSet<String>();
        for (IModelMethod modelMethod : modelMethodList) {
            modelDefIdList.add(modelMethod.getInputModel());
            modelDefIdList.add(modelMethod.getOutputModel());
        }
        List<IModelDefinition> modelDefList = modelDefinitionService.getModelDefs(modelDefIdList.toArray(new String[modelDefIdList.size()]));
        filterModelMethodByDef(modelMethodList, modelDefList);
        Map<String, List<?>> modelInfoMap = new LinkedHashMap<String, List<?>>();
        modelInfoMap.put("methodList", modelMethodList);
        modelInfoMap.put("defList", modelDefList);
        return modelInfoMap; 
    }

    private void filterModelMethodByDef(List<IModelMethod> modelMethodList, List<IModelDefinition> modelDefList) {
        Set<String> modelDefIdSet = new HashSet<String>();
        for (IModelDefinition modelDef : modelDefList) {
            modelDefIdSet.add(modelDef.getId());
        }
        for (Iterator<IModelMethod> iterator = modelMethodList.iterator(); iterator.hasNext();) {
            IModelMethod modelMethod = iterator.next();
            if (modelDefIdSet.contains(modelMethod.getInputModel()) == false) {
                LOGGER.warn(
                        String.format("The nonexistent model definition is referenced by model method.Model method ID: %s, Model definition ID: %s.",
                                modelMethod.getId(), modelMethod.getInputModel()));
                iterator.remove();
                continue;
            }
            if (modelDefIdSet.contains(modelMethod.getOutputModel()) == false) {
                LOGGER.warn(
                        String.format("The nonexistent model definition is referenced by model method.Model method ID: %s, Model definition ID: %s.",
                                modelMethod.getId(), modelMethod.getOutputModel()));
                iterator.remove();
                continue;
            }
        }
    }
}
