package com.zte.iui.layoutit.common;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.MessageFormat;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import com.zte.iui.layoutit.bean.FormDesignerProject;


public class JaxbReadXml {
	
	/**
	 * 返回工程文件信息
	 * @return FormDesignerProject
	 * @throws Exception 解析xml出错抛出异常
	 */
	public static FormDesignerProject getFormDesignerProject() throws Exception {
		String configPath = JaxbReadXml.class.getClassLoader().getResource("/").getPath()	+ "form-designer-project.xml";
		return JaxbReadXml.readString(FormDesignerProject.class, configPath);
	}
	
	public static void writeXML(FormDesignerProject projectList) throws JAXBException{
		
		JAXBContext context = JAXBContext.newInstance(FormDesignerProject.class);  
        Marshaller marshaller = context.createMarshaller();  
        marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true); 
        String configPath = JaxbReadXml.class.getClassLoader().getResource("/").getPath()	+ "form-designer-project.xml";
        marshaller.marshal(projectList , new File(configPath));  
	}

	@SuppressWarnings("unchecked")
	public static <T> T readString(Class<T> clazz, String context)
			throws JAXBException {
		try {
			JAXBContext jc = JAXBContext.newInstance(clazz);
			Unmarshaller u = jc.createUnmarshaller();
			return (T) u.unmarshal(new File(context));
		} catch (JAXBException e) {
			// logger.trace(e);
			throw e;
		}
	}

	@SuppressWarnings("unchecked")
	public static <T> T readString(Class<T> clazz, File context)
			throws JAXBException {
		try {
			JAXBContext jc = JAXBContext.newInstance(clazz);
			Unmarshaller u = jc.createUnmarshaller();
			return (T) u.unmarshal(context);
		} catch (JAXBException e) {
			// logger.trace(e);
			throw e;
		}
	}

	@SuppressWarnings("unchecked")
	public static <T> T readConfig(Class<T> clazz, String config,
			Object... arguments) throws IOException, JAXBException {
		InputStream is = null;
		try {
			if (arguments.length > 0) {
				config = MessageFormat.format(config, arguments);
			}
			// logger.trace("read configFileName=" + config);
			JAXBContext jc = JAXBContext.newInstance(clazz);
			Unmarshaller u = jc.createUnmarshaller();
			is = new FileInputStream(config);
			return (T) u.unmarshal(is);
		} catch (IOException e) {
			// logger.trace(config, e);
			throw e;
		} catch (JAXBException e) {
			// logger.trace(config, e);
			throw e;
		} finally {
			if (is != null) {
				is.close();
			}
		}
	}

	@SuppressWarnings("unchecked")
	public static <T> T readConfigFromStream(Class<T> clazz,
			InputStream dataStream) throws JAXBException {
		try {
			JAXBContext jc = JAXBContext.newInstance(clazz);
			Unmarshaller u = jc.createUnmarshaller();
			return (T) u.unmarshal(dataStream);
		} catch (JAXBException e) {
			// logger.trace(e);
			throw e;
		}
	}
	
}