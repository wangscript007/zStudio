package com.zte.iui.layoutit.page;

import java.io.File;
import java.io.IOException;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.context.ContextLoader;

import com.zte.iui.layoutit.bean.SourceInfo;
import com.zte.iui.layoutit.common.ConfigFileManage;
import com.zte.iui.layoutit.common.FileOperation;
import com.zte.iui.layoutit.msb.MSBDataSourceAdapter;
import org.apache.log4j.Logger;

@Service
public class LayoutitMSBDataSourceInit {
	private static Logger logger = Logger.getLogger(
			LayoutitMSBDataSourceInit.class.getName());
	@Resource
	private LayoutitProject project;

	@Resource
	private MSBDataSourceAdapter msbDSAdapter;

	private static final String PROJECT_DEFAULT = "default";
	private static final String PROJECT_DATASOURCE_TYPE = "msb";
	private static final String PROJECT_DATASOURCE_FILEPATH = "json-extension/datasource/";
	private static final String PROJECT_DATASOURCE_FILETYPE = ".json";

	public void init() {
		if (!ConfigFileManage.instance.isLoadMSBData()) {
			return;
		}

		List<SourceInfo> sourceList = project.getProjectFormatedDataSource(
				PROJECT_DEFAULT, PROJECT_DATASOURCE_TYPE);
		if (sourceList == null || sourceList.isEmpty()) {
			return;
		}

		for (SourceInfo sourceItem : sourceList) {
			try {
				generateJSONFile(sourceItem.getSourceName(),
						msbDSAdapter.getDataSourceJson(sourceItem));
			} catch (IOException e) {
				logger.error(e.getMessage());
			}
		}
	}

	private void generateJSONFile(String fileName, String contents) {
		String fileDir = ContextLoader.getCurrentWebApplicationContext()
				.getServletContext().getRealPath("/")
				+ File.separator + PROJECT_DATASOURCE_FILEPATH;
		FileOperation file = new FileOperation(fileDir, fileName
				+ PROJECT_DATASOURCE_FILETYPE);
		try {
			file.writeTxtFile(contents);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
	}
}
