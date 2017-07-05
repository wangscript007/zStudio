package com.zte.mao.workbench.service.orm;

import java.text.ParseException;
import java.util.ArrayList;
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
import com.zte.mao.common.base.OrmQueryOrder;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.workbench.def.TDataViewInfo;
import com.zte.mao.workbench.entity.model.DataViewBase;

@Service
public class DataViewBaseService {
    private static final Logger logger = Logger.getLogger(DataViewBaseService.class);
    private static final String[] COLUMNS = new String[] {
        TDataViewInfo.COL_NAME_CREATE_TIME,
        TDataViewInfo.COL_NAME_CREATOR,
        TDataViewInfo.COL_NAME_ID,
        TDataViewInfo.COL_NAME_MAIN_TABLE_NAME,
        TDataViewInfo.COL_NAME_UPDATE_TIME
        };

    @Resource
    private OrmDao ormDao;

    private DataViewBase getDataViewBase(Map<String, String> result) throws ParseException {
        DataViewBase dataViewBase = new DataViewBase();
        dataViewBase.setCreator(result.get(TDataViewInfo.COL_NAME_CREATOR))
                    .setId(result.get(TDataViewInfo.COL_NAME_ID))
                    .setMainTableName(result.get(TDataViewInfo.COL_NAME_MAIN_TABLE_NAME));
        String createTimeString = result.get(TDataViewInfo.COL_NAME_CREATE_TIME);
        String updateTimeString = result.get(TDataViewInfo.COL_NAME_UPDATE_TIME);
        if (StringUtils.isNotBlank(createTimeString)) {
            dataViewBase.setCreateTime(DateUtils.parseDate(createTimeString, TDataViewInfo.DATE_PATTERN));
        }
        if (StringUtils.isNotBlank(updateTimeString)) {
            dataViewBase.setUpdateTime(DateUtils.parseDate(updateTimeString, TDataViewInfo.DATE_PATTERN));
        }
        
        return dataViewBase;
    }
    
    public List<DataViewBase> getDataViewBases(Set<String> viewIds, String tenantId) throws MaoCommonException {
        List<OrmQueryCondition> conditionlist = new ArrayList<OrmQueryCondition>();
        if (CollectionUtils.isNotEmpty(viewIds) && StringUtils.isNotBlank(tenantId)) {
            conditionlist.add(new OrmQueryCondition(
                    TDataViewInfo.COL_NAME_ID,
                    OrmQueryCondition.COMPARE_IN,
                    viewIds));
        }
        List<OrmQueryOrder> orders = new ArrayList<OrmQueryOrder>();
        orders.add(new OrmQueryOrder(TDataViewInfo.COL_NAME_UPDATE_TIME, OrmQueryOrder.ORDER_DESC));
        List<Map<String, String>> resultMap = ormDao.getData(TDataViewInfo.NAME, COLUMNS, conditionlist, "and", orders, tenantId);
        List<DataViewBase> dataViewBases = new ArrayList<DataViewBase>();
        for (Map<String, String> result : resultMap) {
            try {
                dataViewBases.add(getDataViewBase(result));
            } catch (ParseException e) {
                logger.error(e.getMessage(), e);
                throw new MaoCommonException(e);
            }
        }
        return dataViewBases;
    }
}
