package com.zte.iui.layoutit.page;

import java.io.File;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.context.ContextLoader;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.iui.layoutit.bean.SourceInfo;
import com.zte.iui.layoutit.common.FileOperation;
import org.apache.log4j.Logger;

@Service
public class LayoutitJSONDataSourceInit {
	private static Logger logger = Logger.getLogger(
			LayoutitJSONDataSourceInit.class.getName());
	@Resource
	private LayoutitProject project;

	public void init() {
		File[] files = this.getFiles();
		if (files == null || files.length <= 0) {
			return;
		}

		for (File file : files) {
			try {
				addSourceInfo(file);
			} catch (Exception err) {
				logger.error(err.getMessage());
			}
		}
	}

	private File[] getFiles() {
		String resourcePath = ContextLoader.getCurrentWebApplicationContext()
				.getServletContext().getRealPath("/")
				+ File.separator + "json-extension/datasource/";
		return FileOperation.getFiles(resourcePath);
	}

	@SuppressWarnings("unchecked")
	private void addSourceInfo(File file) throws Exception {
		String contents = FileOperation.readFile(file);
		ObjectMapper mapper = new ObjectMapper();
		List<LinkedHashMap<String, Object>> list = mapper.readValue(contents,
				List.class);
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> map = list.get(i);

			SourceInfo source = new SourceInfo();
			source.setDisplayName(map.get("id").toString());
			source.setFilePath("json-extension/datasource/" + file.getName());
			source.setIp(map.get("ip").toString());
			source.setPort(map.get("port").toString());
			source.setSourceName(map.get("id").toString());
			source.setType("json");
			source.setUriPrefix(map.get("app_path").toString());
			try {
				if (project.isDataSourceExist("default", source)) {
					project.updateDataSource("default", source);
				} else {
					project.addDataSource("default", source);					
				}
			} catch (Exception err) {
				logger.error(err.getMessage());
			}
		}
	}
}
