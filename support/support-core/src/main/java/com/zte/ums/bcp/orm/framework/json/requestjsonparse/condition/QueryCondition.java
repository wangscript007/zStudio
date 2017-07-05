package com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition;

import java.io.Serializable;
import java.util.List;

import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.Field;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.Group;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.Order;

@SuppressWarnings("serial")
public class QueryCondition implements Serializable {
    private boolean isDistinct;
    private List<Field> fields;
    private List<Order> orders;
    private List<Group> groups;
    private WhereCondition whereCondition;
    private WhereCondition havingCondition;

	/**
     * 
     * @return 是否重复
     */
    public boolean isDistinct() {
        return isDistinct;
    }

    public void setDistinct(boolean isDistinct) {
        this.isDistinct = isDistinct;
    }

    /**
     * 
     * @return 返回字段
     */
    public List<Field> getFields() {
        return fields;
    }

    public void setFields(List<Field> fields) {
        this.fields = fields;
    }

    /**
     * 
     * @return 排序方式
     */
    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }
    
    /**
     * 
     * @return 分组条件
     */
    public List<Group> getGroups() {
        return groups;
    }

    public void setGroups(List<Group> groups) {
        this.groups = groups;
    }

    /**
     * 
     * @return 查询条件
     */
    public WhereCondition getWhereCondition() {
        return whereCondition;
    }

    public void setWhereCondition(WhereCondition whereCondition) {
        this.whereCondition = whereCondition;
    }
    
    /**
     * 
     * @return 过滤条件
     */
    public WhereCondition getHavingCondition() {
        return havingCondition;
    }

    public void setHavingCondition(WhereCondition havingCondition) {
        this.havingCondition = havingCondition;
    }
	
    /**
     * @return 
     *         {isDistinct:,fields:[{name:名称,tablename:表名,databasename:数据库名}],orders
     *         :[{order:,field:{name:名称,tablename:表名,databasename:数据库名}},...],
     *         whereCondition
     *         :{logic:逻辑and、or,comparableAssignedFields:[{comparison
     *         :操作符,field:字段
     *         ,value:值},...],whereConditions:[{logic:,comparableAssignedFields
     *         :[],...},...]}
     */
    public String toString() {
        StringBuffer sb = new StringBuffer();
        sb.append("{isDistinct:" + isDistinct);
        sb.append(",fields:[");
        if (fields != null) {
            for (int i = 0; i < fields.size(); i++) {
                sb.append(fields.get(i).toString());
                if (i < fields.size() - 1) {
                    sb.append(",");
                }
            }
        }
        sb.append("],");
        sb.append(",orders:[");
        if (orders != null) {
            for (int i = 0; i < orders.size(); i++) {
                sb.append(orders.get(i).toString());
                if (i < orders.size() - 1) {
                    sb.append(",");
                }
            }
        }
        sb.append("],");
        sb.append(",whereCondition:");
        if (whereCondition != null) {
            sb.append(whereCondition.toString());
        }
        sb.append("}");
        return sb.toString();
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (this.getClass() != obj.getClass())
            return false;
        QueryCondition other = (QueryCondition) obj;
        if (other.isDistinct != isDistinct)
            return false;
        for (int i = 0; i < fields.size(); i++) {
            if (!other.fields.get(i).equals(fields.get(i)))
                return false;
        }
        for (int i = 0; i < orders.size(); i++) {
            if (!other.orders.get(i).equals(orders.get(i)))
                return false;
        }
        if (!other.whereCondition.equals(other.whereCondition))
            return false;
        return true;
    }

    @Override
    public int hashCode() {
        // TODO Auto-generated method stub
        int result = 1, prime = 31;
        result = result * prime + (int) ((isDistinct == true) ? 0 : 1);
        for (int i = 0; i < fields.size(); i++) {
            result = result * prime + fields.get(i).hashCode();
        }
        for (int i = 0; i < orders.size(); i++) {
            result = result * prime + orders.get(i).hashCode();
        }
        result = result * prime + whereCondition.hashCode();
        return result;
    }
}
