package com.zte.mao.common.base;

public class OrmQueryOrder {

    public static final String ORDER_ASC = "ASC";
    @SuppressWarnings("unused")
    public static final String ORDER_DESC = "DESC";

    private String field;
    private String order = ORDER_ASC;

    public OrmQueryOrder() {
        super();
        // TODO Auto-generated constructor stub
    }

    public OrmQueryOrder(String field, String order) {
        super();
        this.field = field;
        this.order = order;
    }

    public String getField() {
        return field;
    }

    public OrmQueryOrder setField(String field) {
        this.field = field;
        return this;
    }

    public String getOrder() {
        return order;
    }

    public OrmQueryOrder setOrder(String order) {
        this.order = order;
        return this;
    }

}
