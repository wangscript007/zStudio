package com.zte.mao.common.config;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;
import java.util.Properties;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

public abstract class AbstractMaoProperties {
    private static final Logger dmsg = Logger.getLogger(AbstractMaoProperties.class.getName());
    private Properties properties;

    protected AbstractMaoProperties() {
        properties = new Properties();
        URL commonConfigURL = AbstractMaoProperties.class.getClassLoader().getResource(getConfigName());
        if (commonConfigURL != null) {
            try {
                properties.load(new FileInputStream(new File(commonConfigURL.getFile())));
            } catch (IOException e) {
                dmsg.error(e.getMessage(), e);
//                throw new MaoCommonException(e.getLocalizedMessage(), e);
            }
        }
    }

    /**
     * 获取配置文件名称,相对于WEB-INF\classes路径
     * @return
     */
    protected abstract String getConfigName();

    public String getProperty(String propertyName) {
        String value = properties.getProperty(propertyName);
        return StringUtils.trimToEmpty(value);
    }
}
