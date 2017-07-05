package com.zte.mao.common.service;

import java.util.List;

import com.zte.mao.common.entity.UserEntity;

public interface UserService {
    /**
     * 添加用户
     * @param user
     */
    void add(UserEntity user) throws Exception;
    
    /**
     * 更新租户用户
     * @param user
     */
    void update(UserEntity user) throws Exception;
    	
    /**
     * 删除租户
     * @param tenantId
     * @param login_name
     */
    void delete(String tenantId,String login_name) throws Exception;
    
    /**
     * 查询租户用户 
     * @param tenantId 租户id
     * @param login_name 登录名称
     * @return
     */
    List<UserEntity> getUsers(String tenantId,String login_name)throws Exception;
    
    /**
     * 判断租户用户是否存在
     * @param tenantId
     * @param login_name
     * @return
     * @throws Exception
     */
    boolean isUserExist(String tenantId,String login_name)throws Exception;
}
