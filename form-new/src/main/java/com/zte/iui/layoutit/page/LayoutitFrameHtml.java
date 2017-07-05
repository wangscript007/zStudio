package com.zte.iui.layoutit.page;

import java.io.File;

import org.apache.log4j.Logger;

import com.zte.iui.layoutit.bean.ProjectInfo;
import com.zte.iui.layoutit.common.CommonConst;
import com.zte.iui.layoutit.common.FileOperation;

/**
 * layoutit框架html存取，根据文件名存取
 * 
 * @author dw
 * 
 */
public class LayoutitFrameHtml {

	private String fileName = null;
	private static Logger logger = Logger.getLogger(LayoutitFrameHtml.class.getName());

	public LayoutitFrameHtml(String fileName, ProjectInfo project) {
		// 创建目录
		File file = new File(CommonConst.FRAME_FILE_PATH);
		if (!file.exists()) {
			file.mkdirs();
		}
		String localPath = project.getLocalPath().replace(':', '@').replace('/', '$');
		if(fileName.indexOf(localPath) > -1) {
			this.fileName = fileName.substring(project.getLocalPath().length());
		}
		else {
			this.fileName = fileName;
		}
	}

	/**
	 * 获取框架html
	 * 
	 * @param fileName
	 * @return
	 */
	public String fetch() {
		File f = new File(CommonConst.FRAME_FILE_PATH + fileName);
		if(!f.exists() || !f.isFile()) {
			if(fileName.indexOf("&pname") > -1) {
				fileName = fileName.substring(0, fileName.indexOf("&pname"));
			}
		}
		
		FileOperation fileOperation = new FileOperation(
				CommonConst.FRAME_FILE_PATH, fileName);
		return fileOperation.readTxtFile();
	}

	/**
	 * 更新框架html
	 * 
	 * @param fileName
	 * @param content
	 * @throws Exception
	 */
	public void update(String content) throws Exception {
		FileOperation fileOperation = new FileOperation(
				CommonConst.FRAME_FILE_PATH, fileName);
		fileOperation.writeTxtFile(content);
	}

	/**
	 * 添加框架文件
	 * 
	 * @param fileName
	 * @throws Exception
	 */
	public boolean add() throws Exception {
		FileOperation fileOperation = new FileOperation(
				CommonConst.FRAME_FILE_PATH, fileName);
		return fileOperation.createFile();
	}
	/**
	 * 验证文件是否存在
	 * @return
	 * @throws Exception
	 */
	public boolean isExists() throws Exception{
		FileOperation fileOperation = new FileOperation(
				CommonConst.FRAME_FILE_PATH, fileName);
		return fileOperation.isFileExists();
	}

	/**
	 * 删除框架文件
	 * 
	 * @param fileName
	 * @throws Exception
	 */
	public void delete() throws Exception {	
		//<2015-9-19 文件删除，不备份。>
		logger.info("删除框架文件："+fileName);		
		
		FileOperation fileOperation = new FileOperation(
				CommonConst.FRAME_FILE_PATH, fileName);
		fileOperation.deleteFile();
	}

	/**
	 * 文件重命名 重命名时，将原文件先备份，然后再修改成新文件名。
	 * 
	 * @param newFileFullName
	 *            :重命名后的文件名
	 * */
	public boolean rename(String newFileFullName, ProjectInfo project) throws Exception {
		// 文件名为空时不重命名
		if (newFileFullName == null || newFileFullName.equals("")) {
			return false;
		}
		
		String localPath = project.getLocalPath().replace(':', '@').replace('/', '$');
		if(newFileFullName.indexOf(localPath) > -1) {
			newFileFullName = newFileFullName.substring(project.getLocalPath().length());
		}

		// 文件名相同时，不重命名。
		if (this.fileName.equalsIgnoreCase(newFileFullName)) {
			return true;
		}
		 		
		// 文件重命名 <2015-9-19 文件重命名，不重新备份。>		
		String sourceFileName = CommonConst.FRAME_FILE_PATH + this.fileName;
		String newFileName = CommonConst.FRAME_FILE_PATH + newFileFullName;
		logger.info("框架文件重命名：原文件名："+sourceFileName+";新文件名："+newFileName);
		
		FileOperation.copyFile(sourceFileName, newFileName);
		FileOperation operator = new FileOperation(CommonConst.FRAME_FILE_PATH, this.fileName);
		return operator.deleteFile();
	} 
	
	/**
	 * 备份设计文件
	 * @param targetDirPath
	 * @param filePrefix
	 * @throws Exception
	 */
	public void backupFrameFile(String targetDirPath,String filePrefix) throws Exception{
		// 文件重命名前，备份源文件
		File targetDir = new File(targetDirPath);
		if (!targetDir.exists()) {
			targetDir.mkdirs();
		}
		
		String sourceFileName = CommonConst.FRAME_FILE_PATH + File.separator+ this.fileName;
		String targetFileName = targetDirPath+File.separator+filePrefix+"##"+this.fileName;
		
		FileOperation.copyFile(sourceFileName, targetFileName);
	}
	/**
	 * 备份源文件
	 * @targetDir 备份的目标目录
	 * @return
	 */
	public void backupSourceFile(String targetDir)throws Exception{
		//创建备份目录
		File dir = new File(targetDir);
		if (!dir.exists()) {
			dir.mkdirs();
		}
		
		String htmlFilePath = this.fileName.replace("@", ":").replace("$","/");		
		if(htmlFilePath.contains("&")){
			htmlFilePath = htmlFilePath.substring(0,htmlFilePath.indexOf("&"));
		}		 
		String htmlFileName = htmlFilePath.substring(htmlFilePath.lastIndexOf("/")+1);
		
		//备份html文件
		File htmlFile = new File(htmlFilePath);
		if(htmlFile.exists()){		 
			FileOperation.copyFile(htmlFilePath, targetDir + File.separator +htmlFileName);
		}
		
		//备份JS文件
		String jsFilePath = htmlFilePath.replace(".html",".js");
		String jsFileName =htmlFileName.replace(".html",".js");
		File jsFile = new File(jsFilePath);
		if(jsFile.exists()){
			FileOperation.copyFile(jsFilePath, targetDir + File.separator +jsFileName);			
		}		
	}
	/**
	 * 在源文件的同名目录下，备份文件。	
	 * @param filePrefix
	 * @throws Exception
	 */
	public void backupSourceFileInSameDir(String filePrefix)throws Exception{
		//创建备份目录
		String htmlFilePath = this.fileName.replace("@", ":").replace("$","/");		
		if(htmlFilePath.contains("&")){
			htmlFilePath = htmlFilePath.substring(0,htmlFilePath.indexOf("&"));
		}		 
		String htmlFileName = htmlFilePath.substring(htmlFilePath.lastIndexOf("/")+1);
		String targetDir = htmlFilePath.substring(0,htmlFilePath.lastIndexOf("/"));
		
		//备份html文件
		File htmlFile = new File(htmlFilePath);
		if(htmlFile.exists()){		 
			FileOperation.copyFile(htmlFilePath, targetDir + File.separator +filePrefix+"##"+htmlFileName);
		}
		
		//备份JS文件
		String jsFilePath = htmlFilePath.replace(".html",".js");
		String jsFileName =htmlFileName.replace(".html",".js");
		File jsFile = new File(jsFilePath);
		if(jsFile.exists()){
			FileOperation.copyFile(jsFilePath, targetDir + File.separator+filePrefix+"##"+jsFileName);			
		}		
	}

}
