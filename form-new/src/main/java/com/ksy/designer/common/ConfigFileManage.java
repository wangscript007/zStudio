package com.ksy.designer.common;

import java.io.IOException;
import java.util.Properties;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.core.io.support.PropertiesLoaderUtils;

public class ConfigFileManage {
    public static final String SCENE_FORM_DESIGNER = "form";
    public static final String SCENE_CHART_DESIGNER = "chart";
    public static final String SCENE_MODEL_DESIGNER = "model";
    private static Logger logger = Logger.getLogger(ConfigFileManage.class.getName());
    private static final String CONFIG_FILE_PATH = "designer-config.properties";
    private static final String DESIGNER_FILES = "designer.files";

    private Properties properties = null;

    private static ConfigFileManage instance = null;

    private ConfigFileManage() {
        try {
            properties = PropertiesLoaderUtils.loadAllProperties(CONFIG_FILE_PATH);
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
            throw new RuntimeException("加载系统配置文件失败。");
        }
    }

    public static synchronized ConfigFileManage getInstance() {
        if (instance == null) {
            synchronized (ConfigFileManage.class) {
                if (instance == null) {
                    instance = new ConfigFileManage();
                }
            }
        }
        return instance;
    }

    /**
     * 返回设计文件存放路径，默认为tomcatHome/designer/files
     * 
     * @return
     * @throws DesignerException
     */
    public String getFramePath() throws DesignerException {
        String framePath = getProperty(DESIGNER_FILES);
        if (StringUtils.isBlank(framePath)) {
            throw new DesignerException("Designer Files Path is not config", null);
        }
        return framePath;
    }

    public String getProperty(String key) {
        Object value = properties.get(key);
        if (value != null) {
            return value.toString();
        }
        return null;
    }

    public boolean containsKey(Object key) {
        return properties.containsKey(key);
    }

    public Properties getProperties() {
        return properties;
    }

    public String getScene() {
        return getProperty("designer.scene");
    }
}
