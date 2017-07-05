package com.ksy.designer.service.form.impl;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ksy.designer.common.DesignerException;
import com.ksy.designer.entity.IComponent;
import com.ksy.designer.entity.form.FormComponent;
import com.ksy.designer.service.AbstractComponentService;
import com.ksy.designer.service.DesignerEnvService;

@Service
public class FormComponentService extends AbstractComponentService {
    private static final Logger LOGGER = Logger.getLogger(AbstractComponentService.class.getName());
    private static final String COMPONET_RELATIVE_PATH = "components";
    private static final String COMPONET_CONTENT_FILE_NAME = "content.json";
    @Resource
    private DesignerEnvService designerEnvService;

    public List<IComponent> getComponentList() throws DesignerException {
        List<IComponent> componentList = new ArrayList<IComponent>();
        String productHome = designerEnvService.getProductHome();
        String componentsPath = productHome + File.separator + COMPONET_RELATIVE_PATH; 
        File componentsDirFile = new File(componentsPath);
        if (componentsDirFile.exists() == false || componentsDirFile.isDirectory() == false) {
            return componentList;
        }
        File[] componentsFiles = componentsDirFile.listFiles();
        ObjectMapper objectMapper = new ObjectMapper();
        for (int i = 0; i < componentsFiles.length; i++) {
            if (componentsFiles[i].isDirectory() == false) {
                continue;
            }
            File file = FileUtils.getFile(componentsFiles[i], COMPONET_CONTENT_FILE_NAME);
            if (file.exists() && file.isFile() ) {
                try {
                    IComponent component = new FormComponent(componentsFiles[i].getName(), "", objectMapper.readValue(file, Map.class));
                    componentList.add(component);
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
            }
        }
        return componentList;
    }

}
