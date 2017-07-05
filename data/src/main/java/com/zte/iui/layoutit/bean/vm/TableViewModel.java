package com.zte.iui.layoutit.bean.vm;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;

import com.zte.iui.layoutit.bean.vm.tableparams.TableParam;

public class TableViewModel extends AbstractViewModel {

	private List<TableParam> tableParams = new ArrayList<TableParam>();

	public TableViewModel(String vm) throws Exception {
		super(vm);
		this.tableParams = super.tableParams;
	}

	@Override
	public String generatorJSCode() throws UnsupportedEncodingException {
		StringBuffer buffer = new StringBuffer();
		if (fields.size() > 0) {
			buffer.append("var " + vmid + " = avalon.define({$id: '")
					.append(vmid).append("',\n");

			// 添加字段
			buffer.append(generatorItem()).append("});\n\n");
			buffer.append("function getVMData() {\n" + "    return " + vmid
					+ ".$model;\n" + "}\n");
		}

		addtoReadys("    initComponent('" + dsName + "'," + vmid + ");\n");
		if (organizeAttributes != null) {
			buffer.append("    " + organizeAttributes.getAttributesJSCode()
					+ "\n\n");
		}

		if (tableParams != null && tableParams.size() > 0) {
			for (TableParam tableParam : tableParams) {
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
				addtoReadys("var " + tableid + " = bootstrapTable('" + tableid
						+ "', adjustTableParam('" + tableid + "','" + dsName
						+ "', '" + uri + "', " + parameter + ")); \n");
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

		// 生成tab事件和页面控件代码
		if (organizeEvent != null) {
			addtoReadys(organizeEvent.getEventJs());
		}

		if (organizeValid != null) {
			addtoReadys(organizeValid.getValidJs());
		}

		addtoReadys("    controlTableToolbar();\n");

		if (organizeVisibility != null) {
			addtoReadys(organizeVisibility.getComponentVisibilityJSCode());
		}

		return buffer.toString();
	}
}
