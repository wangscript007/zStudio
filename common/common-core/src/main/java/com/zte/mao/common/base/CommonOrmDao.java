package com.zte.mao.common.base;

import com.zte.mao.common.entity.CommonConst;

public class CommonOrmDao extends OrmDao {
	private String ormIp;
	private String ormPort;

	public CommonOrmDao(String ormIp, String ormPort) {
		this.ormIp = ormIp;
		this.ormPort = ormPort;
	}
	
	@Override
	protected String getUrl(String uri, String tenantId, String queryString) {
		String url = "http://" + ormIp + ":" + ormPort;
		return com.zte.mao.common.util.MaoCommonUtil.getConvertDspUrl(uri, tenantId, queryString, CommonConst.PLATFORM_TYPE_RUNTIME);
	}
}
