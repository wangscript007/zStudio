package com.zte.iui.layoutit.bean.vm.tableparams;

public class TableParam {
private String querycolumns;
private String tableid;
private String parameter;
private String formuri;
public TableParam(String querycolumns,String tableid,String parameter,String formuri){
	this.querycolumns = querycolumns;
	this.tableid = tableid;
	this.parameter = parameter;
	this.formuri = formuri;
}
public String getQuerycolumns() {
	return querycolumns;
}
public void setQuerycolumns(String querycolumns) {
	this.querycolumns = querycolumns;
}
public String getTableid() {
	return tableid;
}
public void setTableid(String tableid) {
	this.tableid = tableid;
}
public String getParameter() {
	return parameter;
}
public void setParameter(String parameter) {
	this.parameter = parameter;
}
public String getFormuri() {
	return formuri;
}
public void setFormuri(String formuri) {
	this.formuri = formuri;
}

}
