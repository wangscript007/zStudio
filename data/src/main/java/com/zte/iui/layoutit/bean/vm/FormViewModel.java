package com.zte.iui.layoutit.bean.vm;

import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;

import com.zte.iui.layoutit.bean.vm.tableparams.TableParam;



public class FormViewModel extends AbstractViewModel {
	private List<TableParam> tableParams = new ArrayList<TableParam>();

	public FormViewModel(String vm) throws Exception {
		super(vm);
		this.tableParams = super.tableParams;
	}

	@Override
	public String generatorJSCode() throws Exception {

		StringBuffer buffer = new StringBuffer();
		buffer.append("var viewoperator;\n");
//		buffer.append("var esbinfo='http://"
//				+ ConfigFileManage.instance.getProperty("ip") + ":"
//				+ ConfigFileManage.instance.getProperty("port") + "';\n");
		buffer.append("setOperator();\n");
		// 定义vmid
		buffer.append("var " + vmid + " = avalon.define({$id: '").append(vmid)
				.append("',\n");
		// 添加字段
		buffer.append(generatorItem());

		//只有在uri和dsName 不为空时才加入如下代码
		if(!uri.equals("undefined") && !dsName.equals("undefined")) {
			buffer.append("    submit:function() { \n" + "        return formOperator(" + vmid + ", '" + uri + "', '" + method + "', '" + dsName + "');\n"
					+ "    },\n" 
					+ "    reset:function() { \n"
					+ "        initVMProperties(" + vmid + ");\n"
					+ "        updateVMForComponentStatus(" + vmid + ", viewoperator);\n"
					+ "    }\n");	
		}
		buffer.append("});\n\n");
		buffer.append("setVMToMap(" + vmid + ");\n");
		
/*		buffer.append("function getVMData() {\n" 
				+ "    return " + vmid + ".$model;\n"
				+ "}\n");
*/
		if (organizeAttributes != null) {
			buffer.append(organizeAttributes.getAttributesJSCode());
		}
		/*
		 * form下的tabel代码生成
		 */
		if(tableParams != null){
			for(TableParam tableParam: tableParams){
				String querycolumns = tableParam.getQuerycolumns();
				String parameter = tableParam.getParameter();
				String tableid = tableParam.getTableid();
				String formuri = tableParam.getFormuri();
				if (!querycolumns.equals("")) {
					querycolumns = URLDecoder.decode(querycolumns, "UTF-8");
				}
				if (!parameter.equals("")) {
					parameter = URLDecoder.decode(parameter, "UTF-8");
				}
				// 生成table代码
				addtoReadys("    table = bootstrapTable('" + tableid
						+ "', adjustTableParam('" + tableid + "','" + dsName + "', '" + uri + "', " + parameter + ")); \n");
				// 增加控制工具栏按钮状态控制，表格选择事件
				if (formuri != null && !formuri.equals("")) {
					addtoReadys("    $('#"
									+ tableid
									+ "').bootstrapTable().on('check.bs.table', function(event, row) {\n"
									+ "        controlTableToolbar('"
									+ tableid
									+ "') \n"
									+ "    }).on('uncheck.bs.table', function(event, row) {\n"
									+ "        controlTableToolbar('"
									+ tableid
									+ "') \n"
									+ "    }).on('check-all.bs.table', function(event) {\n"
									+ "        controlTableToolbar('"
									+ tableid
									+ "') \n"
									+ "    }).on('uncheck-all.bs.table', function(event) {\n"
									+ "        controlTableToolbar('" + tableid
									+ "') \n" + "    });\n");
				}
			}
		}
		// updateVMForComponentStatus
//		buffer.append("\n$(document).ready(function(){\n");
		if(!uri.equals("undefined") && !dsName.equals("undefined")) {						
			addtoReadys("    initVMData(" + vmid + ", '" + uri + "', '" + dsName + "');\n");			
		}
		addtoReadys("    initComponent('" + dsName + "',"+vmid+");\n");
		if (editors.size() > 0) {
			addtoReadys("    updateVMForComponentStatus(" + vmid + ", viewoperator)\n");
		}
		if (organizeEvent != null) {
			addtoReadys(organizeEvent.getEventJs());
		}
		if (organizeValid != null) {
			addtoReadys(organizeValid.getValidJs());
		}

		if (dateTimeList != null) {
			addtoReadys(dateTimeList.getDateTimeJs());
		}
		
		addtoReadys("    visiableComponent();\n");
		//组件可见性
		if(organizeVisibility != null){
			addtoReadys(organizeVisibility.getComponentVisibilityJSCode());
		}
		addtoReadys("    avalon.scan(document.getElementById(\"" + vmid + "\"));\n");

//		buffer.append("});\n");

		return buffer.toString();
	}
}
