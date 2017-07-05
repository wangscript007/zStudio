package com.zte.iui.layoutit.bean;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class JsonFileDesc {
	private List<JsonFile> list = new ArrayList<JsonFileDesc.JsonFile>();

	/**
	 * 
	 * @param path
	 * @param moduleName
	 * @return
	 */
	public JsonFile generateJsonFile(String path, String moduleName) {
		JsonFile desc = new JsonFile();
		desc.setModuleName(moduleName);
		desc.setPath(path);
		return desc;
	}

	public void addFile(JsonFile jsonFile) {
		list.add(jsonFile);
	}

	@XmlRootElement
	class JsonFile {
		private String path = null;
		private String moduleName = null;

		public String getPath() {
			return path;
		}

		public void setPath(String path) {
			this.path = path;
		}

		public String getModuleName() {
			return moduleName;
		}

		public void setModuleName(String moduleName) {
			this.moduleName = moduleName;
		}

	}
}
