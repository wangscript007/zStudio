package com.zte.iui.layoutit.bean.vm.tableparams;

import java.util.ArrayList;
import java.util.List;

import com.zte.iui.layoutit.common.CommonUtility;

public class OrganizeTableParams {
	private List<TableParam> tableParamList;

	public OrganizeTableParams(String visibility) {
		if (visibility != null && !visibility.isEmpty()) {
			String[] arr = visibility.split("@");
			tableParamList = new ArrayList<TableParam>();
			for (String param : arr) {
				if (param != null && param.length() > 0 && param.indexOf(",") > -1){
					String[] para = param.split(",");
					tableParamList.add(new TableParam(CommonUtility.getParamValue(para[0], "querycolumns")
							,CommonUtility.getParamValue(para[1], "tableid")
							,CommonUtility.getParamValue(para[2], "parameter")
							,CommonUtility.getParamValue(para[3], "formuri")));
				}
			}
		}
	}

	/**
	 * 获取组件可显示属性js代码
	 * 
	 * @return
	 */
	public List<TableParam> getTableParamList() {
		return tableParamList;
	}
}
