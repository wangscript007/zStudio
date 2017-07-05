package com.zte.ums.bcp.orm.tablemessage.entity;

import java.io.Serializable;

@SuppressWarnings("serial")
public class MultiTableMetadataTable implements Serializable {
	
	private String RESOURCE_ID;
	private String TABLE_NAME;
	private String TABLE_COLUMN_NAME;
	private String RESOURCE_COLUMN_NAME;
	private String DATABASE_NAME;
	private String ID;

	public String getRESOURCE_ID() {
		return RESOURCE_ID;
	}

	public void setRESOURCE_ID(String rESOURCE_ID) {
		RESOURCE_ID = rESOURCE_ID;
	}

	public String getTABLE_NAME() {
		return TABLE_NAME;
	}

	public void setTABLE_NAME(String tABLE_NAME) {
		TABLE_NAME = tABLE_NAME;
	}

	public String getTABLE_COLUMN_NAME() {
		return TABLE_COLUMN_NAME;
	}

	public void setTABLE_COLUMN_NAME(String tABLE_COLUMN_NAME) {
		TABLE_COLUMN_NAME = tABLE_COLUMN_NAME;
	}

	public String getRESOURCE_COLUMN_NAME() {
		return RESOURCE_COLUMN_NAME;
	}

	public void setRESOURCE_COLUMN_NAME(String rESOURCE_COLUMN_NAME) {
		RESOURCE_COLUMN_NAME = rESOURCE_COLUMN_NAME;
	}

	public String getDATABASE_NAME() {
		return DATABASE_NAME;
	}

	public void setDATABASE_NAME(String dATABASE_NAME) {
		DATABASE_NAME = dATABASE_NAME;
	}

	public String getID() {
		return ID;
	}

	public void setID(String iD) {
		ID = iD;
	}

}
