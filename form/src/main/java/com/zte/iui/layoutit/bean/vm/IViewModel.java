package com.zte.iui.layoutit.bean.vm;

import java.util.List;

import com.zte.iui.layoutit.bean.Field;

public interface IViewModel {

	String generatorJSCode() throws Exception;
	
	List<String> getDocumentReadys();
	
	List<Field> getFields();
	
	String getTableName();
	
	String getDsname();
	
//	List<String> getEditors();
	
}
