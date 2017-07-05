package com.zte.ums.bcp.orm.tablemessage.entity;

import java.io.Serializable;

@SuppressWarnings("serial")
public class MultiTableDefinitionTable implements Serializable {

	private String COMBINATIVE_TABLE;
	private String PROJECT_NAME;
	private String DESCRIPTION;
	private String SCENE;
	private String ID;
	
	public String getCOMBINATIVE_TABLE() {
		return COMBINATIVE_TABLE;
	}
	public void setCOMBINATIVE_TABLE(String cOMBINATIVE_TABLE) {
		COMBINATIVE_TABLE = cOMBINATIVE_TABLE;
	}
	public String getPROJECT_NAME() {
		return PROJECT_NAME;
	}
	public void setPROJECT_NAME(String pROJECT_NAME) {
		PROJECT_NAME = pROJECT_NAME;
	}
	public String getDESCRIPTION() {
		return DESCRIPTION;
	}
	public void setDESCRIPTION(String dESCRIPTION) {
		DESCRIPTION = dESCRIPTION;
	}
	public String getSCENE() {
		return SCENE;
	}
	public void setSCENE(String sCENE) {
		SCENE = sCENE;
	}
	public String getID() {
		return ID;
	}
	public void setID(String iD) {
		ID = iD;
	}
}
