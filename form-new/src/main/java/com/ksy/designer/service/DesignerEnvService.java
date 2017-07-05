package com.ksy.designer.service;

import java.io.File;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.web.context.support.XmlWebApplicationContext;

import com.ksy.designer.SpringUtils;
import com.ksy.designer.common.ConfigFileManage;
import com.ksy.designer.entity.ISystemConfig;
import com.ksy.designer.entity.config.SystemConfig;

@Service
public class DesignerEnvService {
    public static final String DESIGNER_CONFIG_PROPERTIES = "designer-config.properties";

    private static final Logger LOGGER = Logger.getLogger(DesignerEnvService.class.getName());
    private static final String PRODUCT_TYPE = "designer.product.type";
    private ConfigFileManage configFileManager;

    public DesignerEnvService() {
        configFileManager = ConfigFileManage.getInstance();
    }

    public ISystemConfig getSystemConfig() {
        return new SystemConfig(configFileManager.getProperties());
    }

    public String getProductType() {
        return configFileManager.getProperty(PRODUCT_TYPE);
    }

    public String getDesignerHome() {
        return System.getProperty("catalina.home");
    }

    public String getDesignerFilesDir() {
        return getDesignerDataDir() + File.separator + configFileManager.getProperty("designer.files");
    }

    public String getDesignerDataDir() {
        String dataDir;
        if (configFileManager.containsKey("data.dir")) {
            dataDir = configFileManager.getProperty("data.dir");
        } else {
            dataDir = getDesignerHome() + File.separator + "data";
        }
        return dataDir + File.separator + configFileManager.getScene();
    }

    public String getAppHomePath() {
        return ((XmlWebApplicationContext)SpringUtils.getApplicationContext()).getServletContext().getRealPath("/");
    }

    public String getProductHome() {
        return getAppHomePath() + File.separator +
               "app" + File.separator +
               getProductType();
    }
}
