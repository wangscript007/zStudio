package com.zte.mao.workbench.service.orm;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.base.OrmQueryCondition;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.workbench.controller.DataModelController;
import com.zte.mao.workbench.def.TDataModelInfo;
import com.zte.mao.workbench.entity.model.DataModelBaisc;

@Service
public class DataModelInfoService {
    private static final Logger logger = Logger.getLogger(DataModelInfoService.class);
	private static final String[] COLUMNS = new String[] {
	    TDataModelInfo.COL_NAME_ID,
	    TDataModelInfo.COL_NAME_NAME,
	    TDataModelInfo.COL_NAME_DESCRIPTION,
	    TDataModelInfo.COL_NAME_SCENE,
	    TDataModelInfo.COL_NAME_CREATOR,
	    TDataModelInfo.COL_NAME_CREATE_TIME,
	    TDataModelInfo.COL_NAME_UPDATE_TIME,
	    TDataModelInfo.COL_NAME_BIND_TABLE_NAME,
	    TDataModelInfo.COL_NAME_SCRIPT,
	    TDataModelInfo.COL_NAME_I18N
	    };

	@Resource
	private OrmDao ormDao;
	
	@Resource
	private DataModelFormService dataModelFormService;

	public Set<DataModelBaisc> getDataModelGeneralInfos(String appId, String modelId_in) throws MaoCommonException {
        List<OrmQueryCondition> conditionlist = new ArrayList<OrmQueryCondition>();
        if (StringUtils.isNotBlank(modelId_in)) {
            conditionlist.add(new OrmQueryCondition(
                    TDataModelInfo.COL_NAME_ID,
                    OrmQueryCondition.COMPARE_EQUALS,
                    modelId_in));
        }
        String[] generlColumns = new String[] {
                TDataModelInfo.COL_NAME_ID,
                TDataModelInfo.COL_NAME_NAME,
                TDataModelInfo.COL_NAME_BIND_TABLE_NAME};
        List<Map<String, String>> resultMap = ormDao.getData(TDataModelInfo.NAME, generlColumns, conditionlist, "and", DataModelController.getTenantId());
        Set<DataModelBaisc> modelSet = new HashSet<DataModelBaisc>();
        for (Map<String, String> result : resultMap) {
            DataModelBaisc modelInfo = parseResult(result);
            modelSet.add(modelInfo);
        }
        return modelSet;
    }

	public void addDataModel(DataModelBaisc baisc) throws MaoCommonException {
	    ormDao.add(TDataModelInfo.NAME, baisc.toMap(), DataModelController.getTenantId());
	}

    public void updateDataModel(DataModelBaisc baisc) throws MaoCommonException {
        ArrayList<OrmQueryCondition> conditionList = new ArrayList<OrmQueryCondition>();
        conditionList.add(new OrmQueryCondition(
                TDataModelInfo.COL_NAME_ID,
                OrmQueryCondition.COMPARE_EQUALS,
                baisc.getId()));
        ormDao.update(TDataModelInfo.NAME, baisc.toMap(), conditionList, "and", DataModelController.getTenantId());
    }

    private DataModelBaisc parseResult(Map<String, String> result) throws MaoCommonException {
        DataModelBaisc modelInfo = new DataModelBaisc();
        modelInfo.setId(result.get(TDataModelInfo.COL_NAME_ID))
                 .setName(result.get(TDataModelInfo.COL_NAME_NAME))
                 .setCreator(result.get(TDataModelInfo.COL_NAME_CREATOR))
                 .setBindTable(result.get(TDataModelInfo.COL_NAME_BIND_TABLE_NAME))
                 .setDescription(result.get(TDataModelInfo.COL_NAME_DESCRIPTION))
                 .setI18n(result.get(TDataModelInfo.COL_NAME_I18N))
                 .setScript(result.get(TDataModelInfo.COL_NAME_SCRIPT));

        String createTimeStr = result.get(TDataModelInfo.COL_NAME_CREATE_TIME);
        String updateTimeStr = result.get(TDataModelInfo.COL_NAME_UPDATE_TIME);
        String sceneStr = result.get(TDataModelInfo.COL_NAME_SCENE);
        try {
            if (StringUtils.isNotBlank(createTimeStr)) {
                modelInfo.setCreateTime(DateUtils.parseDate(createTimeStr, TDataModelInfo.DATE_PATTERN));
            }
            if (StringUtils.isNotBlank(updateTimeStr)) {
                modelInfo.setUpdateTime(DateUtils.parseDate(updateTimeStr, TDataModelInfo.DATE_PATTERN));
            }
            if (StringUtils.isNotBlank(sceneStr)) {
                modelInfo.setScene(Integer.parseInt(sceneStr));
            }
        } catch (ParseException e) {
            logger.error(e.getMessage(), e);
            throw new MaoCommonException(e);
        }
        return modelInfo;
    }
	
	
	public Set<DataModelBaisc> getDataModelInfos(String appId, String tenantId, String modelId) throws MaoCommonException {
        List<OrmQueryCondition> conditionlist = new ArrayList<OrmQueryCondition>();
        if (StringUtils.isNotBlank(modelId)) {
            conditionlist.add(new OrmQueryCondition(
                    TDataModelInfo.COL_NAME_ID,
                    OrmQueryCondition.COMPARE_EQUALS,
                    modelId));
        }
        return getDataModelInfosByConditions(tenantId, conditionlist);
    }
	
	public Set<DataModelBaisc> getDataModelInfos(Set<String> modelIds, String tenantId) throws MaoCommonException {
        List<OrmQueryCondition> conditionlist = new ArrayList<OrmQueryCondition>();
        if (CollectionUtils.isNotEmpty(modelIds)) {
            conditionlist.add(new OrmQueryCondition(
                    TDataModelInfo.COL_NAME_ID,
                    OrmQueryCondition.COMPARE_IN,
                    modelIds));
        }
        return getDataModelInfosByConditions(tenantId, conditionlist);
    }

    private Set<DataModelBaisc> getDataModelInfosByConditions(String tenantId,
            List<OrmQueryCondition> conditionlist) throws MaoCommonException {
        List<Map<String, String>> resultMap = ormDao.getData(TDataModelInfo.NAME, COLUMNS, conditionlist, "and", tenantId);
        Set<DataModelBaisc> modelSet = new HashSet<DataModelBaisc>();
        for (Map<String, String> result : resultMap) {
            DataModelBaisc modelInfo = parseResult(result);
            modelSet.add(modelInfo);
        }
        return modelSet;
    }

	private boolean deleteDataModelInfosByConditions(List<OrmQueryCondition> ormQueryConditions, String tenantId) throws MaoCommonException {
	    return ormDao.delete(TDataModelInfo.NAME, ormQueryConditions, tenantId);
    }
	
	public boolean updateDataModelInfoById(Map<String, String> data, String modelId, String tenantId) throws MaoCommonException {
        List<OrmQueryCondition> ormQueryConditions = new ArrayList<OrmQueryCondition>();
        if (StringUtils.isNotBlank(modelId)) {
            ormQueryConditions.add(new OrmQueryCondition(
                    TDataModelInfo.COL_NAME_ID,
                    OrmQueryCondition.COMPARE_EQUALS,
                    modelId));
        }
        return ormDao.update(TDataModelInfo.NAME, data, ormQueryConditions , "and", tenantId);
    }
	
	
	public boolean updateDataModelInfoByConditions(Map<String, String> data, List<OrmQueryCondition> ormQueryConditions, String tenantId) throws MaoCommonException {
        return ormDao.update(TDataModelInfo.NAME, data, ormQueryConditions, "and", tenantId);
    }
	
	public boolean deleteDataModelInfosByModelId(String modelId, String tenantId) throws MaoCommonException {
        Set<String> modelIds = new HashSet<String>();
        if (StringUtils.isNotBlank(modelId)) {
            modelIds.add(modelId);
        }
        return this.deleteDataModelInfosByModelIds(modelIds, tenantId);
    }
    
    public boolean deleteDataModelInfosByModelIds(Set<String> modelIds, String tenantId) throws MaoCommonException {
        List<OrmQueryCondition> ormQueryConditions = new ArrayList<OrmQueryCondition>();
        if (CollectionUtils.isNotEmpty(modelIds)) {
            OrmQueryCondition ormQueryCondition = new OrmQueryCondition();
            ormQueryCondition.setCname(TDataModelInfo.COL_NAME_ID)
                             .setCompare(OrmQueryCondition.COMPARE_IN)
                             .setValues(modelIds);
            ormQueryConditions.add(ormQueryCondition);
        }
        return this.deleteDataModelInfosByConditions(ormQueryConditions, tenantId);
    }
    
    public DataModelBaisc getQueryBasic(String validateType, String modelId) throws MaoCommonException {
        Set<DataModelBaisc> basicSet = this.getDataModelInfos(null, DataModelController.getTenantId(), modelId);
        if (CollectionUtils.isEmpty(basicSet)) {
        	if("update".equals(validateType)){
        		throw new MaoCommonException("修改的数据模型不存在。模型编号：" + modelId );
        	}else if("delete".equals(validateType)){
//        		throw new MaoCommonException("数据模型" + modelId + "已删除" );
        		return null;
        	}
        }
        return basicSet.toArray(new DataModelBaisc[basicSet.size()])[0];
    }
}
