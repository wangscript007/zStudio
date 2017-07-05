package com.zte.mao.common.service;

/**
 * Token管理，包括Token生成以及用户状态的维护
 */
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.entity.UserSimpleEntity;
import com.zte.mao.common.http.HttpRequestUtils;

@Service
public class TokenService {
	
	@Resource
	private HttpRequestUtils httpRequestUtils;
	@Resource
	private OrmDao ormDao;
	
	private Map<String, UserSimpleEntity> entityMap = new ConcurrentHashMap<String, UserSimpleEntity>();
	
	/**
	 * 登陆后调用该方法，返回token
	 * @param entity
	 * @return
	 * @throws Exception 
	 */
	public String add(UserSimpleEntity entity) {
		String token = UUID.randomUUID().toString().toUpperCase().replaceAll("-", "");
		entityMap.put(token, entity);
		return token;
	}
	
	public UserSimpleEntity loginoutAll(String token) {
		return entityMap.remove(token);
	}
	
	public UserSimpleEntity signinStatus(String token) throws Exception {
		UserSimpleEntity entity = entityMap.get(token);
		if(entity == null) {
			throw new Exception("通过 token " + token + " 未找到用户信息");
		}
		return entity;
	}
}
