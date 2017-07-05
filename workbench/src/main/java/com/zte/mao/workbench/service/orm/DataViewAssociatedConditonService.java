package com.zte.mao.workbench.service.orm;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.base.OrmQueryCondition;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.workbench.def.TDataViewAssociatedConditon;
import com.zte.mao.workbench.entity.model.DataViewAssociatedConditonPo;

@Service
public class DataViewAssociatedConditonService {
    private static final String[] COLUMNS = new String[] {
        TDataViewAssociatedConditon.COL_NAME_CHILD_COLUMN_NAME,
        TDataViewAssociatedConditon.COL_NAME_CHILD_TABLE_NAME,
        TDataViewAssociatedConditon.COL_NAME_COMPARISON,
        TDataViewAssociatedConditon.COL_NAME_MAIN_COLUMN_NAME,
        TDataViewAssociatedConditon.COL_NAME_MAIN_TABLE_NAME,
        TDataViewAssociatedConditon.COL_NAME_ASSOCIATED_ID,
        TDataViewAssociatedConditon.COL_NAME_VIEW_ID
    };

    @Resource
    private OrmDao ormDao;

    private DataViewAssociatedConditonPo getDataViewAssociatedConditonPo(Map<String, String> result) {
        DataViewAssociatedConditonPo dataViewAssociatedConditonPo = new DataViewAssociatedConditonPo();
        dataViewAssociatedConditonPo.setViewId(result.get(TDataViewAssociatedConditon.COL_NAME_VIEW_ID));
        dataViewAssociatedConditonPo.setAssociatedId(result.get(TDataViewAssociatedConditon.COL_NAME_ASSOCIATED_ID));
        dataViewAssociatedConditonPo.setChildColumnName(result.get(TDataViewAssociatedConditon.COL_NAME_CHILD_COLUMN_NAME));
        dataViewAssociatedConditonPo.setChildTableName(result.get(TDataViewAssociatedConditon.COL_NAME_CHILD_TABLE_NAME));
        dataViewAssociatedConditonPo.setComparison(result.get(TDataViewAssociatedConditon.COL_NAME_COMPARISON));
        dataViewAssociatedConditonPo.setMainColumnName(result.get(TDataViewAssociatedConditon.COL_NAME_MAIN_COLUMN_NAME));
        dataViewAssociatedConditonPo.setMainTableName(result.get(TDataViewAssociatedConditon.COL_NAME_MAIN_TABLE_NAME));
        return dataViewAssociatedConditonPo;
    }
    
    public List<DataViewAssociatedConditonPo> getDataViewAssociatedConditonPos(Set<String> ViewIds, String tenantId) throws MaoCommonException {
        List<OrmQueryCondition> conditionlist = new ArrayList<OrmQueryCondition>();
        if (CollectionUtils.isNotEmpty(ViewIds) && StringUtils.isNotBlank(tenantId)) {
            conditionlist.add(new OrmQueryCondition(
                    TDataViewAssociatedConditon.COL_NAME_VIEW_ID,
                    OrmQueryCondition.COMPARE_IN,
                    ViewIds));
        }
        List<Map<String, String>> resultMap = ormDao.getData(TDataViewAssociatedConditon.NAME, COLUMNS, conditionlist, "and", tenantId);
        List<DataViewAssociatedConditonPo> dataViewAssociatedConditonPos = new ArrayList<DataViewAssociatedConditonPo>();
        for (Map<String, String> result : resultMap) {
            dataViewAssociatedConditonPos.add(getDataViewAssociatedConditonPo(result));
        }
        return dataViewAssociatedConditonPos;
    }
}
