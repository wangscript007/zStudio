package com.zte.iui.layoutit.bean;

import java.io.File;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.regex.Matcher;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;

import org.springframework.util.StringUtils;

import com.zte.iui.layoutit.common.CommonUtility;
import com.zte.iui.layoutit.common.ConfigFileManage;

@XmlAccessorType(XmlAccessType.FIELD)
public class ProjectInfo {
    @XmlAttribute(name = "name")
    private String projectName = null;

    @XmlAttribute(name = "localPath")
    private String localPath = null;

    @XmlAttribute(name = "publishPath")
    private String publishPath = null;

    @XmlAttribute(name = "commonjsPath")
    private String commonjsPath = null;

    @XmlAttribute(name = "commoncssPath")
    private String commoncssPath = null;

    @XmlAttribute(name = "previewPort")
    private String previewPort = null;

    @XmlAttribute(name = "previewPrefix")
    private String previewPrefix = null;

    @XmlElement(name = "sourceItem")
    private List<SourceInfo> sourceList = null;

    @XmlAttribute(name = "isI18n")
    private String isI18n = null;
    /**
     * @return the projectName
     */
    public String getProjectName() {
        return projectName;
    }

    /**
     * @param projectName
     *            the projectName to set
     */
    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    /**
     * @return the localPath
     */
    public String getLocalPath() {
        if (this.localPath != null && !this.localPath.endsWith("/")) {
            this.localPath += "/";
        }
        localPath = CommonUtility.replaceTomcatPath(localPath);
        
        return localPath;
    }

    /**
     * @param localPath
     *            the localPath to set
     */
    public void setLocalPath(String localPath) {
        this.localPath = localPath;
    }

    /**
     * @return the sourceList
     */
    public List<SourceInfo> getSourceList() {
        return sourceList;
    }

    /**
     * @param sourceList
     *            the sourceList to set
     */
    public void setSourceList(List<SourceInfo> sourceList) {
        this.sourceList = sourceList;
    }

    /**
     * 获取工程数据源JS
     * */
    public String getProjectDataSourceJSCode() {
        if (this.getSourceList() == null) {
            return "";
        }

        StringBuffer js = new StringBuffer();
        for (SourceInfo source : this.getSourceList()) {            
            String prefix = this.getDataSourcePreffix(source,false);
            if(prefix.indexOf("$base_url") > -1){
                String baseUrl = ConfigFileManage.instance.getProperty("base_url");
                js.append("var $base_url = \"" + baseUrl + "\";\n"); 
            }

            js.append("var " + source.getSourceName() + " = \""  + prefix
                    + "\";\n");
        }
        js.append("var isI18n = \"" + this.getIsI18n()+"\";\n");
        return js.toString();
    }
    
    /**
     * 获取数据源前缀
     * @param source
     * @return
     */
    private String getDataSourcePreffix(SourceInfo source,boolean replace){
        String prefix = this.getFormatedPath(source.getUriPrefix());
        if (prefix != null && prefix.length() > 0) {
            if (prefix.toUpperCase().indexOf("$BASE_URL") > -1) {
                String baseUrl = ConfigFileManage.instance
                        .getProperty("base_url");

                String suffix = "";
                if (prefix.length() > 9) {
                    suffix = this.getFormatedPath(prefix.substring(prefix
                            .toUpperCase().indexOf("$BASE_URL") + 9));
                }

                if (baseUrl != null && !baseUrl.isEmpty()) {
                    if(replace){
                        prefix = "/" +baseUrl +"/" + suffix + "/";  
                    }else{
                        prefix = "/\"+$base_url+\"/" + suffix + "/";
                    }
                } else {
                    prefix = "/" + suffix + "/";
                }
            } else {
                prefix = "/" + prefix + "/";
            }
        }

        return prefix;
    }
    
    /**
     * 路径格式化 
     * @param path
     * @return
     */
    private String getFormatedPath(String path) {
        if (path != null && path.length() > 0) {
            if (path.startsWith("/") && path.length() > 1) {
                path = path.substring(1);
            }

            if (path.endsWith("/") && path.length() > 0) {
                path = path.substring(0, path.length() - 1);
            }
        }else{
        	path = "";
        }

        return path;
    }
    
    /**
     * 格式化数据源
     * @return
     */
    public List<SourceInfo> getFormatedDataSource(String type){
		List<SourceInfo> result = new ArrayList<SourceInfo>();
		List<SourceInfo> sourceList = this.getSourceList();
		for (SourceInfo source : sourceList) {
			if (source.getType().equalsIgnoreCase(type)) {
				String prefix = this.getDataSourcePreffix(source, true);
				source.setUriPrefix(prefix);

				result.add(source);
			}
		}

		return result;
    }
    

    /**
     * 验证数据源ID是否存在、ID 是否在工程内唯一、
     * */
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public boolean validateDataSource() {
        boolean ret = true;
        HashSet ds = new HashSet();
        for (SourceInfo item : this.sourceList) {
            String sourceName = item.getSourceName();

            if (sourceName == null || sourceName.isEmpty()) {
                ret = false;
                break;
            }

            if (ds.contains(sourceName)) {
                ret = false;
                break;
            }

            ds.add(sourceName);
        }

        return ret;
    }

    /**
     * @return the publishPath
     */
    public String getPublishPath() {
        if (this.publishPath != null && !this.publishPath.endsWith("/")) {
            this.publishPath += "/";
        }
        publishPath = CommonUtility.replaceTomcatPath(publishPath);
        
        return this.publishPath;
    }

    /**
     * @param publishPath
     *            the publishPath to set
     */
    public void setPublishPath(String publishPath) {
        this.publishPath = publishPath;
    }

    /**
     * @return the previewPort
     */
    public String getPreviewPort() {
        return previewPort;
    }

    /**
     * @param previewPort
     *            the previewPort to set
     */
    public void setPreviewPort(String previewPort) {
        this.previewPort = previewPort;
    }

    /**
     * @return the previewPrefix
     */
    public String getPreviewPrefix() {
        return previewPrefix;
    }

    /**
     * @param previewPrefix
     *            the previewPrefix to set
     */
    public void setPreviewPrefix(String previewPrefix) {
        this.previewPrefix = previewPrefix;
    }

    /**
     * @return the commonjsPath
     */
    public String getCommonjsPath() {
        if (commonjsPath == null) {
            return "";
        }
        return commonjsPath;
    }

    /**
     * @param commonjsPath
     *            the commonjsPath to set
     */
    public void setCommonjsPath(String commonjsPath) {
        this.commonjsPath = commonjsPath;
    }

    /**
     * @return the commoncssPath
     */
    public String getCommoncssPath() {
        if (commoncssPath == null) {
            return "";
        }
        return commoncssPath;
    }

    /**
     * @param commoncssPath
     *            the commoncssPath to set
     */
    public void setCommoncssPath(String commoncssPath) {
        this.commoncssPath = commoncssPath;
    }

	public String getIsI18n() {
		return isI18n;
	}

	public void setIsI18n(String isI18n) {
		this.isI18n = isI18n;
	}

}
