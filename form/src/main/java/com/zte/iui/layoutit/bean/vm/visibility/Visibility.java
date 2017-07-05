package com.zte.iui.layoutit.bean.vm.visibility;

public class Visibility {
	private String id;
	private boolean hided;
	public Visibility (){		
		
	}
	/**
	 * 组件可显示性
	 * @param visibilityParam
	 */
	public Visibility (String visibilityParam){		
		String[] params = visibilityParam.split("=");
		if(params.length == 2){
			this.id = params[0];
			this.hided =Boolean.parseBoolean(params[1]);
		}
	}
	
	
	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}
	 
	/**
	 * @return the hided
	 */
	public boolean isHided() {
		return hided;
	}
	/**
	 * @param hided the hided to set
	 */
	public void setHided(boolean hided) {
		this.hided = hided;
	}
}
