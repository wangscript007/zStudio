package com.zte.mao.workbench.service.orm;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.workbench.entity.model.TableColumnInfo;

@Service
public class TableColumnInfoService {

    @Resource
    private OrmDao ormDao;
    
    public List<TableColumnInfo> getTableColumnInfos(String tableName, String tenantId) throws MaoCommonException {
        List<TableColumnInfo> tableColumnInfos = new ArrayList<TableColumnInfo>();
        for (Map<String, String> column: ormDao.getTableColumns(tableName, tenantId)) {
            TableColumnInfo tableColumnInfo = new TableColumnInfo();
            tableColumnInfo.setCharacterMaximumLength(column.get("character_maximum_length"))
                           .setColumnDefault(column.get("column_default"))
                           .setColumnKey(column.get("column_key"))
                           .setColumnName(column.get("column_name"))
                           .setColumnType(column.get("column_type"))
                           .setDataType(column.get("data_type"))
                           .setExtra(column.get("extra"))
                           .setIsNullable(column.get("is_nullable"))
                           .setNumericPrecision(column.get("numeric_precision"))
                           .setNumericScale(column.get("numeric_scale"))
                           .setOriginalDataType(column.get("original_data_type"));
            tableColumnInfos.add(tableColumnInfo);
        }
        return tableColumnInfos;
    }
}
