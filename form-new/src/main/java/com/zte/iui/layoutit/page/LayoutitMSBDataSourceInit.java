package com.zte.iui.layoutit.page;

import java.io.File;
import java.io.IOException;
import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.web.context.ContextLoader;

import com.zte.iui.layoutit.bean.SourceInfo;
import com.zte.iui.layoutit.common.ConfigFileManage;
import com.zte.iui.layoutit.common.FileOperation;
import com.zte.iui.layoutit.msb.MSBDataSourceAdapter;

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
	private static final String EXTENSION_DATASOURCE_FILEPATH = ConfigFileManage.instance.getExtensionDataSourceFilePath();
	private static final String EXTENSION_DATASOURCE_FILETYPE = ".json";

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
				logger.error(e.getMessage(), e);
			} catch (Exception e) {
				logger.error(e.getMessage(), e);
			}
		}
	}

	/**
	 * 生成表单设计器可识别的JSON文件
	 * @param fileName 文件名称
	 * @param contents 
	 * @return 返回文件相对路径(考虑到用户可能会对生成的文件做修改，因此返回文件路径，而不返回转换后的字符串)
	 * @throws Exception 
	 */
	private String generateJSONFile(String fileName, String contents) throws Exception {
		String fileDir = ContextLoader.getCurrentWebApplicationContext()
				.getServletContext().getRealPath("/")
				+ File.separator + EXTENSION_DATASOURCE_FILEPATH;

		FileOperation file = new FileOperation(fileDir, fileName
				+ EXTENSION_DATASOURCE_FILETYPE);
		file.writeTxtFile(contents);

		String filePath = EXTENSION_DATASOURCE_FILEPATH;
		if (!EXTENSION_DATASOURCE_FILEPATH.endsWith("/")) {
			filePath += "/";
		}

		filePath += fileName + EXTENSION_DATASOURCE_FILETYPE;
		return filePath;
	}
	
	/**
	 * 根据MSB结构生成表单可识别的模型
	 * @param dsName 数据源名称
	 * @param contents msb模型
	 * @return 返回文件相对位置
	 * @throws IOException
	 * @throws Exception
	 */
	public String generateJSONFileByMSBData(String dsName, String contents) throws IOException, Exception{
		return generateJSONFile(dsName,
		msbDSAdapter.getDataSourceJson(dsName, contents));
	}
}
