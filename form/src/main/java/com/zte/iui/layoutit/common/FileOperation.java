package com.zte.iui.layoutit.common;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.springframework.util.StringUtils;

import com.zte.iui.layoutit.bean.CommonFile;
import com.zte.iui.layoutit.bean.FileInfo;
import com.zte.iui.layoutit.bean.FrameFileInfo;
import com.zte.iui.layoutit.bean.ProjectInfo;
import org.apache.log4j.Logger;

/**
 * 文本文件操作
 * 
 * @author dw
 * 
 */
public class FileOperation {
	
	private static Logger logger = Logger.getLogger(FileOperation.class.getName());
	
	private String directoryPath = "";
	private File file = null;
	private SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	

	/**
	 * 目录+文件操作的构造函数
	 * 
	 * @param directoryPath
	 *            目录路径，路径以/结尾
	 * @param fileName
	 *            文件名
	 */
	public FileOperation(String directoryPath, String fileName) {
		this.directoryPath = directoryPath;
		this.createDir(this.directoryPath);
		file = new File(directoryPath + fileName);
	}

	public void createDir(String path) {
		File dir = new File(path);
		if (!dir.exists())
			dir.mkdirs();
	}
	
	/**
	 * 获取path下的所有文件信息
	 * @param path
	 * @param flag
	 * @return {@link CommonFile}
	 */
	public List<CommonFile>  getCommonFiles(String path,boolean flag){
		List<CommonFile> commonFiles = new ArrayList<CommonFile>();
		fetchFilesInfo(commonFiles,path,flag);
		return commonFiles;
	}
	
	/**
	 * 返回文件的信息，包括路径，文件名，最后修改时间，文件文本内容
	 * @param filePath
	 * @param fileName
	 * @return {@link CommonFile}
	 */
	public CommonFile getCommonFile(String filePath,String fileName){
		File file = new File(filePath+fileName);
		CommonFile commonFile = null;
		if(file.exists()&&file.isFile()){
			FileOperation fileOperation = new FileOperation(filePath, fileName);
			commonFile = new CommonFile(fileName, filePath, format.format(new Date(file.lastModified())));
			commonFile.setContent(fileOperation.readTxtFile());
		}
		
		return commonFile;
	}

	/**
	 * 目录操作的构造函数
	 * 
	 * @param fileURL
	 *            目录URL <b>非文件URL</b>
	 * @throws Exception
	 *             URL转换URI异常或者获取文件路径异常
	 */
	public FileOperation(String directoryPath) throws Exception {
		file = new File(directoryPath);
		this.directoryPath = directoryPath;
	}

	/**
	 * 获取指定目录下的文件名列表
	 * 
	 * @return
	 */
	public List<FileInfo> fetchFilesInfo() {
		String[] filelist = file.list();
		FrameFileInfo fileInfo = new FrameFileInfo();
		int count = 0;
		List<FileInfo> infos = new ArrayList<FileInfo>();
		for (int i = 0; i < filelist.length; i++) {
			File readfile = new File(directoryPath + "/" + filelist[i]);
			if (!readfile.isDirectory()) {
				String path = readfile.getParent();
				String fileName = readfile.getName();
				String modifyTime = format.format(new Date(readfile
						.lastModified()));

				FileInfo fileinfo = new FileInfo(fileName, path, modifyTime);
				fileinfo.setFullInfo(readfile.getName());
				fileInfo.addRows(fileinfo);
				infos.add(fileinfo);
				count++;
			}
		}
		fileInfo.setTotal(count);
		return infos;
	}
	
	/**
	 * 	 * 获取指定目录下的所有文件
	 * @param commonFiles 文件集合
	 * @param path 文件根目录
	 * @param flag 是否提取子目录的文件
	 */
	public void fetchFilesInfo(List<CommonFile> commonFiles,String path,boolean flag) {
		File dir = new File(path); 
        File[] files = dir.listFiles(); 
        
        if (files == null) 
            return; 
        for (int i = 0; i < files.length; i++) { 
        	
        	
            if (files[i].isDirectory()) { 
            	if(flag){
            		fetchFilesInfo(commonFiles,files[i].getAbsolutePath(),flag); 
            	}
                
            } else { 
            	
            	String filePath = files[i].getParent();
				String fileName = files[i].getName();
				String modifyTime = format.format(new Date(files[i].lastModified()));
            	CommonFile fileInfo = new CommonFile(fileName,filePath,modifyTime);
            	commonFiles.add(fileInfo);                    
            } 
        } 
	}
	/**
	 * 获取指定目录下的文件名列表
	 * 
	 * @return
	 */
	public List<FileInfo> fetchFrameFileInfo(ProjectInfo projectInfo) {
		String[] filelist = file.list();
		if(filelist == null) {
			filelist = new String[0];
		}
		FrameFileInfo fileInfo = new FrameFileInfo();
		int count = 0;
		List<FileInfo> infos = new ArrayList<FileInfo>();
		for (int i = 0; i < filelist.length; i++) {
			File readfile = new File(directoryPath + "/" + filelist[i]);
			if (!readfile.isDirectory()) {
				String name = readfile.getName();
				name = name.replace('@', ':').replace('$', '/');
				int lastIndexOf = name.lastIndexOf('/');
				//文件名不带localpath
				String path = "";
				String fileName = name;
				if(lastIndexOf == -1) {
					
				}
				else {
					path = name.substring(0, lastIndexOf);
					fileName = name.substring(lastIndexOf + 1);
				}
				if(name.indexOf("version=") > -1) {
					path = projectInfo.getLocalPath() + path; 
				}
				String modifyTime = format.format(new Date(readfile
						.lastModified()));
				
				int indexOfPname = fileName.indexOf("&pname=");
				String pname = "default";
				if (indexOfPname > -1) {
					pname = fileName.substring(indexOfPname + 7);
					if (pname.indexOf("&") > -1) {
						pname = pname.substring(0, pname.indexOf("&"));
					}
					fileName = fileName.substring(0, indexOfPname);
				}
				
				//组件名称
				String cname = "";
				int indexOfCname = name.indexOf("&cname=");
				if(indexOfCname > -1){
					cname = name.substring(indexOfCname + 7);
					if(cname.indexOf("&") > -1){
						cname = cname.substring(0, cname.indexOf("&"));
					}
				}
				
				FileInfo fileinfo = new FileInfo(fileName, path, modifyTime);
				fileinfo.setFullInfo(readfile.getName());
				fileinfo.setProjectName(pname);
				fileinfo.setComponentName(cname);
				fileinfo.setFileType(FileInfo.FileType.PAGE.toString());
				if(!StringUtils.isEmpty(cname)){
					fileinfo.setFileType(FileInfo.FileType.COMPONENT.toString());
				}
				
				fileInfo.addRows(fileinfo);
				infos.add(fileinfo);
				count++;
			}
		}
		fileInfo.setTotal(count);
		Collections.sort(infos);
		return infos;
	}

	/**
	 * 创建文件
	 * 
	 * @param fileName
	 * @return
	 */
	public boolean createFile() {
		boolean flag = false;
		try {
			if (!file.exists()) {
				file.createNewFile();
				flag = true;
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
		return flag;
	}
	/**
	 * 判断文件是否存在
	 * @return
	 */
	public boolean isFileExists() throws Exception{
		return file.exists();
	}
	/**
	 * 删除文件
	 * 
	 * @param fileName
	 * @return
	 */
	public boolean deleteFile() {
		boolean flag = false;
		try {
			if (file.exists()) {
				file.delete();				
				flag = true;
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
		return flag;
	}
	/**
	 * 文件重命名
	 * */
	public boolean renameFile(String newFileFullName) {
		boolean flag = false;
		try {
			if (file.exists()) {
				File dest = new File(newFileFullName);
				if(!dest.exists()){
					dest.createNewFile();
				}
				flag = file.renameTo(dest);
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
		return flag;
	}


	/**
	 * 读TXT文件内容
	 * 
	 * @param fileName
	 * @return
	 */
	public String readTxtFile() {
		String result = "";
		if (!file.exists()) {
			return result;
		}
		BufferedReader bufferedReader = null;
		try {
			bufferedReader = new BufferedReader(new InputStreamReader(
					new FileInputStream(file), "UTF-8"));
			String read = null;
			while ((read = bufferedReader.readLine()) != null) {
				result = result + read + "\n";
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		} finally {
			if (bufferedReader != null) {
				try {
					bufferedReader.close();
				} catch (IOException e) {
				}
			}
		}
		return result;
	}
	
	

	/**
	 * 写入文件
	 * 
	 * @param content
	 * @return
	 * @throws Exception
	 */
	public boolean writeTxtFile(String content) throws Exception {
		if (content == null) {
			content = "";
		}
		boolean flag = false;
		createFile();
		FileOutputStream outputStream = null;
		try {
			outputStream = new FileOutputStream(file, false);
			outputStream.write(content.getBytes("UTF-8"));
			outputStream.close();
			flag = true;
		} finally {
			if (outputStream != null) {
				try {
					outputStream.close();
				} catch (IOException e) {
				}
			}
		}
		return flag;
	}

	/**
	 * 文件已存在，追加文件内容，文件不存在则新建文件再添加文件内容
	 * 
	 * @param content
	 */
	public void contentToTxt(String content) {
		String str = new String(); // 原有txt内容
		String s1 = new String();// 内容更新
		try {
			File f = new File(directoryPath);
			if (f.exists()) {
				System.out.print("文件存在");
			} else {
				System.out.print("文件不存在");
				f.createNewFile();// 不存在则创建
			}
			BufferedReader input = new BufferedReader(new FileReader(f));
			while ((str = input.readLine()) != null) {
				s1 += str + "\n";
			}
			System.out.println(s1);
			input.close();
			s1 += content;
			BufferedWriter output = new BufferedWriter(new FileWriter(f));
			output.write(s1);
			output.close();
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
	}
	/**
	 * 通过文件名拷贝文件
	 * @param sourceFileName 源文件
	 * @param targetFileName 目标文件
	 * */
	public static void copyFile(String sourceFileName, String targetFileName)throws IOException{
		File sourceFile = new File(sourceFileName);
		if(!sourceFile.exists()){
			return ;
		}
		File targetFile = new File(targetFileName);
		if(!targetFile.exists()){
			targetFile.createNewFile();
		}
		copyFile(sourceFile,targetFile);
	}
	
	/**
	 * 复制文件
	 * @param sourceFile 源文件
	 * @param targetFile 目标文件
	 * */	 
    public static void copyFile(File sourceFile, File targetFile) throws IOException {
        BufferedInputStream inBuff = null;
        BufferedOutputStream outBuff = null;
        try {
            // 新建文件输入流并对它进行缓冲
            inBuff = new BufferedInputStream(new FileInputStream(sourceFile));

            // 新建文件输出流并对它进行缓冲
            outBuff = new BufferedOutputStream(new FileOutputStream(targetFile));

            // 缓冲数组
            byte[] b = new byte[1024 * 5];
            int len;
            while ((len = inBuff.read(b)) != -1) {
                outBuff.write(b, 0, len);
            }
            // 刷新此缓冲的输出流
            outBuff.flush();
        } finally {
            // 关闭流
            if (inBuff != null)
                inBuff.close();
            if (outBuff != null)
                outBuff.close();
        }
    }
	/**
	 * 文件拷贝
	 * @param sourceFile 源目录
	 * @param targetFile 目标目录
	 * */	
    public static void copyDirectiory(String sourceDir, String targetDir) throws IOException {
    	File source = new File(sourceDir);
    	if(!source.exists()){
    		return;
    	}
    	
    	// 获取源文件夹当前下的文件或目录    	
        File[] file =source.listFiles();
        // 新建目标目录
        (new File(targetDir)).mkdirs();
        for (int i = 0; i < file.length; i++) {
            if (file[i].isFile()) {
                // 源文件
                File sourceFile = file[i];
                // 目标文件
                File targetFile = new File(new File(targetDir).getAbsolutePath() + File.separator + file[i].getName());
				copyFile(sourceFile, targetFile);
            }
            if (file[i].isDirectory()) {
                // 准备复制的源文件夹
                String dir1 = sourceDir + "/" + file[i].getName();
                // 准备复制的目标文件夹
                String dir2 = targetDir + "/" + file[i].getName();
                copyDirectiory(dir1, dir2);
            }
        }
    }
    
	public static File[] getFiles(String dirPath) {
		File source = new File(dirPath);
		if (!source.exists()) {
			return null;
		}
		
		return source.listFiles();
	}
	
	public static String readFile(File myFile) throws IOException {		
		if (!myFile.exists()) {
			return "";
		}

		BufferedReader bufferedReader = null;
		StringBuffer sb = new StringBuffer();
		bufferedReader = new BufferedReader(new InputStreamReader(
				new FileInputStream(myFile), "UTF-8"));
		String read = null;
		while ((read = bufferedReader.readLine()) != null) {
			sb.append(read + "\n");
		}
		
		bufferedReader.close();		
		return sb.toString();       
	}

    
}
