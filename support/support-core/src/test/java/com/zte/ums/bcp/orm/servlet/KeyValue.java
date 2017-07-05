package com.zte.ums.bcp.orm.servlet;



/**
 * a=1 b>2....
 * @author 0089001364
 *
 */
public class KeyValue {
    private String key;
    private String value;
    private String compartion;

    public String getKey() {
        return key;
    }
    public void setKey(String key) {
        this.key = key;
    }
    public String getValue() {
        return value;
    }
    public void setValue(String value) {
        this.value = value;
    }
    public String getCompartion() {
        return compartion;
    }
    public void setCompartion(String compartion) {
        this.compartion = compartion;
    }

    public String getSql() {
        // TODO Auto-generated method stub
        return key + compartion + value;
    }
    
    
}
