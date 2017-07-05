package com.zte.iui.layoutit.export;

import java.io.BufferedInputStream;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.iui.layoutit.bean.ProjectInfo;
import com.zte.iui.layoutit.cmd.ExeCmdManager;
import com.zte.iui.layoutit.common.CommonConst;
import com.zte.iui.layoutit.common.CommonUtility;
import com.zte.iui.layoutit.common.FileOperation;
import com.zte.iui.layoutit.page.LayoutitProject;
import org.apache.log4j.Logger;

@Service
public class ExportService {
	private static Logger logger = Logger.getLogger(ExportService.class.getName());
	@Resource
	private LayoutitProject layoutitProject;
	
	
	public String export(String name, 
			boolean isFrameFile,
			boolean isWar,
			boolean isOrmFile,
			boolean isDockerImages) throws Exception {
		String designerPath = CommonUtility.getDesignerPath();
		
		File zipFile = new File(designerPath + "/export");
		if(!zipFile.exists()) {
			zipFile.mkdirs();
		}
		//清空导出目录
		delAllFile(designerPath + "/export");
		
		//创建temp目录
		File temp = new File(designerPath + "/temp");
		temp.mkdir();
		
		ProjectInfo project = layoutitProject.getProject("default");
		String publishPath = project.getPublishPath();
		
		//拷贝readme文件
		FileOperation.copyFile(new File(designerPath + "/export-redme.txt"), new File(designerPath + "/temp/export-redme.txt")); 
		
		if(isFrameFile) {
			FileOperation.copyDirectiory(CommonConst.FRAME_FILE_PATH, designerPath + "/temp/frame");
		}
		
		if(isWar) {
			FileOperation.copyDirectiory(publishPath, designerPath + "/temp/" + name);
			if(isOrmFile) {
				String path = new File(designerPath).getParentFile().getPath();
				if(new File(path + "/dataservice").exists()) {
					FileOperation.copyDirectiory(path + "/dataservice/WEB-INF", designerPath + "/temp/" + name + "/WEB-INF");
				}
			}
		}
		if(isDockerImages) {
			FileOperation.copyFile(new File(designerPath + "/Dockerfile"), new File(designerPath + "/temp/Dockerfile"));
			FileOperation.copyFile(new File(designerPath + "/setenv.sh"), new File(designerPath + "/temp/setenv.sh"));
			FileOperation.copyDirectiory(designerPath + "/temp/" + name, designerPath + "/temp/files/"+name);
			String path = designerPath + "/temp/";
			String cmd = "cd "+path+" && docker build -t 10.74.216.3:5000/"+name+" .";
			ExeCmdManager cmdManager = new ExeCmdManager(new String[] { "/bin/sh", "-c", cmd }, true);
			cmdManager.exeCmd();
			String[] errorStreamResults = cmdManager.getErrorStreamResults();
	        if (errorStreamResults != null && errorStreamResults.length > 0) {
	            for (int i = 0; i < errorStreamResults.length; i++) {
	                logger.error(errorStreamResults[i]);
	            }
	            throw new Exception("镜像生成失败。");
	        }
		}
		
		//copy form-designer-project.xml 文件
		FileOperation.copyFile(new File(designerPath + "/WEB-INF/classes/form-designer-project.xml"), new File(designerPath + "/temp/form-designer-project.xml"));
		batFile(project, name, designerPath + "/temp/");
		String zipPath = "export/" + name + "_" + System.currentTimeMillis() + ".zip";
		createZip(designerPath + "/temp/", designerPath + "/" + zipPath);
		delFolder(temp.getPath());
		return zipPath;
	}
	
	private void batFile(ProjectInfo project, String name, String tempPath) throws Exception {
		StringBuilder builder = new StringBuilder(1000);
		builder.append("@echo off\n\n").append("set currentDir=%~dp0\n\n");
		String frameDir = CommonConst.FRAME_FILE_PATH.replaceAll("/", "\\\\");
		if(frameDir.endsWith("\\")) {
			frameDir = frameDir.substring(0, frameDir.length()-1);
		}
		builder.append("set framworkDir=").append(frameDir).append("\n");
		String localDir = project.getLocalPath().replaceAll("/", "\\\\");
		if(localDir.endsWith("\\")) {
			localDir = localDir.substring(0, localDir.length()-1);
		}
		builder.append("set localDir=").append(localDir).append("\n\n");
		builder.append("set /p designerDir=please input tomcat bin path of designer:").append("\n\n");
		builder.append("echo copy designer file to tomcat begin.\n");
		builder.append("xcopy /Y /E /Q %currentDir%frame %designerDir%\\%framworkDir%\\").append("\n");
		builder.append("echo copy designer file to tomcat end.\n\n");
		
		builder.append("echo copy page file to tomcat begin.\n");
		builder.append("xcopy /Y /E /Q %currentDir%"+name+" %designerDir%\\%localDir%\\").append("\n");
		builder.append("echo copy page file to tomcat end.\n\n");
		
		builder.append("echo form-designer-project.xml file to tomcat begin.\n");
		builder.append("xcopy /Y /Q %currentDir%form-designer-project.xml %designerDir%\\..\\webapps\\designer\\WEB-INF\\classes").append("\n");
		builder.append("echo form-designer-project.xml file to tomcat end.\n\n");
		builder.append("echo designer files resotre success.\n");
		builder.append("pause \n");
		
		FileOperation fileOperation = new FileOperation(tempPath, "run.bat");
		fileOperation.createFile();
		fileOperation.writeTxtFile(builder.toString());
	}

	private boolean delAllFile(String path) {
		boolean flag = false;
		File file = new File(path);
		if (!file.exists()) {
			return flag;
		}
		if (!file.isDirectory()) {
			return flag;
		}
		String[] tempList = file.list();
		File temp = null;
		for (int i = 0; i < tempList.length; i++) {
			if (path.endsWith(File.separator)) {
				temp = new File(path + tempList[i]);
			} else {
				temp = new File(path + File.separator + tempList[i]);
			}
			if (temp.isFile()) {
				temp.delete();
			}
			if (temp.isDirectory()) {
				delAllFile(path + "/" + tempList[i]);// 先删除文件夹里面的文件
				delFolder(path + "/" + tempList[i]);// 再删除空文件夹
				flag = true;
			}
		}
		return flag;
	}

	private void delFolder(String folderPath) {
		try {
			delAllFile(folderPath); // 删除完里面所有内容
			String filePath = folderPath;
			filePath = filePath.toString();
			java.io.File myFilePath = new java.io.File(filePath);
			myFilePath.delete(); // 删除空文件夹
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
	}
	
	/**
     * 创建ZIP文件
     * @param sourcePath 文件或文件夹路径
     * @param zipPath 生成的zip文件存在路径（包括文件名）
     */
    private void createZip(String sourcePath, String zipPath) {
        FileOutputStream fos = null;
        ZipOutputStream zos = null;
        try {
            fos = new FileOutputStream(zipPath);
            zos = new ZipOutputStream(fos);
            File sourceFile = new File(sourcePath);
            File[] files = sourceFile.listFiles();
            if(files != null) {
	            for(File item : files) {
	            	writeZip(item, "", zos);
	            }
            }
        } catch (FileNotFoundException e) {
        	logger.error(e.getMessage(), e);
        } finally {
            try {
                if (zos != null) {
                    zos.close();
                }
            } catch (IOException e) {
            }
 
        }
    }
     
	private void writeZip(File file, String parentPath,
			ZipOutputStream zos) {
		if (file.exists()) {
			if (file.isDirectory()) {// 处理文件夹
				parentPath += file.getName() + "/";
				File[] files = file.listFiles();
				for (File f : files) {
					writeZip(f, parentPath, zos);
				}
			} else {
				FileInputStream fis = null;
				DataInputStream dis = null;
				try {
					fis = new FileInputStream(file);
					dis = new DataInputStream(new BufferedInputStream(fis));
					ZipEntry ze = new ZipEntry(parentPath + file.getName());
					zos.putNextEntry(ze);
					byte[] content = new byte[1024];
					int len;
					while ((len = fis.read(content)) != -1) {
						zos.write(content, 0, len);
						zos.flush();
					}

				} catch (FileNotFoundException e) {
					logger.error(e.getMessage(), e);
				} catch (IOException e) {
					logger.error(e.getMessage(), e);
				} finally {
					try {
						if (dis != null) {
							dis.close();
						}
					} catch (IOException e) {
					}
				}
			}
		}
	}
}
