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
import com.zte.mao.common.base.OrmQueryOrder;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.workbench.def.TDataViewAssociated;
import com.zte.mao.workbench.entity.model.DataViewAssociatedPo;

@Service
public class DataViewAssociatedService {
    private static final String[] COLUMNS = new String[] {
        TDataViewAssociated.COL_NAME_ASSOCIATED_TYPE,
        TDataViewAssociated.COL_NAME_ID,
        TDataViewAssociated.COL_NAME_ASSOCIATED_TABLE_NAME,
        TDataViewAssociated.COL_NAME_VIEW_ID
    };

    @Resource
    private OrmDao ormDao;
    @Resource
    private DataViewAssociatedConditonService dataViewAssociatedConditonService;

    private DataViewAssociatedPo getDataViewAssociatedPo(Map<String, String> result) {
        DataViewAssociatedPo dataViewAssociatedPo = new DataViewAssociatedPo();
        dataViewAssociatedPo.setAssociatedTableName(result.get(TDataViewAssociated.COL_NAME_ASSOCIATED_TABLE_NAME));
        dataViewAssociatedPo.setAssociatedType(result.get(TDataViewAssociated.COL_NAME_ASSOCIATED_TYPE));
        dataViewAssociatedPo.setId(result.get(TDataViewAssociated.COL_NAME_ID));
        dataViewAssociatedPo.setViewId(result.get(TDataViewAssociated.COL_NAME_VIEW_ID));
        return dataViewAssociatedPo;
    }
    
    public List<DataViewAssociatedPo> getDataViewAssociatedPos(Set<String> ViewIds, String tenantId) throws MaoCommonException {
        List<OrmQueryCondition> conditionlist = new ArrayList<OrmQueryCondition>();
        if (CollectionUtils.isNotEmpty(ViewIds) && StringUtils.isNotBlank(tenantId)) {
            conditionlist.add(new OrmQueryCondition(
                    TDataViewAssociated.COL_NAME_VIEW_ID,
                    OrmQueryCondition.COMPARE_IN,
                    ViewIds));
        }
        List<OrmQueryOrder> orders = new ArrayList<OrmQueryOrder>();
        orders.add(new OrmQueryOrder(TDataViewAssociated.COL_NAME_INDEX, OrmQueryOrder.ORDER_ASC));
        List<Map<String, String>> resultMap = ormDao.getData(TDataViewAssociated.NAME, COLUMNS, conditionlist, "and", orders, tenantId);
        List<DataViewAssociatedPo> dataViewAssociatedPos = new ArrayList<DataViewAssociatedPo>();
        for (Map<String, String> result : resultMap) {
                dataViewAssociatedPos.add(getDataViewAssociatedPo(result));
        }
        return dataViewAssociatedPos;
    }
}
