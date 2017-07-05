package com.zte.iui.layoutit.common;

import java.io.File;
import java.util.regex.Matcher;

import org.apache.log4j.Logger;

public class CommonUtility {
	private static Logger logger = Logger.getLogger(CommonUtility.class.getName());
	/**
	 * 根据参数名解析参数
	 * 
	 * @param parameter
	 * @param field
	 * @return
	 */
	public static String getParamValue(String parameter, String field) {
		if (parameter != null && parameter.length() > 0) {
			int indexOf = parameter.indexOf(";");
			if (parameter.indexOf((field + "=")) > -1) {
				if (indexOf == -1) {
					return parameter.substring((field + "=").length());
				}
				return parameter.substring((field + "=").length(), indexOf);

			}
		}
		return "";
	}
	/**
	 * 获取框架路径
	 * */
	public static String getFramePath() {
		String framePath = "D:/layoutit/frame/";
		try {
			framePath = JaxbReadXml.getFormDesignerProject().getFrameFilePath();
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
		if(!framePath.endsWith("/")) {
			framePath += "/";
		}
		
		framePath = replaceTomcatPath(framePath);
		return framePath;
	}
	
	public static String replaceTomcatPath(String path) {
		if(path.indexOf("{tomcat.home}") > -1) {
			path = path.replace("{tomcat.home}", System.getProperty("catalina.home"));
		}
		return path;
	}
	
	/**
	 * 是否生成对应的csv文件
	 * @return
	 */
	public static boolean isCsvFile() {
		boolean framePath = true;
		try {
			framePath = Boolean.parseBoolean(JaxbReadXml.getFormDesignerProject().getIsCsvFile());
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
		return framePath;
	}
	
	/**
	 * 获取designer路径
	 * @return
	 */
	public static String getDesignerPath() {
		return new File(CommonUtility.class.getClassLoader().getResource("/").getPath()).getParentFile().getParentFile().getPath();
	}
}
