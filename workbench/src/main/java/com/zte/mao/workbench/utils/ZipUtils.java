package com.zte.mao.workbench.utils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.log4j.Logger;

import com.zte.mao.common.util.FileUtil;

public class ZipUtils {

	private static Logger logger = Logger.getLogger(ZipUtils.class.getName());

	private ZipUtils() {
	};

	/**
	 * 创建ZIP文件
	 * 
	 * @param sourcePath
	 *            文件或文件夹路径
	 * @param zipPath
	 *            生成的zip文件存在路径（包括文件名）
	 * @throws IOException 
	 * 
	 */
	public static void createZip(String sourcePath, String zipPath) throws IOException {
		FileOutputStream fos = null;
		ZipOutputStream zos = null;
		try {
			FileUtil.createFileOrMultistageDirectoryOfFile(zipPath);
			fos = new FileOutputStream(zipPath);
			zos = new ZipOutputStream(fos);
			writeZip(new File(sourcePath), "", zos);
		} catch (FileNotFoundException e) {
			logger.error("创建ZIP文件失败", e);
			throw e;
		} finally {
			try {
				if (zos != null) {
					zos.close();
				}
			} catch (IOException e) {
				logger.error("创建ZIP文件失败", e);
				throw e;
			}

		}
	}

	private static void writeZip(File file, String parentPath, ZipOutputStream zos) throws IOException {
		if (file.exists()) {
			if (file.isDirectory()) {
				// 处理文件夹
				parentPath += file.getName() + File.separator;
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
					logger.error("创建ZIP文件失败", e);
					throw e;
				} catch (IOException e) {
					logger.error("创建ZIP文件失败", e);
					throw e;
				} finally {
					try {
						if (dis != null) {
							dis.close();
						}
					} catch (IOException e) {
						logger.error("创建ZIP文件失败", e);
						throw e;
					}
				}
			}
		}
	}

	public static void fileToZip(String sourceFilePath,String zipFilePath) throws IOException{  
		File sourceFile = new File(sourceFilePath);  
		if(sourceFile.exists()){ 
			ZipOutputStream zos = null;  
			try {  
				File zipFile = new File(zipFilePath);  
				if(zipFile.exists() == false ){  
					File[] sourceFiles = sourceFile.listFiles();  
					if(null != sourceFiles && sourceFiles.length >= 1){  
						zos = new ZipOutputStream(new BufferedOutputStream(new FileOutputStream(zipFile)));  
						byte[] bufs = new byte[1024*10];  
						for(int i=0;i<sourceFiles.length;i++){  
							ZipEntry zipEntry = new ZipEntry(sourceFiles[i].getName());  
							zos.putNextEntry(zipEntry);  
							BufferedInputStream bis = new BufferedInputStream(new FileInputStream(sourceFiles[i]), 1024*10);  
							int read = 0;  
							while((read=bis.read(bufs, 0, 1024*10)) != -1){  
								zos.write(bufs,0,read);
							}  
							if (bis != null) {
								bis.close();
							}
						}  
					}  
				}  
			} catch (Exception e) {  
				logger.error("创建ZIP文件失败", e);
				throw e;  
			} finally{  
				try { 
					if(null != zos) zos.close();
				} catch (IOException e) {  
					logger.error("创建ZIP文件失败", e);
					throw new RuntimeException(e);  
				}  
			}  
		}  
	}  
}
