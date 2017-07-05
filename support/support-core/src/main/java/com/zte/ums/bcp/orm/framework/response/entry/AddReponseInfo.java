package com.zte.ums.bcp.orm.framework.response.entry;

import java.io.Serializable;


/**
 * 新增操作返回结果对象
 * @author 10191081
 *
 */

@SuppressWarnings("serial")
public class AddReponseInfo extends ResponseInfo implements Serializable {

	private PrimaryKey primaryKey;

	public PrimaryKey getPrimaryKey() {
		return primaryKey;
	}

	public void setPrimaryKey(PrimaryKey primaryKey) {
		this.primaryKey = primaryKey;
	}


}
