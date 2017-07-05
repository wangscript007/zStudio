package com.zte.mao.common.entity;

public class MenuEntity {
    private String key;
    private String name;
    private String parent_key;
    private String url;
    private int status;
    private int order;
    /**
     * @return the key
     */
    public String getKey() {
        return key;
    }
    /**
     * @param key the key to set
     */
    public void setKey(String key) {
        this.key = key;
    }
    /**
     * @return the name
     */
    public String getName() {
        return name;
    }
    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }
    /**
     * @return the parent_key
     */
    public String getParent_key() {
        return parent_key;
    }
    /**
     * @param parent_key the parent_key to set
     */
    public void setParent_key(String parent_key) {
        this.parent_key = parent_key;
    }
    /**
     * @return the url
     */
    public String getUrl() {
        return url;
    }
    /**
     * @param url the url to set
     */
    public void setUrl(String url) {
        this.url = url;
    }
    /**
     * @return the status
     */
    public int getStatus() {
        return status;
    }
    /**
     * @param status the status to set
     */
    public void setStatus(int status) {
        this.status = status;
    }
    /**
     * @return the order
     */
    public int getOrder() {
        return order;
    }
    /**
     * @param order the order to set
     */
    public void setOrder(int order) {
        this.order = order;
    }
}
