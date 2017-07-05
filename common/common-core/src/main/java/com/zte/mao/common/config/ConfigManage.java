package com.zte.mao.common.config;

import org.apache.commons.lang3.StringUtils;

public class ConfigManage {
    private static MaoExtraProperties extraProperties;
    private static MaoCommonProperties commonProperties;
    private static ConfigManage instance = null;

	private String platformType = "";

	private ConfigManage() {
	    commonProperties = MaoCommonProperties.getInstance();
	    extraProperties = MaoExtraProperties.getInstance();
	}

	/**
	 * 获取单实例
	 * @return
	 */
	public static synchronized ConfigManage getInstance() {
		if(instance == null) {
			instance = new ConfigManage();
		}
		return instance;
	}
	
	public String getPlatformType() {
		if(StringUtils.isBlank(platformType)) {
			platformType = getProperty("platform.type");	
		}
		return platformType;
	}
	
	public boolean isSupportProcess() {
		String isSupportProcess = getProperty("application.flag");
		if(StringUtils.isNotBlank(isSupportProcess)) {
			return Boolean.parseBoolean(isSupportProcess);
		}
		return false;
	}
	
    public String getFixedDatabase() {
        return getProperty("fixDatabase");
    }

    public String getProperty(String key) {
        String value = extraProperties.getProperty(key);
        value = StringUtils.trimToEmpty(value);
        if (StringUtils.isBlank(value)) {
            return commonProperties.getProperty(key);
        }
        return value;
    }

//	public static void main(String[] args) throws Exception {
//		ConfigFileManage configFileManage = new ConfigFileManage();
//	}
}
