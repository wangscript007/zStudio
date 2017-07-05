package com.zte.iui.layoutit.bean.vm;

import java.io.UnsupportedEncodingException;

import com.zte.iui.layoutit.common.CommonUtility;

public class DisplayViewModel extends AbstractViewModel {
	
	private String compid;

	public DisplayViewModel(String vm) throws Exception {
		super(vm);	
		compid = CommonUtility.getParamValue(vms, "compid");		
	}

	@Override
	public String generatorJSCode() throws UnsupportedEncodingException {
		return "";		
	}
}
