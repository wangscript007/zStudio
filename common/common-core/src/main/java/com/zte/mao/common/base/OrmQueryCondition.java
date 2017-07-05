package com.zte.mao.common.base;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

public class OrmQueryCondition {
    public final static String COMPARE_EQUALS = "=";
    public final static String COMPARE_GREATER = ">";
    public final static String COMPARE_GREATER_EQUALS = ">=";
    public final static String COMPARE_LESS = "<";
    public final static String COMPARE_LESS_EQUALS = "<=";
    public final static String COMPARE_LIKE = "LIKE";
    public final static String COMPARE_IN = "IN";

    private String cname;
    private Set<String> valueList;
    private String compare = COMPARE_EQUALS;

    public OrmQueryCondition() {
        this("", COMPARE_EQUALS, "");
    }

    public OrmQueryCondition(String cname, String compare, String value) {
        valueList = new HashSet<String>();
        this.cname = cname;
        this.compare = compare;
        if (StringUtils.isNotBlank(value)) {
            valueList.add(value);
        }
    }

    public OrmQueryCondition(String cname, String compare, Collection<String> collection) {
        valueList = new HashSet<String>();
        this.cname = cname;
        this.compare = compare;
        if (CollectionUtils.isNotEmpty(collection)) {
            valueList.addAll(collection);
        }
    }

    /**
     * @return the cname
     */
    public String getCname() {
        return cname;
    }

    /**
     * @param cname
     *            the cname to set
     */
    public OrmQueryCondition setCname(String cname) {
        this.cname = cname;
        return this;
    }

    /**
     * @return the value
     */
    public Object getValue() {
        if (COMPARE_IN.equalsIgnoreCase(this.compare)) {
            return this.valueList;
        } else if (CollectionUtils.isEmpty(this.valueList)) {
            return "";
        } else {
            return this.valueList.toArray(new String[0])[0];
        }
    }

    /**
     * @param value
     *            the value to set
     */
    public OrmQueryCondition setValue(String value) {
        valueList.add(value);
        return this;
    }

    /**
     * @param value
     *            the value to set
     */
    public OrmQueryCondition setValues(Collection<String> values) {
        valueList.addAll(values);
        return this;
    }

    /**
     * @return the compare
     */
    public String getCompare() {
        return compare;
    }

    /**
     * @param compare
     *            the compare to set
     */
    public OrmQueryCondition setCompare(String compare) {
        this.compare = compare;
        return this;
    }

    public static OrmQueryCondition generatorCondition() {
        return new OrmQueryCondition();
    }

    public static List<OrmQueryCondition> getConditions() {
        return new ArrayList<OrmQueryCondition>();
    }
}
