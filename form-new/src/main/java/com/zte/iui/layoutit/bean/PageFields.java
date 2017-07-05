package com.zte.iui.layoutit.bean;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * 存储页面定义的字段，页面->vm->字段，三者关系都是1：n
 * 
 * @author dw
 * 
 */
public class PageFields implements Serializable {

	private static final long serialVersionUID = 1L;

	public static final String VM_TYPE_FORM = "form";
	public static final String VM_TYPE_TABLE = "table";
	public static final String VM_TYPE_CHART = "chart";

	private String pagePath = null;

	/**
	 * 判断内容是否被修改过，在修改该文件时修改为true<br />
	 * 在存储文件时判断该标志，如果为true则重新保存文件
	 */
	// private boolean isModify = false;

	/**
	 * 如果是chart图形，id为 vmid + # + divid
	 */
	Map<String, VMDefine> vms = new ConcurrentHashMap<String, VMDefine>(10);

	public PageFields(String pagePath) {
		this.pagePath = pagePath;
	}

	public String getPagePath() {
		return pagePath;
	}

	/*
	 * public boolean isModify() { return isModify; }
	 * 
	 * 
	 * public void setModify( boolean isModify ) { this.isModify = isModify; }
	 */

	public void setPagePath(String pagePath) {
		this.pagePath = pagePath;
	}

	/**
	 * 删除vm
	 * 
	 * @param vmId
	 */
	public void deleteVm(String vmId) {
		VMDefine vmDefine = vms.remove(vmId);
		// 说明删除不成功，这种情况为chart
		if (vmDefine == null) {
			String[] keys = vms.keySet().toArray(new String[0]);
			for (String key : keys) {
				if (key.indexOf(vmId) > -1) {
					vms.remove(key);
					return;
				}
			}

		}
	}

	/**
	 * 检查缓存中存储的vm是否在页面中存在，如果不存在的需要删除
	 * 
	 * @param vmids
	 */
	public void checkVms(String[] vmids) {
		String[] ids = vms.keySet().toArray(new String[0]);
		for (String id : ids) {
			boolean isExists = false;
			for (String item : vmids) {
				if (id.startsWith(item)) {
					isExists = true;
					break;
				}
			}
			if (!isExists) {
				vms.remove(id);
			}
		}
	}

	String getDivId(String vmId) {
		String newid = vmId;
		int indexOf = vmId.indexOf('#');
		if (indexOf > -1) {
			newid = vmId.substring(indexOf + 1);
		}
		return newid;
	}

	public String generateJS() {
		String[] keys = vms.keySet().toArray(new String[0]);
		StringBuffer buffer = new StringBuffer();
		for (int i = 0; i < keys.length; i++) {
			String name = keys[i];
			VMDefine define = vms.get(name);
			buffer.append(define.generatorCode(name)).append("\n\n");
		}
		return buffer.toString();
	}

	private VMDefine addVM(String vmid, String vmType, String url,
			String methodName) {
		if (vms.keySet().contains(vmid)) {
			return null;
		}
		VMDefine vmDefines = new VMDefine(vmType, url, methodName);
		vms.put(vmid, vmDefines);
		return vmDefines;
	}

	public void addFields(String vmid, String vmType, String url,
			String methodName, String filed, String fieldType) {
		VMDefine defines = vms.get(vmid);
		if (defines == null) {
			defines = addVM(vmid, vmType, url, methodName);
		} else {
			defines.setUrl(url);
			defines.setMethodName(methodName);
			defines.setType(vmType);
		}
		if (!isAddFields(filed, defines)) {
			defines.getFields().add(new Field(filed, fieldType));
		}
	}

	public void deleteField(String vmid, String filed) {
		VMDefine defines = vms.get(vmid);
		if (defines == null) {
			return;
		}
		List<Field> fields = defines.getFields();
		for (Field f : fields) {
			if (f.getId().equals(filed)) {
				fields.remove(f);
			}
		}
	}

	private boolean isAddFields(String filedId, VMDefine defines) {
		List<Field> fields = defines.getFields();
		for (int i = 0; i < fields.size(); i++) {
			if (fields.get(i).getId().equals(filedId)) {
				return true;
			}
		}
		return false;
	}

	class VMDefine implements Serializable {
		private static final long serialVersionUID = 1L;
		private String type = VM_TYPE_FORM;
		private List<Field> fields = new CopyOnWriteArrayList<Field>();
		private String url = null;
		private String methodName = null;

		public VMDefine(String type, String url, String methodName) {
			if (type.equals(VM_TYPE_FORM) || type.equals(VM_TYPE_TABLE)
					|| type.equals(VM_TYPE_CHART)) {
				this.type = type;
			} else {
				throw new IllegalArgumentException("vm type is error");
			}
			this.url = url;
			this.methodName = methodName;
		}

		public String getType() {
			return type;
		}

		public void setType(String type) {
			this.type = type;
		}

		public List<Field> getFields() {
			return fields;
		}

		public void setFields(List<Field> fields) {
			this.fields = fields;
		}

		/**
		 * 合并字段，在生成表单js时需要使用 <br />
		 * eg: body.id & body.name两列转换为body-{id,name}
		 * 
		 * @return
		 */
		private Map<String, List<Field>> merageFields() {
			Map<String, List<Field>> map = new ConcurrentHashMap<String, List<Field>>();
			for (int i = 0; i < fields.size(); i++) {
				Field field = fields.get(i);
				String id = field.getId();
				if (id.indexOf(".") > -1) {
					String[] sps = id.split("\\.");
					List<Field> list = map.get(sps[0]);
					if (list == null) {
						list = new CopyOnWriteArrayList<Field>();
						list.add(new Field(sps[1], field.getType()));
						map.put(sps[0], list);
					} else {
						list.add(new Field(sps[1], field.getType()));
					}
				} else {
					List<Field> list = map.get(id);
					if (list == null) {
						list = new CopyOnWriteArrayList<Field>();
						list.add(field);
						map.put(id, list);
					} else {
						list.add(field);
					}
				}
			}
			return map;
		}

		public String getUrl() {
			return url;
		}

		public void setUrl(String url) {
			this.url = url;
		}

		public String getMethodName() {
			return methodName;
		}

		public void setMethodName(String methodName) {
			this.methodName = methodName;
		}

		public String generatorCode(String vmName) {

			if (type.equals(VM_TYPE_FORM)) {
				return generatorForm(vmName);
			} else if (type.equals(VM_TYPE_TABLE)) {
				return generatorTable(vmName);
			} else if (type.equals(VM_TYPE_CHART)) {
				return generatorChart(vmName);
			}
			return "";
		}

		/**
		 * chart图形时，vmName不是标准的vmName，而是图形的div id，这里需要注意
		 * 
		 * @param vmName
		 * @return
		 */
		private String generatorChart(String vmName) {
			StringBuffer buffer = new StringBuffer();
			buffer.append("$(document).ready(function(){ \n");

			buffer.append("  $.ajax({ \n"
					+ "               type: '"
					+ methodName
					+ "', \n"
					+ "               url: '"
					+ url
					+ "?type="
					+ fields.get(0).getId()
					+ "', \n"
					+
					// "               data:{\"type\":" + fields.get( 0
					// ).getId() + "}, \n" +
					"               contentType :'application/json;charset=UTF-8', \n"
					+ "               async: true, \n"
					+ "               success: function (data, textStatus) { \n"
					+
					// "                   //var series = new Series();series.type = data.type;series.name = data.name; series.data = data.data;\n"
					// +
					"                   c3ChartForLayoutIt(\""
					+ getDivId(vmName) + "\", data);" + "               } })\n"
					+ "});");
			return buffer.toString();
		}

		private String generatorTable(String vmName) {
			StringBuffer buffer = new StringBuffer();
			buffer.append("$(document).ready(function(){ \n");
			buffer.append("   var " + vmName + " = new TableViewModel('")
					.append(vmName).append("', [");
			for (int i = 0; i < fields.size(); i++) {
				buffer.append("'").append(fields.get(i).getId()).append("'");
				if (i != fields.size() - 1) {
					buffer.append(", ");
				}
			}
			buffer.append("], 'http://10.74.165.143:8484").append(url)
					.append("'); \n");
			buffer.append("  " + vmName + ".page(1, ''); \n");
			buffer.append("});");
			return buffer.toString();
		}

		private String generatorForm(String vmName) {
			Map<String, List<Field>> merageFields = merageFields();

			StringBuffer buffer = new StringBuffer();
			// 定义vmid
			buffer.append("var " + vmName + " = avalon.define({$id: '")
					.append(vmName).append("',\n");
			// 循环定义model
			for (Entry<String, List<Field>> entry : merageFields.entrySet()) {
				buffer.append(generatorItem(entry));
			}

			buffer.append("submit:function(url) { \n$.ajax({ \n"
					+ "               type: '"
					+ methodName
					+ "', \n"
					+ "               url: '"
					+ url
					+ "', \n"
					+ "               data: JSON.stringify("
					+ vmName
					+ ".$model), \n"
					+ "               contentType :'text/plain;application/json;charset=UTF-8', \n"
					+ "               async: true, \n"
					+ "               success: function (data, textStatus) { \n"
					+ "                   bootbox.alert('提交表单成功'); \n"
					+ "               } \n" + "           }); }\n });\n\n");

			return buffer.toString();

		}

		/**
		 * 获取合并后列的js的代码
		 * 
		 * @param entry
		 * @return
		 */
		private String generatorItem(Entry<String, List<Field>> entry) {
			String key = entry.getKey();
			List<Field> value = entry.getValue();
			StringBuffer buffer = new StringBuffer();
			// 不是复合参数情况
			if (value.size() == 1 && key.equals(value.get(0).getId())) {
				Field field = value.get(0);
				buffer.append(getItem(key, field)).append(",");
			} else {
				buffer.append(key).append(" : { ");
				for (Field field : value) {
					buffer.append(getItem(field.getId(), field));
				}
				buffer.append(" }, \n");
			}
			return buffer.toString();
		}

		/**
		 * 获取form表单一列的js代码，非复合参数情况
		 * 
		 * @param key
		 */
		private String getItem(String key, Field field) {
			StringBuffer buffer = new StringBuffer();
			buffer.append(key).append(": ");
			if (field.getType().equals("integer")) {
				buffer.append("0 \n");
			} else {
				buffer.append("'' \n");
			}
			return buffer.toString();
		}

	}

	class Field implements Serializable {
		private static final long serialVersionUID = 1L;
		private String id;
		private String type; // avalon定义时需要使用

		public Field(String id, String type) {
			this.id = id;
			this.type = type;
		}

		public String getId() {
			return id;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getType() {
			return type;
		}

		public void setType(String type) {
			this.type = type;
		}
	}

}
