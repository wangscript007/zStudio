package com.zte.iui.layoutit.bean;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "root")
@XmlAccessorType(XmlAccessType.FIELD)
public class LayoutitTemplateRoot {
	@XmlElement(name = "template")
	private List<LayoutitTemplate> templateList = null;

	/**
	 * @return the templateList
	 */
	public List<LayoutitTemplate> getTemplateList() {
		return templateList;
	}

	/**
	 * @param templateList the templateList to set
	 */
	public void setTemplateList(List<LayoutitTemplate> templateList) {
		this.templateList = templateList;
	}
}
