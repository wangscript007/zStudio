package com.zte.dataservice.mongoextension.dao;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.mongodb.DB;
import com.mongodb.MongoClient;
import com.zte.ums.bcp.orm.framework.systemproperty.service.DatabasePropertyService;

@Service
public abstract class MongoHelperBase {
    @Resource
    private DatabasePropertyService databasePropertyService;
	/**
	 * 获取默认数据库
	 * 
	 * @param dataBase
	 * @return
	 */
	@SuppressWarnings("deprecation")
	public DB getDB(String dataBase) {
		if (StringUtils.isBlank(dataBase)) {
			dataBase = databasePropertyService.getDbSchema();
		}

		// if (this.getMongoDB() == null
		// || !this.getMongoDB().getName().equalsIgnoreCase(dataBase)) {
		// this.setMongoDB(this.getMongoClient().getDB(dataBase));
		// }
		//
		// return this.getMongoDB();

		return this.mongoClient.getDB(dataBase);
	}

	/**
	 * mongo 客户端
	 */
	@Resource(name="mongo")
	protected MongoClient mongoClient;

}
