package com.zte.iui.layoutit.dao;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class BaseDao {
	
	@Resource
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	
	public JdbcOperations getJdbcOperations() {
		return namedParameterJdbcTemplate.getJdbcOperations();
	}
	
	public NamedParameterJdbcTemplate getNamedParameterJdbcTemplate() {
		return namedParameterJdbcTemplate;
	}
	
	public Map<String, Object> getMap(String sql) {
		return getJdbcOperations().queryForMap(sql);
	}
	
	public List<Map<String, Object>> getList(String sql) {
		return getJdbcOperations().queryForList(sql);
	}
	
}
