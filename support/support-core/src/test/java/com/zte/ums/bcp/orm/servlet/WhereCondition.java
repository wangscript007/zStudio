package com.zte.ums.bcp.orm.servlet;


@SuppressWarnings("serial")
public class WhereCondition implements java.io.Serializable {
    private String logic;
    private KeyValue[] keyValues;
    private WhereCondition whereCondition;

    public void setLogic(String logic) {
        this.logic = logic;
    }

    public String getLogic() {
        return logic;
    }

    public void setKeyValues(KeyValue[] keyValues) {
        this.keyValues = keyValues;
    }

    public KeyValue[] getKeyValues() {
        return keyValues;
    }

    public String getSql() {
        if (this.whereCondition != null && this.whereCondition.getSql().length() > 0) {
            
            return keyValues[0].getSql() + " " + logic + " (" + whereCondition.getSql()+")";
            
        } else {
            return keyValues[0].getSql() + " " + logic + " " + keyValues[1].getSql();
        }
    }

    public void setWhereConditon(WhereCondition whereCondition) {
        this.whereCondition = whereCondition;
    }
}
