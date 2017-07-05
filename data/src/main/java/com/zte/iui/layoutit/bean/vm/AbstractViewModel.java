package com.zte.iui.layoutit.bean.vm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

import com.zte.iui.layoutit.bean.Field;
import com.zte.iui.layoutit.bean.vm.attributes.OrganizeAttributes;
import com.zte.iui.layoutit.bean.vm.datetime.DateTimeList;
import com.zte.iui.layoutit.bean.vm.event.OrganizeEvent;
import com.zte.iui.layoutit.bean.vm.tableparams.OrganizeTableParams;
import com.zte.iui.layoutit.bean.vm.tableparams.TableParam;
import com.zte.iui.layoutit.bean.vm.valid.OrganizeValid;
import com.zte.iui.layoutit.bean.vm.visibility.OrganizeVisibility;
import com.zte.iui.layoutit.common.CommonUtility;
import com.zte.iui.layoutit.common.StringUtils;

public abstract class AbstractViewModel implements IViewModel {

	protected String vmtype = null;
	protected String vmid = null;
	protected String dsName = null;
	protected String uri = null;
	protected String method = null;

	protected OrganizeEvent organizeEvent = null;
	protected OrganizeAttributes organizeAttributes = null;

	protected OrganizeVisibility organizeVisibility = null;

	protected OrganizeTableParams organizeTableParams = null;

	protected List<String> editors = new ArrayList<String>();

	protected List<TableParam> tableParams = new ArrayList<TableParam>();

	protected HashSet<String> readys = new HashSet<String>();

	protected List<String> documentReadys = new ArrayList<String>();

	public List<String> getDocumentReadys() {
		return documentReadys;
	}

	protected void addtoReadys(String item) {
		if (!readys.contains(item)) {
			readys.add(item);
			documentReadys.add(item);
		}
	}

	public List<String> getEditors() {
		return editors;
	}

	/**
	 * 提取公共字段后的vm string
	 */
	protected String vms = "";
	protected List<Field> fields = new CopyOnWriteArrayList<Field>();
	protected OrganizeValid organizeValid = null;

	protected DateTimeList dateTimeList = null;

	public AbstractViewModel(String vm) throws Exception {
		String tmp = vm;
		vmtype = CommonUtility.getParamValue(tmp, "vmtype");
		tmp = tmp.substring(tmp.indexOf(";") + 1);
		vmid = CommonUtility.getParamValue(tmp, "vmid");
		tmp = tmp.substring(tmp.indexOf(";") + 1);

		dsName = CommonUtility.getParamValue(tmp, "dsname");
		tmp = tmp.substring(tmp.indexOf(";") + 1);

		uri = CommonUtility.getParamValue(tmp, "uri");
		tmp = tmp.substring(tmp.indexOf(";") + 1);

		method = CommonUtility.getParamValue(tmp, "method");
		tmp = tmp.substring(tmp.indexOf(";") + 1);

		String field = CommonUtility.getParamValue(tmp, "fields");
		if (!"".equals(field)) {
			field = CommonUtility.getParamValue(field, "form_field");
			for (String item : field.split("@")) {
				if (item == null || item.indexOf(",") < 0) {
					continue;
				}
				
				String[] sp = item.split(",");
				this.fields.add(new Field(CommonUtility.getParamValue(
						sp[0], "id"), CommonUtility.getParamValue(sp[1],
						"type"), java.net.URLDecoder.decode(
						CommonUtility.getParamValue(sp[2], "defaultvalue"),
						"utf-8"), CommonUtility.getParamValue(sp[3],
						"componenttype"), CommonUtility.getParamValue(sp[4],"parenttype")));
			}
		}

		if (tmp.indexOf("componentevent") > -1) {
			tmp = tmp.substring(tmp.indexOf(";") + 1);
			String componentevent = CommonUtility.getParamValue(tmp,
					"componentevent");
			if (!"".equals(componentevent)) {
				organizeEvent = new OrganizeEvent(componentevent);
			}
		}

		if (tmp.indexOf("componentvalid") > -1) {
			tmp = tmp.substring(tmp.indexOf(";") + 1);
			String componentValid = CommonUtility.getParamValue(tmp,
					"componentvalid");
			if (!"".equals(componentValid)) {
				organizeValid = new OrganizeValid(componentValid, vmid);
			}
		}

		if (tmp.indexOf("customAttrbutes") > -1) {
			tmp = tmp.substring(tmp.indexOf(";") + 1);
			String attributes = CommonUtility.getParamValue(tmp,
					"customAttrbutes");
			if (!"".equals(attributes)) {
				organizeAttributes = new OrganizeAttributes(attributes, vmid);
			}
		}

		if (tmp.indexOf("datetime") > -1) {
			tmp = tmp.substring(tmp.indexOf(";") + 1);
			String datetime = CommonUtility.getParamValue(tmp, "datetime");
			if (!"".equals(datetime)) {
				dateTimeList = new DateTimeList(datetime);
			}
		}

		if (tmp.indexOf("editor") > -1) {
			tmp = tmp.substring(tmp.indexOf(";") + 1);
			String editor = CommonUtility.getParamValue(tmp, "editor");
			if (!"".equals(editor)) {
				setEditors(editor);
			}
		}

		if (tmp.indexOf("componentvisibility") > -1) {
			tmp = tmp.substring(tmp.indexOf(";") + 1);
			String visibility = CommonUtility.getParamValue(tmp,
					"componentvisibility");
			if (!"".equals(visibility)) {
				organizeVisibility = new OrganizeVisibility(visibility);
			}
		}
		if (tmp.indexOf("tableParams") > -1) {
			tmp = tmp.substring(tmp.indexOf(";") + 1);
			String tablecolumns = CommonUtility.getParamValue(tmp,
					"tableParams");
			if (!"".equals(tablecolumns)) {
				organizeTableParams = new OrganizeTableParams(tablecolumns);
				tableParams = organizeTableParams.getTableParamList();
			}
		}
		if (tmp.indexOf(";") > -1) {
			vms = tmp.substring(tmp.indexOf(";") + 1);
		}
	}

	/**
	 * 
	 * TableParams的get，set方法
	 */
	public List<TableParam> getTableParams() {
		return tableParams;
	}

	public void setTableParams(List<TableParam> tableParams) {
		this.tableParams = tableParams;
	}

	/**
	 * 返回列数据信息
	 */
	public List<Field> getFields() {
		return fields;
	}

	public String getDsname() {
		return dsName;
	}

	public String getTableName() {
		return uri;
	}

	private void setEditors(String editor) {
		for (String item : editor.split("@")) {
			String[] split = item.split(",");
			String editable = CommonUtility.getParamValue(split[0], "editable");
			String field = CommonUtility.getParamValue(split[1], "field");
			editors.add(field + "_form_disabled" + "##" + editable);
		}
	}


	/**
	 * 获取合并后列的js的代码
	 * 
	 * @param entry
	 * @return
	 */
	protected String generatorItem() {			
		this.setPropertiesMap(this.fields);
		
		String formatStr = "    ";		
		StringBuffer buffer = new StringBuffer();	
		for (String key : this.vmPropertiesKey.keySet()) {
			if (key.contains(".")) {
				continue;
			}

			Field field = this.vmPropertiesValue.get(key);
			String subProperties = this.generateVMProperties(key);
			if (subProperties.isEmpty()) {				
				buffer.append(formatStr+key+":" + this.getVMComputeProperty(field, "",key)+",\n");
			} else {
				if("array".equalsIgnoreCase(field.getType())){
					buffer.append(formatStr+key + ":[{" + subProperties + "\n"+formatStr+"}],\n");
				}else{
					buffer.append(formatStr+key + ":{" + subProperties + "\n"+formatStr+"},\n");
				}
			}		
		}

		return buffer.toString();
	}

	/**
	 * 构造生成vm模型的数据结构
	 * 
	 * @param fields
	 */
	private void setPropertiesMap(List<Field> fields) {
		this.vmPropertiesKey = new HashMap<String, List<String>>();
		this.vmPropertiesValue = new HashMap<String, Field>();

		for (Field field : fields) {
			String[] arr = field.getId().split("\\.");
			String key = "";

			for (int i = 0; i < arr.length; i++) {
				key += arr[i];
				Field subField = new Field(key, "object", null, null, null);
				List<String> properties = this.vmPropertiesKey.get(key);
				if (properties == null) {
					properties = new ArrayList<String>();
				}

				if (i + 1 < arr.length) {
					if(!properties.contains(arr[i + 1])){
						properties.add(arr[i + 1]);
					}
					
					if((key + "." + arr[i + 1]).equalsIgnoreCase(field.getId())
						&& !field.getParentType().isEmpty()) {
						subField.setType(field.getParentType());
					}
				}
				
				this.vmPropertiesKey.put(key, properties);
				this.vmPropertiesValue.put(key, subField);				
				key += ".";
			}

			this.vmPropertiesValue.put(field.getId(), field);
		}
	}

	/**
	 * 获取格式化字符
	 * 
	 * @param key
	 * @return
	 */
	private String getFormatStr(String keyPath) {
		String result = "    ";
		String[] path = keyPath.split("\\.");
		if (path.length > 0) {
			for (int i = 0; i < path.length; i++) {
				result += "   ";
			}
		}

		return result;
	}

	/**
	 * 生成vm属性
	 * 
	 * @param key
	 * @return
	 */
	public String generateVMProperties(String key) {
		StringBuffer result = new StringBuffer();
		
		List<String> fieldKeys = this.vmPropertiesKey.get(key);
		if (fieldKeys != null && !fieldKeys.isEmpty()) {
			int size = fieldKeys.size();
			for (int i = 0; i < size; i++) {
				String subKey = fieldKeys.get(i);
				String subKeyPath = key + "." + subKey;
				String formatStr = getFormatStr(subKeyPath);

				result.append("\n" + formatStr + subKey + ":");
				getVMPropertyCode(result, subKeyPath, formatStr,subKey);
				if (i + 1 < size) {
					result.append(",");
				}
			}
		}

		return result.toString();
	}

	/**
	 * 构造vm属性
	 * 
	 * @param result
	 * @param subKeyPath
	 * @param formatStr
	 */
	public void getVMPropertyCode(StringBuffer result, String subKeyPath,
			String formatStr,String subKey) {
		Field subField = this.vmPropertiesValue.get(subKeyPath);
		if ("object".equalsIgnoreCase(subField.getType())) {
			result.append("{");
		} else if ("array".equalsIgnoreCase(subField.getType())) {
			result.append("[{");
		} else {
			result.append(getVMComputeProperty(subField, formatStr,subKey));
		}

		result.append(generateVMProperties(subKeyPath));

		if ("object".equalsIgnoreCase(subField.getType())) {
			result.append("\n" + formatStr + "}");
		} else if ("array".equalsIgnoreCase(subField.getType())) {
			result.append("\n" + formatStr + "}]");
		}
	}

	/*
	 * 生成vm对象的计算属性的方法
	 */
	private String getVMComputeProperty(Field field, String ftStr,String subKey) {
		if ("".equals(ftStr)) {
			ftStr = "    ";
		}

		StringBuffer buffer = new StringBuffer();
		if ("int".equals(field.getType()) || "bit".equals(field.getType())) {
			buffer.append(StringUtils.toInt(field.getDefaultValue(), "''"));
		} else if ("double".equals(field.getType())) {
			buffer.append(StringUtils.toDouble(field.getDefaultValue(), "''"));
		} else {
			buffer.append("'" + field.getDefaultValue() + "'");
		}
		
		if("array".equalsIgnoreCase(field.getType()) || "array".equalsIgnoreCase(field.getParentType())){
			buffer.append("");
		}else{
			buffer.append(", \n").append(ftStr + subKey).append("_form_disabled : false");
		}

		if ("multipleselect".equalsIgnoreCase(field.getComponentType())
				|| "checkbox".equalsIgnoreCase(field.getComponentType())) {
			buffer.append(",\n");
			buffer.append("    " + subKey + "_form_compute:{\n")
					.append("        " + "set:function(val){\n")
					.append("        " + "if(val != undefined){\n")
					.append("             this." + subKey
							+ "=val.join(\",\");\n")
					.append("         }else{\n")
					.append("             this." + subKey + "=\"\";\n")
					.append("        }}," + "get:function(){\n")
					.append("             return this." + subKey
							+ ".split(\",\" );\n").append("        }}");
		}

		return buffer.toString();
	}
	
	private Map<String, List<String>> vmPropertiesKey;
	private Map<String, Field> vmPropertiesValue;
}
