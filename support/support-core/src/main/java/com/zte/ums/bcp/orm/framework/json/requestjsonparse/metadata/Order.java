package com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata;

public class Order extends Field {
    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    public static final int ORDER_DESC = 1;
    public static final int ORDER_ASC = 2;

    private int order;

    /**
     * 
     * @return 字段值
     */
    public Field getField() {
        return this;
    }

    public void setField(Field field) {
        super.setDatabaseName(field.getDatabaseName());
        super.setTableName(field.getTableName());
        super.setName(field.getName());
    }

    /**
     * 
     * @return 顺序，逆序
     */
    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }

    /**
     * @return {order:,field:{name:名称,tablename:表名,databasename:数据库名}}
     */
    public String toString() {
        StringBuffer sb = new StringBuffer();
        sb.append("{order:");
        sb.append(order);
        sb.append(",field:");
        sb.append(super.toString());
        sb.append("}");
        return sb.toString();
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = super.hashCode();
        result = prime * result + order;
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (!super.equals(obj))
            return false;
        if (getClass() != obj.getClass())
            return false;
        Order other = (Order) obj;
        if (order != other.order)
            return false;
        return true;
    }
}
