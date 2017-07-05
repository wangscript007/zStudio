package com.zte.mao.workbench.service.orm;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.base.OrmQueryCondition;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.service.OrmBasicService;
import com.zte.mao.workbench.controller.DataModelController;
import com.zte.mao.workbench.def.TDataModelGroup;
import com.zte.mao.workbench.entity.model.DataModelGroup;

@Service
public class DataModelGroupService extends OrmBasicService<DataModelGroup> {
    private static Logger logger = Logger.getLogger(DataModelGroupService.class);
	private static final String[] COLUMNS = new String[] {
	    TDataModelGroup.COL_NAME_ID,
	    TDataModelGroup.COL_NAME_NAME,
	    TDataModelGroup.COL_NAME_MODEL_ID
	    };

	@Resource
	private OrmDao ormDao;
    
    public List<DataModelGroup> getGroups(Collection<String> modelIds, String tenantId) throws MaoCommonException {
        List<OrmQueryCondition> conditionlist = new ArrayList<OrmQueryCondition>();
        if (CollectionUtils.isNotEmpty(modelIds) && StringUtils.isNotBlank(tenantId)) {
            conditionlist.add(new OrmQueryCondition(
                    TDataModelGroup.COL_NAME_MODEL_ID,
                    OrmQueryCondition.COMPARE_IN,
                    modelIds));
        }
        List<Map<String, String>> resultMap = ormDao.getData(TDataModelGroup.NAME, COLUMNS, conditionlist, "and", tenantId);
        return result2List(resultMap);
    }

    public Map<String,List<DataModelGroup>> getGroupMap(Collection<String> modelIdColl) throws MaoCommonException {
        List<OrmQueryCondition> conditionlist = new ArrayList<OrmQueryCondition>();
        if (CollectionUtils.isNotEmpty(modelIdColl)) {
            conditionlist.add(new OrmQueryCondition(
                    TDataModelGroup.COL_NAME_MODEL_ID,
                    OrmQueryCondition.COMPARE_IN,
                    modelIdColl));
        }
        List<Map<String, String>> resultMap = ormDao.getData(TDataModelGroup.NAME, COLUMNS, conditionlist, "and", null, DataModelController.getTenantId());
        return result2Map(resultMap, TDataModelGroup.COL_NAME_MODEL_ID);
    }

    public boolean addGroups(List<DataModelGroup> modelItemGroupList) throws MaoCommonException {
        if (CollectionUtils.isEmpty(modelItemGroupList)) {
            return false;
        }
        List<Map<String, String>> data = new ArrayList<Map<String,String>>();
        for (DataModelGroup dataModelItem: modelItemGroupList) {
            data.add(dataModelItem.toMap(dataModelItem));
        }
        return ormDao.addList(TDataModelGroup.NAME, data, DataModelController.getTenantId());
    }

    public boolean deleteGroupsByModelIds(Set<String> modelIds, String tenantId) throws MaoCommonException {
        List<OrmQueryCondition> ormQueryConditions = new ArrayList<OrmQueryCondition>();
        if (CollectionUtils.isNotEmpty(modelIds)) {
            OrmQueryCondition ormQueryCondition = new OrmQueryCondition();
            ormQueryCondition.setCname(TDataModelGroup.COL_NAME_MODEL_ID)
                             .setCompare(OrmQueryCondition.COMPARE_IN)
                             .setValues(modelIds);
            ormQueryConditions.add(ormQueryCondition);
        }
        return this.deleteGroupsByConditions(ormQueryConditions, tenantId);
    }

    private boolean deleteGroupsByConditions(List<OrmQueryCondition> ormQueryConditions, String tenantId) throws MaoCommonException {
        return ormDao.delete(TDataModelGroup.NAME, ormQueryConditions, tenantId);
    }

    @Override
    protected DataModelGroup getRow(Map<String, String> result) throws MaoCommonException {
        DataModelGroup modelGroup = new DataModelGroup();
        modelGroup.setId(result.get(TDataModelGroup.COL_NAME_ID))
                  .setName(result.get(TDataModelGroup.COL_NAME_NAME))
                  .setModelId(result.get(TDataModelGroup.COL_NAME_MODEL_ID));
        return modelGroup;
    }

    public void updateGroups(String modelId, List<DataModelGroup> modelItemGroupList, String tenantId) throws MaoCommonException {
        OrmQueryCondition condition = new OrmQueryCondition(
                TDataModelGroup.COL_NAME_MODEL_ID,
                OrmQueryCondition.COMPARE_EQUALS,
                modelId);
        ormDao.delete(TDataModelGroup.NAME, condition, tenantId);
        addGroups(modelItemGroupList);
    }
}
