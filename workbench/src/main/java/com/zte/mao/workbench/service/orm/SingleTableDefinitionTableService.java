package com.zte.mao.workbench.service.orm;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.base.OrmQueryCondition;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.workbench.def.TSingleTableDefinitionTable;

@Service
public class SingleTableDefinitionTableService {
    private static final String[] COLUMNS = new String[] {
        TSingleTableDefinitionTable.COL_NAME_DESCRIPTION,
        TSingleTableDefinitionTable.COL_NAME_TABLE_NAME,
        TSingleTableDefinitionTable.COL_NAME_TABLE_TYPE
        };

    @Resource
    private OrmDao ormDao;
    
    private boolean deleteSingleTableDefinitionTablesByConditions(List<OrmQueryCondition> ormQueryConditions, String tenantId) throws MaoCommonException {
        return ormDao.delete(TSingleTableDefinitionTable.NAME, ormQueryConditions, tenantId);
    }
    
    public boolean deleteSingleTableDefinitionTablesById(String tableName, String tenantId) throws MaoCommonException {
        List<OrmQueryCondition> ormQueryConditions = new ArrayList<OrmQueryCondition>();
        if (StringUtils.isNotBlank(tableName)) {
            OrmQueryCondition ormQueryCondition = new OrmQueryCondition();
            ormQueryCondition.setCname(TSingleTableDefinitionTable.COL_NAME_TABLE_NAME)
                             .setCompare(OrmQueryCondition.COMPARE_EQUALS)
                             .setValue(tableName);
            ormQueryConditions.add(ormQueryCondition);
        }
        return this.deleteSingleTableDefinitionTablesByConditions(ormQueryConditions, tenantId);
    }
}
