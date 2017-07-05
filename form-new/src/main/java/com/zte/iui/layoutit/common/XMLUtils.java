package com.zte.iui.layoutit.common;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public class XMLUtils {

	private String fileName;
	private Document doc;

	public XMLUtils(String fileName) throws FileNotFoundException,
			ParserConfigurationException, SAXException, IOException {
		this.fileName = fileName;
		initDocument();
	}

	private void initDocument() throws ParserConfigurationException,
			FileNotFoundException, SAXException, IOException {
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		DocumentBuilder dbd = dbf.newDocumentBuilder();
		doc = dbd.parse(new FileInputStream(this.fileName));
	}

	/**
	 * 获取节点列表
	 */
	public NodeList getNodeList(String path) throws XPathExpressionException {
		XPathFactory f = XPathFactory.newInstance();
		XPath mypath = f.newXPath();

		return (NodeList) mypath.evaluate(path, doc, XPathConstants.NODESET);
	}

	/**
	 * 获取路径下的第一个子节点
	 */
	public Node getNode(String path) throws XPathExpressionException {

		XPathFactory f = XPathFactory.newInstance();
		XPath mypath = f.newXPath();

		return (Node) mypath.evaluate(path, doc, XPathConstants.NODE);
	}

	/**
	 * 根据属性值获取节点信息
	 * */
	public Node getNodeByName(String path, String attrName, String attrValue)
			throws XPathExpressionException {
		Node result = null;
		NodeList nodes = this.getNodeList(path);
		for (int i = 0; i < nodes.getLength(); i++) {
			String currentAttrValue = nodes.item(i).getAttributes()
					.getNamedItem(attrName).getNodeValue();
			if (currentAttrValue == attrValue) {
				result = nodes.item(i);
			}
		}

		return result;
	}
}
