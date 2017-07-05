package com.zte.iui.layoutit.common;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import org.springframework.util.StringUtils;
import org.apache.log4j.Logger;

public class ConfigFileManage {
	private static Logger logger = Logger.getLogger(ConfigFileManage.class.getName());
	private static final String configFilePath = "designer-config.properties";
	private static final String SAVE_FRAME_PATH = "save_frame_path";
	private static final String LOCAL_PREVIEW_PATH = "local_preview_path";
	private static final String LOCAL_PREVIEW_IP = "local_preview_ip";
	private static final String LOCAL_PREVIEW_PORT = "local_preview_port";
	private static final String LOCA_PREVIEW_PREFIX = "local_preview_prefix";
	
	private static final String IS_CSV_FILE = "isCsvFile";
	private static final String IS_LOAD_MSB_DATA = "is_load_msb_data";
	
	private static final String EXTENSION_DATASOURCE_FILEPATH = "extension.datasource.filepath";

	private Properties properties = null;
	public static ConfigFileManage instance = new ConfigFileManage();

	private ConfigFileManage() {
		InputStream in = new BufferedInputStream(ConfigFileManage.class
				.getClassLoader().getResourceAsStream(configFilePath));
		properties = new Properties();
		try {
			properties.load(in);
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		}
	}

	/**
	 * 返回保存框架文件路径
	 * 
	 * @return 如果没有配置则返回System.getProperty( "java.class.path"
	 *         )).getParentFile().getParent() + /layoutit/frame/。
	 */
	public String getFramePath() {
		String framePath = getProperty(SAVE_FRAME_PATH);
		if (framePath.length() == 0) {
			framePath = new File(System.getProperty("java.class.path"))
					.getParentFile().getParent() + "/layoutit/frame/";
		}
		return framePath;
	}
	
	/**
	 * 是否生成对应的csv文件
	 * @return
	 */
	public boolean isCsvFile() {
		String csvFile = getProperty(IS_CSV_FILE);
		if (csvFile.length() == 0) {
			return false;
		}
		return Boolean.parseBoolean(csvFile);
	}
	
	/**
	 * 是否加载MSB数据源
	 * @return
	 */
	public boolean isLoadMSBData() {
		String isLoadMSBData = getProperty(IS_LOAD_MSB_DATA);
		if (isLoadMSBData.length() == 0) {
			return false;
		}
		return Boolean.parseBoolean(isLoadMSBData);
	}
	
	/**
	 * 扩展数据源存放路径
	 * @return
	 */
	public String getExtensionDataSourceFilePath() {
		String filePath = getProperty(EXTENSION_DATASOURCE_FILEPATH);		
		if (StringUtils.isEmpty(filePath)) {
			filePath = "json-extension/datasource/";
		}
		
		return filePath;
	}

	/**
	 * 返回预览文件路径，该路径必须配置在tomcat或者jetty下面，并且该目录下的文件可以随时修改
	 * 
	 * @return
	 * @throws Exception
	 */
	public String getPreviewPath() throws Exception {
		String previewPath = getProperty(LOCAL_PREVIEW_PATH);
		if (previewPath == null || previewPath.length() == 0) {
			throw new Exception("本地预览路径不能配置为空，请重新配置。");
		}
		return previewPath;
	}

	public String getPreviewPrefixURL() {
		return "http://" + getProperty(LOCAL_PREVIEW_IP)
				+ getProperty(LOCAL_PREVIEW_PORT)
				+ getProperty(LOCA_PREVIEW_PREFIX);
	}

	public String getProperty(String key) {
		Object value = properties.get(key);
		if (value != null) {
			return value.toString();
		}
		return "";
	}

//	public static void main(String[] args) throws Exception {
//		ConfigFileManage configFileManage = new ConfigFileManage();
//	}
}
