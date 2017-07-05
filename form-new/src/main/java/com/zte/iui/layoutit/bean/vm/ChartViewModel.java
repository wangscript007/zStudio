package com.zte.iui.layoutit.bean.vm;

import java.net.URLDecoder;

import com.zte.iui.layoutit.common.CommonUtility;

public class ChartViewModel extends AbstractViewModel {
	private String chartId;
	private String option;
	public ChartViewModel(String vm) throws Exception {
		super(vm);
		//this.vms = this.vms.substring(vms.indexOf(";") + 1);
		option = CommonUtility.getParamValue(vms, "option");
		if (!option.equals("")) {
			option = URLDecoder.decode(option, "UTF-8");
		}
		chartId = vmid;
	}
	@Override
	public String generatorJSCode() throws Exception {
		StringBuffer buffer = new StringBuffer();
		if (organizeAttributes != null) {
			buffer.append("    " + URLDecoder.decode(organizeAttributes.getChartAttributeJsCode(), "UTF-8")
					+ "\n\n");
		}
		addtoReadys("    showChart('"+chartId+"',"+chartId+"_attributes);\n");
		return buffer.toString();
	}

}
