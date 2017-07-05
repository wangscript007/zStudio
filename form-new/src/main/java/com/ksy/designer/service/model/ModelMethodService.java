package com.ksy.designer.service.model;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.alibaba.druid.util.StringUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ksy.designer.common.DesignerException;
import com.ksy.designer.entity.model.IModelDefinition;
import com.ksy.designer.entity.model.IModelMethod;
import com.ksy.designer.entity.model.impl.ModelMethodImpl;
import com.ksy.designer.service.DesignerEnvService;

@Service
public class ModelMethodService implements IModelComponentChecker {
    private static final Logger LOGGER = Logger.getLogger(ModelMethodService.class.getName());
    @Resource
    private DesignerEnvService designerEnvService;

    public List<IModelMethod> getModelMethod() {
        List<IModelMethod> modelMtdlist = new ArrayList<IModelMethod>();
        String designerFilesDir = designerEnvService.getDesignerDataDir();
        String modelMtdFileDir = designerFilesDir + File.separator + "method";
        Collection<File> listFiles = FileUtils.listFiles(new File(modelMtdFileDir), new String[] { "mm" }, false);
        ObjectMapper objectMapper = new ObjectMapper();
        for (File file : listFiles) {
            try {
                modelMtdlist.add(objectMapper.readValue(file, ModelMethodImpl.class));
            } catch (IOException e) {
                LOGGER.warn("Failed to read file." + file.getAbsolutePath(), e);
            }
        }
        return modelMtdlist;
    }

    @Override
    public void checkContent(String modelComponentId, String content) throws DesignerException {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            IModelMethod modelMethod = objectMapper.readValue(content, ModelMethodImpl.class);
            if (StringUtils.equals(modelMethod.getId(), modelComponentId) == false) {
                throw new DesignerException("模型定义编号不一致。");
            }
            checkModelMethod(modelMethod);
        } catch (JsonProcessingException e) {
            LOGGER.error(e.getMessage(), e);
            throw new DesignerException(e.getLocalizedMessage(), e);
        } catch (IOException e) {
            LOGGER.error(e.getMessage(), e);
            throw new DesignerException(e.getLocalizedMessage(), e);
        }
    }

    private void checkModelMethod(IModelMethod modelMethod) throws DesignerException {
        // TODO Auto-generated method stub
    }
}
