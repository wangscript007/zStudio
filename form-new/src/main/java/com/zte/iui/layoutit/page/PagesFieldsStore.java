package com.zte.iui.layoutit.page;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.Map;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;

import com.zte.iui.layoutit.bean.PageFields;
import com.zte.iui.layoutit.common.CommonConst;

/**
 * 页面的存储和加载
 * 
 * @author dw
 * 
 */
public class PagesFieldsStore {
	private static Logger logger = Logger.getLogger(PagesFieldsStore.class.getName());
	private static PagesFieldsStore instance = null;

	protected ThreadPoolExecutor threadPool = null;

	/**
	 * key：页面path value：PageFields
	 */
	private Map<String, PageFields> pages = new ConcurrentHashMap<String, PageFields>();

	public synchronized static PagesFieldsStore getInstance() {
		if (instance == null) {
			instance = new PagesFieldsStore();
		}
		return instance;
	}

	private PagesFieldsStore() {
		threadPool = new ThreadPoolExecutor(10, 10, 6 * 1000,
				TimeUnit.MILLISECONDS, new ArrayBlockingQueue<Runnable>(100),
				new ThreadPoolExecutor.AbortPolicy());
	}

	/**
	 * 根据path获取PageFields，获取不到时先从文件中加载，如果加载不成功再重新创建
	 * 
	 * @param path
	 * @return
	 */
	public PageFields getPageFields(String path) {
		PageFields fields = pages.get(path);
		if (fields == null) {
			boolean isLoad = reloadFile(path);
			if (!isLoad) {
				fields = new PageFields(path);
				putPageFields2Map(fields);
			} else {
				fields = pages.get(path);
			}
		}
		return fields;
	}

	/**
	 * 根据path获取存储文件的绝对路径
	 * 
	 * @param path
	 * @return
	 */
	String getPageFieldsFile(String path) {
		return CommonConst.FRAME_FILE_PATH + path
				+ CommonConst.FRAME_FIEDLS_FILE_SUFFIX;
	}

	/**
	 * 重加载文件
	 * 
	 * @param path
	 * @return
	 */
	public boolean reloadFile(String path) {
		File file = new File(getPageFieldsFile(path));
		if (file.exists() && file.isFile()) {
			ObjectInputStream ois = null;
			try {
				ois = new ObjectInputStream(new FileInputStream(file));
				PageFields fields = (PageFields) ois.readObject();
				putPageFields2Map(fields);
				return true;
			} catch (IOException e) {
				logger.error(e.getMessage(), e);
			} catch (ClassNotFoundException e) {
				logger.error(e.getMessage(), e);
			} finally {
				if (ois != null) {
					try {
						ois.close();
					} catch (IOException e) {
						logger.error(e.getMessage(), e);
					}
				}
			}
		}
		return false;
	}

	private PageFields putPageFields2Map(PageFields fields) {
		return pages.put(fields.getPagePath(), fields);
	}

	public void updatePageFields(final PageFields fields) {
		Runnable runnable = new Runnable() {
			@Override
			public void run() {
				ObjectOutputStream os = null;
				try {
					String pageFieldsFile = getPageFieldsFile(fields
							.getPagePath());
					File file = new File(pageFieldsFile);
					if (file.exists() && file.isFile()) {
						file.delete();
					}
					FileOutputStream fs = new FileOutputStream(pageFieldsFile);
					os = new ObjectOutputStream(fs);
					os.writeObject(fields);
				} catch (Exception ex) {
					logger.error(ex.getMessage(), ex);
				} finally {
					if (os != null)
						try {
							os.close();
						} catch (IOException e) {
							logger.error(e.getMessage(), e);
						}
				}
			}
		};
		threadPool.execute(runnable);
	}

}
