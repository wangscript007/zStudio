package com.ksy.designer.service.form.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ksy.designer.common.DesignerException;
import com.ksy.designer.entity.IComponentGroup;
import com.ksy.designer.entity.form.FormComponentGroup;
import com.ksy.designer.service.AbstractComponentGroupService;
import com.ksy.designer.service.DesignerEnvService;

@Service
public class FormComponentGroupService extends AbstractComponentGroupService {
    private static final Logger LOGGER = Logger.getLogger(AbstractComponentGroupService.class.getName());
    private static final String GROUP_FILE_NAME = "component-group.json";

    @Resource
    private DesignerEnvService designerEnvService;

    public List<IComponentGroup> getComponentGroupList() throws DesignerException {
        ObjectMapper objectMapper = new ObjectMapper();
        List<IComponentGroup> groupList;
        try {
            groupList = objectMapper.readValue(new FileInputStream(getGroupFilePath()),
                    new TypeReference<List<FormComponentGroup>>() {});
        } catch (JsonParseException e) {
            LOGGER.error(e.getMessage(), e);
            throw new DesignerException(e.getLocalizedMessage(), e);
        } catch (JsonMappingException e) {
            LOGGER.error(e.getMessage(), e);
            throw new DesignerException(e.getLocalizedMessage(), e);
        } catch (IOException e) {
            LOGGER.error(e.getMessage(), e);
            throw new DesignerException(e.getLocalizedMessage(), e);
        }
        return groupList;
    }

    private String getGroupFilePath() {
        return designerEnvService.getProductHome() + File.separator + GROUP_FILE_NAME;
    }

}
