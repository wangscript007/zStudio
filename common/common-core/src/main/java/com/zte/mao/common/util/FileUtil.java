package com.zte.mao.common.util;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

public class FileUtil {
	
	private static Logger logger = Logger.getLogger(FileUtil.class.getName());

    private FileUtil() {
        super();
    }
    
    public static String getApplicationRealPath(final HttpServletRequest request) {
        return request.getServletContext().getRealPath("");
    }
    
    public static File createFileOrMultistageDirectoryOfFile(final String fileUrl) throws IOException {
        File file = new File(fileUrl);
        if (!file.getParentFile().exists()) {
            file.getParentFile().mkdirs();
        }
        if (!file.exists()) {
            file.createNewFile();
        }
        return file;
    }
    
    public static File createFileOrMultistageDirectoryOfFile(final File file) throws IOException {
        if (!file.getParentFile().exists()) {
            file.getParentFile().mkdirs();
        }
        if (!file.exists()) {
            file.createNewFile();
        }
        return file;
    }
    
    public static void deleteFileInPath(String filePath){		
		File file = new File(filePath);
		if(file.isDirectory()){
		String[] fileList = file.list();
	       File temp = null;
	       for (int i = 0; i < fileList.length; i++) {
	    	   temp = new File(filePath + File.separator + fileList[i]);
	          if (temp.isFile()) {
	             temp.delete();
	          }
	          if(temp.isDirectory()){
	        	  deleteFileInPath(filePath + File.separator + fileList[i]);//先删除文件夹里面的文件
	              delFolder(filePath + File.separator + fileList[i]);//再删除空文件夹
	          }
	       }
		}
	}
	
	public static void delFolder(String folderPath) {
	     try {
	    	 deleteFileInPath(folderPath); //删除完里面所有内容
	         File mewFilePath = new File(folderPath);
	         mewFilePath.delete(); //删除空文件夹
	      } catch (Exception e) {
	    	  logger.error(e.getMessage(), e);
	      }
	 }
	
	public static void copy(String src, String target) {
		File file1 = new File(src);
		File[] fs = file1.listFiles();
		File file2 = new File(target);
		if (!file2.exists()) {
			file2.mkdirs();
		}
		for (File f : fs) {
			if (f.isFile()) {
				fileCopy(f.getPath(), target + File.separator + f.getName()); // 调用文件拷贝的方法
			} else if (f.isDirectory()) {
				copy(f.getPath(), target + File.separator + f.getName());
			}
		}

	}

	/**
	 * 文件拷贝的方法
	 */
	public static void fileCopy(String src, String target) {

		FileInputStream br = null;
		BufferedOutputStream ps = null;

		try {
			br = new FileInputStream(src);
			ps = new BufferedOutputStream(new FileOutputStream(target));
			int s = 0;
			while ((s = br.read()) != -1) {
				ps.write(s);
				ps.flush();
			}

		} catch (FileNotFoundException e) {
			logger.error(e.getMessage(), e);
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		} finally {
			try {
				if (br != null)
					br.close();
				if (ps != null)
					ps.close();
			} catch (IOException e) {
				logger.error(e.getMessage(), e);
			}
		}
	}
	
	/**
	   * Closes the given stream. 
	   * errors while closing are silently ignored.
	   */
	  public static void closeSilently(InputStream inputStream) {
	    try {
	      if(inputStream != null) {
	        inputStream.close();
	      }
	    } catch(IOException e) {
	    	logger.error(e.getMessage(), e);
	    }
	  }
	  
	  public static void closeSilently(InputStreamReader inputStream) {
		    try {
		      if(inputStream != null) {
		        inputStream.close();
		      }
		    } catch(IOException e) {
		    	logger.error(e.getMessage(), e);
		    }
		  }
	  
	  /**
	   * Closes the given stream. 
	   * errors while closing are silently ignored.
	   */
	  public static void closeSilently(FileInputStream inputStream) {
	    try {
	      if(inputStream != null) {
	        inputStream.close();
	      }
	    } catch(IOException e) {
	    	logger.error(e.getMessage(), e);
	    }
	  }

	  /**
	   * Closes the given stream. 
	   * errors while closing are silently ignored.
	   */
	  public static void closeSilently(OutputStream outputStream) {
	    try {
	      if(outputStream != null) {
	        outputStream.close();
	      }
	    } catch(IOException e) {
	    	logger.error(e.getMessage(), e);
	    }
	  }
}
