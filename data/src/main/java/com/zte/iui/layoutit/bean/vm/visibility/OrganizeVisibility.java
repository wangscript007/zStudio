package com.zte.iui.layoutit.bean.vm.visibility;

import java.util.ArrayList;
import java.util.List;

public class OrganizeVisibility {

	private List<Visibility> visibilityList;

	public OrganizeVisibility(String visibility) {
		if (visibility != null && !visibility.isEmpty()) {
			String[] arr = visibility.split("@");
			visibilityList = new ArrayList<Visibility>();
			for (String param : arr) {
				visibilityList.add(new Visibility(param));
			}
		}
	}

	/**
	 * 获取组件可显示属性js代码
	 * 
	 * @return
	 */
	public String getComponentVisibilityJSCode() {
		StringBuffer buffer = new StringBuffer();
		if(this.visibilityList != null){
			for(Visibility item:visibilityList){
				if(item.isHided()){
					buffer.append("\t$(\"#"+item.getId()+"\").hide();\n");
				}else{
					buffer.append("\t$(\"#"+item.getId()+"\").show();\n");
				}				
			}
		}
		return buffer.toString();
	}
}
