package com.zte.ums.bcp.orm.framework.sql.service;

import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.WhereCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.ComparableAssignedField;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.Field;
import com.zte.ums.bcp.orm.framework.sql.keyword.PublicKeyword;
import com.zte.ums.bcp.orm.framework.sql.util.DBTableFieldHelper;
import com.zte.ums.bcp.orm.framework.sql.util.SpecialHandlingUtil;
import com.zte.ums.bcp.orm.framework.systemproperty.service.DatabasePropertyService;

@Service
public class WhereContionSqlSplicingService {
    @Resource
    private DatabasePropertyService databasePropertyService;
    @Resource
    private DBTableFieldHelper dbFieldHelper;

    public String splicingWhereContionSql(WhereCondition whereCondition) {
        return splicingConditionSql(whereCondition, PublicKeyword.KEY_WHERE);
    }

    private String splicingConditionSql(WhereCondition whereCondition, String type) {
        StringBuilder whereContionSql = new StringBuilder();
        whereContionSql.append(getWhereContionSql(whereCondition));
        if (whereContionSql.length() > 0) {
            whereContionSql.insert(0, " ").insert(0, type);
        }
        return whereContionSql.toString();
    }

    public String splicingHavingContionSql(WhereCondition whereCondition) {
        return splicingConditionSql(whereCondition, PublicKeyword.KEY_HAVING);
    }

    private StringBuilder splicingComparableSql(List<ComparableAssignedField> comparableAssignedFields, int logic) {
        StringBuilder comparableSql = new StringBuilder();
        if (CollectionUtils.isNotEmpty(comparableAssignedFields)) {
            for (int i = 0; i < comparableAssignedFields.size(); i++) {
                ComparableAssignedField comparableAssignedField = comparableAssignedFields.get(i);
                String comparison = comparableAssignedField.getComparison().trim();
                Field field = comparableAssignedField.getField();
                List<String> value = comparableAssignedField.getValue();
                if (StringUtils.isNotBlank(comparison) && null != field && null != value) {
                    comparableSql.append(dbFieldHelper.getTableFieldSql(field));
                    comparableSql.append(" ");
                    comparableSql.append(comparison);
                    comparableSql.append(" ");

                    if (comparison.equalsIgnoreCase(PublicKeyword.KEY_IN.trim()) ||
                        comparison.equalsIgnoreCase(PublicKeyword.KEY_NOT_IN.trim())) {
                        comparableSql.append("(");
                        for (int j = 0; j < value.size(); j++) {
                            String string = value.get(j);
                            comparableSql.append("'");
                            comparableSql.append(string);
                            comparableSql.append("'");
                            if (j != (value.size() - 1)) {
                                comparableSql.append(",");
                            }
                        }
                        comparableSql.append(")");
                    } else {
                        if (PublicKeyword.KEY_IS.trim().equalsIgnoreCase(comparison)) {
                            comparableSql.append(SpecialHandlingUtil.handlingValueWithSingleQuotes(value.get(0)));
                        } else {
                            comparableSql.append("'");
                            comparableSql.append(SpecialHandlingUtil.handlingValueWithSingleQuotes(value.get(0)));
                            comparableSql.append("'");
                        }
                    }

                    if (i != (comparableAssignedFields.size() - 1)) {
                        comparableSql.append(" ");
                        if (logic == WhereCondition.LOGIC_AND) {
                            comparableSql.append(PublicKeyword.KEY_AND);
                        } else if (logic == WhereCondition.LOGIC_OR) {
                            comparableSql.append(PublicKeyword.KEY_OR);
                        }
                        comparableSql.append(" ");
                    }
                }
            }
        }
        return comparableSql;
    }

    private String getWhereContionSql(WhereCondition whereCondition) {
        if (null == whereCondition) {
            return "";
        }
        StringBuilder oneWhereContionSql = new StringBuilder();
        StringBuilder comparableSql = new StringBuilder();
        List<ComparableAssignedField> comparableAssignedFields = whereCondition.getComparableAssignedFields();
        if (CollectionUtils.isNotEmpty(comparableAssignedFields)) {
            comparableSql.append(splicingComparableSql(comparableAssignedFields, whereCondition.getLogic()));
        }

        StringBuilder whereConditionsSql = new StringBuilder();
        List<WhereCondition> whereConditions = whereCondition.getWhereConditions();
        if (CollectionUtils.isNotEmpty(whereConditions)) {
            for (int i = 0; i < whereConditions.size(); i++) {
                WhereCondition whereConditionChild = whereConditions.get(i);
                if (null != whereConditionChild) {
                    StringBuilder whereConditionChildsStringBuilder = new StringBuilder();
                    whereConditionChildsStringBuilder.append(getWhereContionSql(whereConditionChild));
                    if (whereConditionChildsStringBuilder.length() > 0) {
                        whereConditionsSql.append("(");
                        whereConditionsSql.append(getWhereContionSql(whereConditionChild));
                        whereConditionsSql.append(")");

                        if (i != (whereConditions.size() - 1)) {
                            whereConditionsSql.append(" ");
                            if (whereCondition.getLogic() == WhereCondition.LOGIC_AND) {
                                whereConditionsSql.append(PublicKeyword.KEY_AND);
                            } else if (whereCondition.getLogic() == WhereCondition.LOGIC_OR) {
                                whereConditionsSql.append(PublicKeyword.KEY_OR);
                            }
                            whereConditionsSql.append(" ");
                        }
                    }
                }
            }
        }

        oneWhereContionSql.append(comparableSql);
        if (whereConditionsSql.length() > 0 && comparableSql.length() > 0) {
            oneWhereContionSql.append(" ");
            if (whereCondition.getLogic() == WhereCondition.LOGIC_AND) {
                oneWhereContionSql.append(PublicKeyword.KEY_AND);
            } else if (whereCondition.getLogic() == WhereCondition.LOGIC_OR) {
                oneWhereContionSql.append(PublicKeyword.KEY_OR);
            }
            oneWhereContionSql.append(" ");
        } else if (whereConditionsSql.length() > 0 && comparableSql.length() == 0) {
            oneWhereContionSql.append(" ");
            oneWhereContionSql.append(PublicKeyword.KEY_ONE_AND_ONE);
            oneWhereContionSql.append(" ");
            oneWhereContionSql.append(PublicKeyword.KEY_AND);
            oneWhereContionSql.append(" ");
        }
        oneWhereContionSql.append(whereConditionsSql);

        return oneWhereContionSql.toString();
    }
}
