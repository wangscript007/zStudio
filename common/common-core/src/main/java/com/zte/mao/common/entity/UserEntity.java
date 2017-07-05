package com.zte.mao.common.entity;

public class UserEntity {
    private String tenant_id;
    private String login_name;
    private String password;
    private String mobile;
    private String email;
    private int role_id;
    private String gender;
    private String birth_date;
    private String picture;
    private String real_name;
    private String nick_name;
    private String tag;
    private int status;
    private String create_time;
    private String modify_time;
    private String signature;
    private String description;
    private String username;
    private String fullname;
    private boolean ispasswordchanged;

	/**
     * @return the tenant_id
     */
    public String getTenant_id() {
        return tenant_id;
    }

    /**
     * @param tenant_id
     *            the tenant_id to set
     */
    public void setTenant_id(String tenant_id) {
        this.tenant_id = tenant_id;
    }

    /**
     * @return the login_name
     */
    public String getLogin_name() {
    	if(login_name == null || login_name.equals("null")) {
    		return "";
    	}
        return login_name;
    }

    /**
     * @param login_name
     *            the login_name to set
     */
    public void setLogin_name(String login_name) {
        this.login_name = login_name;
    }

    /**
     * @return the password
     */
    public String getPassword() {
    	if(password  == null || password.equals("null")) {
    		return "";
    	}
        return password;
    }

    /**
     * @param password
     *            the password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * @return the mobile
     */
    public String getMobile() {
    	if(mobile  == null || mobile.equals("null")) {
    		return "";
    	}
        return mobile;
    }

    /**
     * @param mobile
     *            the mobile to set
     */
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    /**
     * @return the email
     */
    public String getEmail() {
    	if(email  == null || email.equals("null")) {
    		return "";
    	}
        return email;
    }

    /**
     * @param email
     *            the email to set
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return the role_id
     */
    public int getRole_id() {
        return role_id;
    }

    /**
     * @param role_id
     *            the role_id to set
     */
    public void setRole_id(int role_id) {
        this.role_id = role_id;
    }

    /**
     * @return the gender
     */
    public String getGender() {
    	if(gender  == null || gender.equals("null")) {
    		return "";
    	}
        return gender;
    }

    /**
     * @param gender
     *            the gender to set
     */
    public void setGender(String gender) {
        this.gender = gender;
    }

    /**
     * @return the birth_date
     */
    public String getBirth_date() {
    	if(birth_date  == null || birth_date.equals("null")) {
    		return "";
    	}
        return birth_date;
    }

    /**
     * @param birth_date
     *            the birth_date to set
     */
    public void setBirth_date(String birth_date) {
        this.birth_date = birth_date;
    }

    /**
     * @return the picture
     */
    public String getPicture() {
    	if(picture  == null || picture.equals("null")) {
    		return "";
    	}
        return picture;
    }

    /**
     * @param picture
     *            the picture to set
     */
    public void setPicture(String picture) {
        this.picture = picture;
    }

    /**
     * @return the real_name
     */
    public String getReal_name() {
    	if(real_name  == null || real_name.equals("null")) {
    		return "";
    	}
        return real_name;
    }

    /**
     * @param real_name
     *            the real_name to set
     */
    public void setReal_name(String real_name) {
        this.real_name = real_name;
    }

    /**
     * @return the nick_name
     */
    public String getNick_name() {
    	if(nick_name  == null || nick_name.equals("null")) {
    		return "";
    	}
        return nick_name;
    }

    /**
     * @param nick_name
     *            the nick_name to set
     */
    public void setNick_name(String nick_name) {
        this.nick_name = nick_name;
    }

    /**
     * @return the tag
     */
    public String getTag() {
    	if(tag  == null || tag.equals("null")) {
    		return "";
    	}
        return tag;
    }

    /**
     * @param tag
     *            the tag to set
     */
    public void setTag(String tag) {
        this.tag = tag;
    }

    /**
     * @return the status
     */
    public int getStatus() {
        return status;
    }

    /**
     * @param status
     *            the status to set
     */
    public void setStatus(int status) {
        this.status = status;
    }

    /**
     * @return the create_time
     */
    public String getCreate_time() {
    	if(create_time  == null || create_time.equals("null")) {
    		return "";
    	}
        return create_time;
    }

    /**
     * @param create_time
     *            the create_time to set
     */
    public void setCreate_time(String create_time) {
        this.create_time = create_time;
    }

    /**
     * @return the modify_time
     */
    public String getModify_time() {
    	if(modify_time  == null || modify_time.equals("null")) {
    		return "";
    	}
        return modify_time;
    }

    /**
     * @param modify_time
     *            the modify_time to set
     */
    public void setModify_time(String modify_time) {
        this.modify_time = modify_time;
    }

    /**
     * @return the signature
     */
    public String getSignature() {
    	if(signature  == null || signature.equals("null")) {
    		return "";
    	}
        return signature;
    }

    /**
     * @param signature
     *            the signature to set
     */
    public void setSignature(String signature) {
        this.signature = signature;
    }

    /**
     * @return the description
     */
    public String getDescription() {
    	if(description  == null || description.equals("null")) {
    		return "";
    	}
        return description;
    }

    /**
     * @param description
     *            the description to set
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * @return the username
     */
    public String getUsername() {
    	if(username  == null || username.equals("null")) {
    		return "";
    	}
        return username;
    }

    /**
     * @param username
     *            the username to set
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * @return the fullname
     */
    public String getFullname() {
    	if(fullname  == null || fullname.equals("null")) {
    		return "";
    	}
        return fullname;
    }

    /**
     * @param fullname
     *            the fullname to set
     */
    public void setFullname(String fullname) {
        this.fullname = fullname;
    }	

	public boolean isIspasswordchanged() {
		return ispasswordchanged;
	}

	public void setIspasswordchanged(boolean ispasswordchanged) {
		this.ispasswordchanged = ispasswordchanged;
	}

}
