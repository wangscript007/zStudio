package com.zte.iui.layoutit.bean.vm.attributes;

import java.io.UnsupportedEncodingException;

public class OrganizeAttributes {

	protected String attrbutes;
	protected String vmid;

	public OrganizeAttributes(String attributes,String vmid) {
		this.attrbutes = attributes;
		this.vmid = vmid;
	}

	public String getAttributesJSCode() throws UnsupportedEncodingException {		
		
		return "var  "+this.vmid+"_attributes = "+java.net.URLDecoder.decode(this.attrbutes,"utf-8")+";\r\n"+
				"setCustomAttributes("+this.vmid+"_attributes);";
	}
	
	public String getChartAttributeJsCode(){
		return "var  "+this.vmid+"_attributes = " + this.attrbutes;
	}
}
