package com.zte.ums.bcp.orm.framework.response.entry;

import java.util.List;

/**
 * 新增操作返回结果主键对象
 * @author 10191081
 *
 */
public class PrimaryKey {

	private List<String> id;

	public List<String> getId() {
		return id;
	}

	public void setId(List<String> id) {
		this.id = id;
	}

}
