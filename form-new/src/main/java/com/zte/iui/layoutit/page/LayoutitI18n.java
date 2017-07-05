package com.zte.iui.layoutit.page;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.Properties;

public class LayoutitI18n {
	@SuppressWarnings("rawtypes")
	public List<String> getPropertiesKey(String path) throws Exception {
		Properties prop = new Properties();
		List<String> i18nKeyList = new ArrayList<String>();
		
		File file = new File(this.getClass().getResource("/").getPath());
		String filePath = file.getParent().substring(0,file.getParent().indexOf("WEB-INF"));
		String realPath = filePath + path.replace("/", File.separator);
		
		InputStream inputStream = new FileInputStream(realPath);
		BufferedReader bf = new BufferedReader(new InputStreamReader(inputStream, "utf-8"));
		prop.load(bf);
		Enumeration en = prop.propertyNames();
		while (en.hasMoreElements()) {
			String i18nKey = (String) en.nextElement();
			i18nKeyList.add(i18nKey);
		}
		inputStream.close();
		
		return i18nKeyList;
	}
}
