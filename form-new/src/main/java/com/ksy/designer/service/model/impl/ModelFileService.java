package com.ksy.designer.service.model.impl;

import java.io.File;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.ksy.designer.SpringUtils;
import com.ksy.designer.common.DesignerException;
import com.ksy.designer.entity.model.ModelComponentEnum;
import com.ksy.designer.service.DesignerEnvService;
import com.ksy.designer.service.FileService;
import com.ksy.designer.service.model.IModelComponentChecker;
import com.ksy.designer.service.model.ModelDefinitionService;

@Service
public class ModelFileService extends FileService {
    private static final Logger LOGGER = Logger.getLogger(ModelFileService.class.getName());
    @Resource
    private DesignerEnvService designerEnvService;
    @Resource
    private ModelDefinitionService modelDefinitionService;

    @Override
    protected String checkContent(String content, String fileName) throws DesignerException {
        ModelComponentEnum modelComponentType = getModelComponentType(fileName);
        IModelComponentChecker modelComponentChecker = (IModelComponentChecker)SpringUtils.getApplicationContext().getBean(modelComponentType.getModelCompentService()); 
        modelComponentChecker.checkContent(fileName.substring(0, fileName.lastIndexOf(".")), content);
        return content;
    }

    @Override
    protected String getDataDir(String fileName) throws DesignerException {
        if (StringUtils.isBlank(fileName)) {
            return designerEnvService.getDesignerDataDir();
        }
        ModelComponentEnum componentType = getModelComponentType(fileName);
        return designerEnvService.getDesignerDataDir() + File.separator + componentType.getDataDirName();
    }

    private ModelComponentEnum getModelComponentType(String fileName) throws DesignerException {
        ModelComponentEnum[] values = ModelComponentEnum.values();
        for (ModelComponentEnum modelComponentEnum : values) {
            if (fileName.endsWith(modelComponentEnum.getSuffixName())) {
                return modelComponentEnum;
            }
        }
        throw new DesignerException("非法文件类型。文件名：" + fileName);
    }
}
