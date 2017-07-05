package com.zte.mao.common.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.entity.CommonConst;

@Service
public class Workbench {
	@Resource
	private OrmDao ormDao;

	public void insertDefaultData(String tenantId, String loginName) throws Exception {
		
		List<String[]> list = getWorkbenchBaseData(loginName);
		List<Map<String, String>> data = new ArrayList<Map<String,String>>();
		for (String[] vals : list) {
			Map<String, String> item = new HashMap<String, String>();
			item.put("LOGIN_NAME", vals[0]);
			item.put("MODULE_ID", vals[1]);
			item.put("MODULE_NAME", vals[2]);
			item.put("M_SHOW", vals[3]);
			item.put("M_ORDER", vals[4]);
			data.add(item);
		}
		ormDao.setPlatformType("").addList("WORKBENCH_MODULE", data , tenantId);
		ormDao.setPlatformType(CommonConst.PLATFORM_TYPE_MOCK).addList("WORKBENCH_MODULE", data , tenantId);
	}

	private List<String[]> getWorkbenchBaseData(String loginName) {
		List<String[]> list = new ArrayList<String[]>();
		String[] item = new String[] { loginName, "1", "我的申请", "1", "1" };
		list.add(item);
		item = new String[] { loginName, "2", "我的审批", "1", "2" };
		list.add(item);
		item = new String[] { loginName, "3", "个人信息", "1", "3" };
		list.add(item);
		item = new String[] { loginName, "4", "人员状态", "1", "4" };
		list.add(item);
		return list;
	}

}
