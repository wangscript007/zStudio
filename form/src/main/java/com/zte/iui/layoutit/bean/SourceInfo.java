package com.zte.iui.layoutit.bean;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;

@XmlAccessorType(XmlAccessType.FIELD)
public class SourceInfo {

	@XmlAttribute(name = "name")
	private String sourceName = null;
	
	@XmlAttribute(name = "displayName")
	private String displayName = null;

	@XmlAttribute(name = "ip")
	private String ip = null;

	@XmlAttribute(name = "port")
	private String port = null;

	@XmlAttribute(name = "uriPrefix")
	private String uriPrefix = null;
	
	@XmlAttribute(name = "type")
	private String type = null;
	
	@XmlAttribute(name = "filePath")
	private String filePath = null;

	public SourceInfo() {

	}

	/**
	 * @return the sourceName
	 */
	public String getSourceName() {
		return sourceName;
	}

	/**
	 * @param sourceName
	 *            the sourceName to set
	 */
	public void setSourceName(String sourceName) {
		this.sourceName = sourceName;
	}

	/**
	 * @return the ip
	 */
	public String getIp() {
		return ip;
	}

	/**
	 * @param ip
	 *            the ip to set
	 */
	public void setIp(String ip) {
		this.ip = ip;
	}

	/**
	 * @return the port
	 */
	public String getPort() {
		return port;
	}

	/**
	 * @param port
	 *            the port to set
	 */
	public void setPort(String port) {
		this.port = port;
	}

	/**
	 * @return the uriPrefix
	 */
	public String getUriPrefix() {
		return uriPrefix;
	}

	/**
	 * @param uriPrefix
	 *            the uriPrefix to set
	 */
	public void setUriPrefix(String uriPrefix) {
		this.uriPrefix = uriPrefix;
	}

	/**
	 * @return the displayName
	 */
	public String getDisplayName() {
		return displayName;
	}

	/**
	 * @param displayName the displayName to set
	 */
	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	/**
	 * @return the type
	 */
	public String getType() {
		return type;
	}

	/**
	 * @param type the type to set
	 */
	public void setType(String type) {
		this.type = type;
	}

	/**
	 * @return the filePath
	 */
	public String getFilePath() {
		return filePath;
	}

	/**
	 * @param filePath the filePath to set
	 */
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}	
}
