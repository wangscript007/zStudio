package com.zte.iui.layoutit.page;

import java.util.List;

import javax.xml.bind.JAXBException;

import com.zte.iui.layoutit.bean.LayoutitTemplate;
import com.zte.iui.layoutit.bean.LayoutitTemplateRoot;
import com.zte.iui.layoutit.common.JaxbReadXml;

public class LayoutitTemplateService {
	private LayoutitTemplateRoot templatesRoot;
	
	/**
	 * 加载模板信息
	 * @throws JAXBException
	 */
	public LayoutitTemplateService() throws JAXBException{
		String configPath = JaxbReadXml.class.getClassLoader().getResource("/").getPath()	+ "form-designer-template.xml";
		this.templatesRoot = (LayoutitTemplateRoot)JaxbReadXml.readString(LayoutitTemplateRoot.class, configPath);
	}
	
	/**
	 * 查询所有模板信息
	 * @return
	 */
	public List<LayoutitTemplate> getLayoutitTemplates(){
		return this.templatesRoot.getTemplateList();		
	}
}
