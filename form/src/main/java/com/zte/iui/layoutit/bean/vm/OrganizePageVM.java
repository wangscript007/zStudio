package com.zte.iui.layoutit.bean.vm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import com.zte.iui.layoutit.bean.Field;
import com.zte.iui.layoutit.common.CommonConst;
import com.zte.iui.layoutit.common.CommonUtility;

public class OrganizePageVM {
	private String[] vms = null;
	
	private String[] i18nPath = null;

	private List<IViewModel> viewModels = new ArrayList<IViewModel>();

	public OrganizePageVM(String[] vms,String[] i18nPath) throws Exception {
		this.vms = vms;
		this.i18nPath = i18nPath;
		analyzeParameter();
	}

	// vmInfo=vm1430270375056#form#act_ge_property#POSTform_fields=VALUE_#string@REV_#string@

	private void analyzeParameter() throws Exception {
		for (int i = 0; i < vms.length; i++) {
			String vmtype = CommonUtility.getParamValue(vms[i], "vmtype");
			if (vmtype.equals(CommonConst.VM_TYPE_FORM)) {
				viewModels.add(new FormViewModel(vms[i]));
			} else if (vmtype.equals(CommonConst.VM_TYPE_TABLE)) {
				viewModels.add(new TableViewModel(vms[i]));
			} else if(vmtype.equals(CommonConst.VM_TYPE_CHART)){
				viewModels.add(new ChartViewModel(vms[i]));
			} else if(vmtype.equals(CommonConst.VM_TYPE_DISPLAY)){
				viewModels.add(new DisplayViewModel(vms[i]));
			}
		}
	}
	
	/**
	 * 返回所有字段信息
	 * @return
	 */
	public Map<String, List<Field>> getFields() {
		Map<String, List<Field>> map = new HashMap<String, List<Field>>();
		for(IViewModel item : viewModels) {
			map.put(item.getDsname() + "##" + item.getTableName(), item.getFields());
		}
		return map;
	}

	public String getJSCode() throws Exception {
		StringBuffer buffer = new StringBuffer(1000);
		HashSet<String> readys = new HashSet<String>();
		List<String> documentReadys = new ArrayList<String>();
		for (IViewModel model : viewModels) {
			buffer.append(model.generatorJSCode()).append("\n\n");
			for(String item : model.getDocumentReadys()) {
				if(readys.contains(item)) {
					documentReadys.remove(item);
				}
				readys.add(item);
				documentReadys.add(item);
			}
		}
		
		//Map<String,Object> i18nFileMap = getI18nMap();
		//documentReadys.add("initI18NProperties(" 
		//		+"'"+i18nFileMap.get("fileName")+"'"+","+"'"+i18nFileMap.get("path")+"'"+")");
		
//		List<String> editors = new ArrayList<String>();
//		for (IViewModel model : viewModels) {
//			editors.addAll(model.getEditors());
//		}
//		buffer.append(generatorEditorFunction(editors));
		buffer.append("\n$(document).ready(function(){\n");
		buffer.append("\tif (typeof(eval(\"window.\" + \"pageDocumentReadyBefore\")) === \"function\") {\n");
		buffer.append("\t\tapplyFunc(\"pageDocumentReadyBefore\", [])\n");
		buffer.append("\t}\n");
		for(String item : documentReadys) {
			buffer.append(item);
		}
		buffer.append("\tif(typeof $('div[type=\"m_switch\"]').initializtionSwitch === 'function') {\n");
		buffer.append("\t\t$('div[type=\"m_switch\"]').initializtionSwitch('setSwitchValue');\n");
		buffer.append("\t}\n");
		buffer.append("\tif (typeof(eval(\"window.\" + \"pageDocumentReadyAfter\")) === \"function\") {\n");
		buffer.append("\t\tapplyFunc(\"pageDocumentReadyAfter\", [])\n");
		buffer.append("\t}\n");
		buffer.append("});\n");
		
		return buffer.toString();
	}
	
	private Map<String,Object> getI18nMap() {
		Map<String,Object> fileMap = new HashMap<String,Object>();
		for(int i = 0; i < i18nPath.length; i++){
			String filePath = i18nPath[i];
			if(!filePath.contains("_zh")){
				String pathParam = filePath.substring(0,filePath.lastIndexOf("/")+1);
				String nameParam = filePath.substring(filePath.lastIndexOf("/")+1,filePath.indexOf("."));
				fileMap.put("path",pathParam);
				fileMap.put("fileName", nameParam);
			}
		}
		return fileMap;
	}

//	private String generatorEditorFunction(List<String> editors) throws Exception {
//		if (editors.size() == 0) {
//			return "";
//		}
//		StringBuffer buffer = new StringBuffer();
//		buffer.append("\nfunction getEditorItem() {\n").append(
//				"    var editors = new Array();\n");
//		for (String item : editors) {
//			String[] split = item.split("##");
//			String editable = URLDecoder.decode(split[1], "UTF-8");
//			buffer.append("    editors.push({field:'" + split[0]
//					+ "',editable:" + editable + "}) \n");
//		}
//		buffer.append("    return editors;\n");
//		buffer.append("}\n");
//		return buffer.toString();
//	}

}
