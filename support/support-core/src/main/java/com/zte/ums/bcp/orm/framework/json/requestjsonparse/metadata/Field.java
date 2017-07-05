package com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata;

import java.io.Serializable;

import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;

@SuppressWarnings("serial")
public class Field implements Serializable, IFunctionParameter {
	private String name;
	private String tableName;
	private String databaseName;

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	public String getDatabaseName() {
		return databaseName;
	}
	public void setDatabaseName(String databaseName) {
		this.databaseName = databaseName;
	}
	
	/**
	 * @return {name:名称,tablename:表名,databasename:数据库名}
	 */
	public String toString(){
		StringBuffer sb = new StringBuffer();
		sb.append("{name:");
		sb.append(name);
		sb.append(",tableName:");
		sb.append(tableName);
		sb.append(",databaseName:");
		sb.append(databaseName);
		sb.append("}");
		return sb.toString();
	}
	
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (this.getClass() != obj.getClass())
            return false;
        Field other = (Field) obj;
        if (!StringUtils.equals(other.name, name))
            return false;
        if (!StringUtils.equals(other.tableName, tableName))
            return false;
        if (!StringUtils.equals(other.databaseName, databaseName))
            return false;
        return true;
    }

	@Override
	public int hashCode() {
		return ObjectUtils.hashCodeMulti(name, tableName, databaseName);
	}

	@Override
    public String getValue() {
        return this.name;
    }

	@Override
    public int getType() {
        return IFunctionParameter.ENUM_TYPE_FIELD;
    }
}
