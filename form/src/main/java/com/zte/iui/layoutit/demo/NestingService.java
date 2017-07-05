package com.zte.iui.layoutit.demo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.annotation.Resource;

import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.zte.iui.layoutit.dao.BaseDao;

@Service
public class NestingService {
	@Resource
	private BaseDao baseDao;
	
	@Transactional
	public void save(List<String> listSql) {
		for(String sql:listSql){
			baseDao.getJdbcOperations().update(sql);
			
		}
	}
	@Transactional
	public void delete(String value) {
		JdbcOperations jdbcOperations = baseDao.getJdbcOperations();
		jdbcOperations.update("delete from bfd_user where userid="+value);
		jdbcOperations.update("delete from bfd_user_roles where userid="+value);
		jdbcOperations.update("delete from bfd_user_company where userid="+value);
		jdbcOperations.update("delete from bfd_user_position where userid="+value);
		
	}
	
	@Transactional
	public void name2(String sql) {
		baseDao.getJdbcOperations().batchUpdate(sql);
		baseDao.getNamedParameterJdbcTemplate();
	}
	
	private String userid = null;
	public List<String>  insert(JsonNode jsonNode) {
		List<String> stringlList = new ArrayList<String>();
		stringlList.addAll(iteratorMetod(jsonNode, "bfd_user","insert"));
		return stringlList;
	}
	public List<String>  update(JsonNode jsonNode) {
		List<String> stringlList = new ArrayList<String>();
		stringlList.addAll(iteratorMetod(jsonNode, "bfd_user","update"));
		return stringlList;
	}
	public List<String> iteratorMetod(JsonNode jsonNode, String tableName,String methodName) {
		List<String> stringlList = new ArrayList<String>();
		List<Map<String, Object>> lMaps = new ArrayList<Map<String,Object>>();
		for (Iterator<Entry<String, JsonNode>> entryIterator = jsonNode.fields(); entryIterator.hasNext();) {
			Entry<String, JsonNode> entry = entryIterator.next();
			if (entry.getValue().isArray() || entry.getValue().isObject()) {
				if (entry.getValue().isArray()) {
					for (JsonNode jsonNode2 : entry.getValue()) {
						stringlList.addAll(iteratorMetod(jsonNode2, entry.getKey(),methodName));
					}
				} else if (entry.getValue().isObject()) {
					stringlList.addAll(iteratorMetod(entry.getValue(), entry.getKey(),methodName));
				}
			} else {
				Map<String, Object> map = new HashMap<String, Object>();
				System.out.println(entry.getKey() + "---" + entry.getValue().asText());
				if(entry.getKey().equalsIgnoreCase("userid")){
					userid = entry.getValue().asText();
					continue;
				}
				map.put(entry.getKey(), entry.getValue().asText());
				lMaps.add(map);
			}
		}
		if(methodName.equalsIgnoreCase("insert")){
			stringlList.add(insertMethod(lMaps, tableName));
		}else{
			stringlList.add(updateMethod(lMaps, tableName));
		}
		return stringlList;
	}
	
	public String insertMethod(List<Map<String, Object>> lMaps, String tableName) {
		StringBuilder stringBuilderFields = new StringBuilder();
		StringBuilder stringBuilderValues = new StringBuilder();
		int len = lMaps.size();
		for (int i = 0, len1 = len - 1; i < len1; i++) {
			for (Entry<String, Object> entry : lMaps.get(i).entrySet()) {
				stringBuilderFields.append(entry.getKey()).append(",");
				stringBuilderValues.append("'").append(entry.getValue()).append("'").append(",");
			}
		}
		
		for (Entry<String, Object> entry : lMaps.get(len - 1).entrySet()) {
			stringBuilderFields.append(entry.getKey());
			stringBuilderValues.append("'").append(entry.getValue()).append("'");
		}
		StringBuilder stringBuilder = new StringBuilder("insert into ");
		stringBuilder.append(tableName).append(" (userid,").append(stringBuilderFields).append(") ");
		stringBuilder.append("values(").append("'").append(userid).append("'").append(",").append(stringBuilderValues).append(")");
		return stringBuilder.toString();
	}
	
	public String updateMethod(List<Map<String, Object>> lMaps, String tableName) {
		StringBuilder stringBuilderFields = new StringBuilder();
		StringBuilder stringBuilderValues = new StringBuilder();
		int len = lMaps.size();
		for (int i = 0, len1 = len - 1; i < len1; i++) {
			for (Entry<String, Object> entry : lMaps.get(i).entrySet()) {
				if(entry.getValue().equals("userid")){
					stringBuilderValues.append(" where userid=").append("'").append(entry.getValue()).append("'");
				}else{
					stringBuilderFields.append(entry.getKey()).append("=").append("'").append(entry.getValue()).append("'").append(",");
				}
			}
		}
		
		for (Entry<String, Object> entry : lMaps.get(len - 1).entrySet()) {
			if(entry.getValue().equals("userid")){
				stringBuilderValues.append(" where userid=").append("'").append(entry.getValue()).append("'");
			}else{
				stringBuilderFields.append(entry.getKey()).append("=").append("'").append(entry.getValue()).append("'");
			}
		}
		StringBuilder stringBuilder = new StringBuilder("update ");
		stringBuilder.append(tableName).append(" set ").append(stringBuilderFields).append(stringBuilderValues);
		return stringBuilder.toString();
	}
}
