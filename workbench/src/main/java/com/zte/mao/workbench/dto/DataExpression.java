package com.zte.mao.workbench.dto;

public class DataExpression {
    private String field;
    private String value;
    
    
    public DataExpression() {
        super();
        // TODO Auto-generated constructor stub
    }

    public DataExpression(String field, String value) {
        super();
        this.field = field;
        this.value = value;
    }

    /**
     * 
     * @return 字段名
     */
    public String getField() {
        return field;
    }
    
    public void setField(String field) {
        this.field = field;
    }
    /**
     * 
     * @return 字段值
     */
    public String getValue() {
        return value;
    }
    
    public void setValue(String value) {
        this.value = value;
    }
    
    /**
     * @return {field:字段,value:值}
     */
    public String toString(){
        StringBuffer sb = new StringBuffer();
        sb.append("{field:"+field+",value:"+value+"}");
        return sb.toString();
    }
    
}
