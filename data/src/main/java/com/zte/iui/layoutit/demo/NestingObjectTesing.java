package com.zte.iui.layoutit.demo;


import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.iui.layoutit.dao.BaseDao;

/**
 * 
 * @author HX
 *
 */
@RequestMapping("/bcp/")
@Controller
public class NestingObjectTesing {
	private static Logger logger = Logger.getLogger(NestingObjectTesing.class.getName());
	
	@Resource
	private BaseDao baseDao;
	
	@Resource
	private NestingService nestingService;
	
	/**
	 * 
	 * 增加方法
	 */
	@RequestMapping(value = "layoutit", method = RequestMethod.POST)
	@ResponseBody
	public int saveData(@RequestBody String content) {
		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode jsonNode  = null;
		try {
			jsonNode = objectMapper.readTree(content);
		}catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
		List<String> listSql = nestingService.insert(jsonNode);
		nestingService.save(listSql);
	    return 0;
		
	}
	/**
	 * 查询方法
	 */
	 @RequestMapping(value = "layoutit", method = RequestMethod.GET)
	 @ResponseBody
	public Map<String,Object> getSingleData(@RequestParam Map request) {
		 String key = "";
		 String value = "";
		 for (Object keyObj : request.keySet()) {
			 	key = (String)keyObj;
			 	value = (String) request.get(key);
			  }
		 
		 String sql = "select * from bfd_user_roles where userid="+value;
		 String sqlUser = "select * from bfd_user where userid="+value;
		 String sqlType = "select * from bfd_user_company where userid="+value;
		 String sqlPost = "select * from bfd_user_position where userid="+value;
		 List<Map<String, Object>> map = baseDao.getList(sql);
		 Map<String,Object> mapUser = baseDao.getMap(sqlUser);
		 Map<String,Object> mapType = baseDao.getMap(sqlType);
		 Map<String,Object> mapPost = baseDao.getMap(sqlPost);
		 mapType.put("bfd_user_position", mapPost);
		 mapUser.put("bfd_user_company", mapType);
		 mapUser.put("bfd_user_roles", map);
		 return mapUser; 
	}
	 /**
		 * 查询方法
		 */
		 @RequestMapping(value = "sysdata", method = RequestMethod.GET)
		 @ResponseBody
		public String getData() {	 
			 return "{"+"\"username\""+":"+"\"张三\""+","+"\"originatedate\""+":"+"\"2016-8-30\""+","+"\"ouname\""+":"+"\"成都研发\""+","+"\"sequenceno\""+":"+"\"531562435\""+"}"; 
		}
	 /**
	  * 
	  * 修改方法
	  */
	 @RequestMapping(value = "layoutit", method = RequestMethod.PUT)
	 @ResponseBody
	 public int putData(@RequestBody String content,@RequestParam Map request) {
		 String key = "";
		 String value = "";
		 for (Object keyObj : request.keySet()) {
			 	key = (String)keyObj;
			 	value = (String) request.get(key);
			  }
		 ObjectMapper objectMapper = new ObjectMapper();
			JsonNode jsonNode  = null;
			try {
				jsonNode = objectMapper.readTree(content);
			}catch (Exception e) {
				logger.error(e.getMessage(), e);
			}
			nestingService.delete(value);
			List<String> listSql = nestingService.insert(jsonNode);
			nestingService.save(listSql);
		    return 0;
	}
	 /**
	  *删除方法
	  */
	 @RequestMapping(value = "", method = RequestMethod.DELETE)
		@ResponseBody
		public int deleteData(@RequestParam Map request) {
			 String key = "";
			 String value = "";
			 for (Object keyObj : request.keySet()) {
				 	key = (String)keyObj;
				 	value = (String) request.get(key);
				  }
			nestingService.delete(value);
			return 0;
		}
	 

}
