package com.zte.ums.bcp.orm.framework.response.entry;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;


/**
 * ORM数据库操作返回结果新增接口实体封装类
 * @author 10191081
 *
 */
@SuppressWarnings("serial")
@Component
public class QueryResponseInfo extends ResponseStatus implements Serializable {

	private int total;
	private List<Map<String, Object>> rows;
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public List<Map<String, Object>> getRows() {
		return rows;
	}
	public void setRows(List<Map<String, Object>> rows) {
		this.rows = rows;
	}
	
	
	
}
