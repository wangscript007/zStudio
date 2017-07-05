package com.zte.mao.bpm.service;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mao.bpm.util.FileDeleteUtil;
import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.base.OrmQueryCondition;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.service.SqlExecuteService;
import com.zte.mao.common.session.SessionManager;

@Service
public class DeleteProcessPackageService {

	private static Logger logger = Logger.getLogger(ProcessZipOperationService.class.getName());
	private static String PROCESS_PACKAGE = "process_package";
	private static String USER_FORMS = "userforms";
	private static final String APPLICATION_TABLE_NAME = "bcp_re_import_process";
	private static final String APPLICATION_FORM_TABLE_NAME = "bcp_re_form";
	private static final String TENENT_MENU_TABLE_NAME = "tenant_menu";
	
	@Resource
	private OrmDao ormDao;
	@Resource
	private SessionManager sessionManager;
	@Resource
	private SqlExecuteService sqlExecuteService;

	@Transactional
    public void deleteApplication(HttpServletRequest request, String appId, String appFileName) throws Exception {
        String tenantId = sessionManager.getTenantId(request);
        String path = request.getServletContext().getRealPath("");

        // 检查是否删除已解压的应用文件并删除
        String applciationFilePath = path + PROCESS_PACKAGE + File.separator + tenantId + File.separator + appFileName;
        FileDeleteUtil.delete(applciationFilePath);
        
        //判断当前应用的列表是否被其他菜单引用，如果被引用直接返回
        List<String> list = getFormsInfo(appId, tenantId, "列表");
        List<String> newList = new ArrayList<String>();
        for (Iterator<String> iterator = list.iterator(); iterator.hasNext();) {
            String item = iterator.next();
            if (item.contains(".html")) {
                newList.add(item);
            }
        }
        String rootMenuKey = getMenuInfo(appId, tenantId);
        //rootMenuKey为""时表示菜单数据已经在菜单管理中删除
        if (!"".equals(rootMenuKey)) {
            isQuotedList(newList, rootMenuKey, appId, tenantId);
        }

        String userformsPath = path + USER_FORMS + File.separator + "form" + File.separator + tenantId + File.separator;
        String datavisualPath = path + USER_FORMS + File.separator + "datavisual" + File.separator + tenantId
                + File.separator;
        // 删除"userForms"目录下的应用文件
        deleteUserformsDirectory(appId, tenantId, userformsPath, datavisualPath);

        deletePackageImportInfo(appId, tenantId);

        deleteFormByPackageId(appId, tenantId);

        deleteMenuByPackageId(appId, tenantId, rootMenuKey);
    }
	
	private void deleteUserformsDirectory(String appId, String tenantId, 
	        String formsPath, String datavisualPath) throws MaoCommonException {
	    //查询表单、列表、图表信息
	    List<String> formList = getFormsInfo(appId, tenantId, "");
	    //删除图表数据
	    deleteUserformsFiles(formList, datavisualPath);
	    //删除表单和列表数据
	    deleteUserformsFiles(formList, formsPath);
	}
	
    private List<String> getFormsInfo(String appId, String tenantId, String type) throws MaoCommonException {
        try {
            String[] columns = new String[] { "formurl" };
            List<OrmQueryCondition> conditions = new ArrayList<OrmQueryCondition>();
            OrmQueryCondition condition = new OrmQueryCondition("packageid", "=", appId);
            conditions.add(condition);
            if (!"".equals(type)) {
                OrmQueryCondition conditionType = new OrmQueryCondition("type", "=", type); 
                conditions.add(conditionType);
            }
            List<String> urlList = new ArrayList<String>();
            List<Map<String, String>> data = ormDao.getData(APPLICATION_FORM_TABLE_NAME, columns, conditions,
                    OrmDao.OPERATOR_AND, tenantId);
            if (!data.isEmpty() && data.size() > 0) {
                Iterator<Map<String, String>> iterator = data.iterator();
                while (iterator.hasNext()) {
                    Map<String, String> next = iterator.next();
                    String[] formUrls = next.get("formurl").split("\\$");
                    if (null != formUrls[1]) {
                        urlList.add(formUrls[1]);
                        //加上该页面的.js文件
                        urlList.add(formUrls[1].split("\\.")[0] + ".js");
                    }
                }
            }
            return urlList;
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            throw e;
        }
    }
    
    private void deleteUserformsFiles(List<String> formList, String userformsPath) {
        Iterator<String> iterator = formList.iterator();
        while (iterator.hasNext()) {
            String filePath = userformsPath + iterator.next();
            File file = new File(filePath);
            if (file.exists()) {
                FileDeleteUtil.delete(filePath);
            }
        }
    }
	
    private void deletePackageImportInfo(String appId, String tenantId) throws MaoCommonException {
        OrmQueryCondition condition = OrmQueryCondition.generatorCondition();
        condition.setCname("id").setCompare("=").setValue(appId);

        try {
            ormDao.delete(APPLICATION_TABLE_NAME, condition, tenantId);
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            throw e;
        }
    }
    
    /**
     * 测试平台根据packageId删除“bcp_re_form”表数据
     * @param packageId
     * @param tenantId
     * @throws MaoCommonException 
     */
    private void deleteFormByPackageId(String appId, String tenantId) throws MaoCommonException {
        OrmQueryCondition condition = OrmQueryCondition.generatorCondition();
        condition.setCname("packageid").setCompare("=").setValue(appId);
        try {
            ormDao.delete(APPLICATION_FORM_TABLE_NAME, condition, tenantId);
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            throw e;
        }
    }
	
	/**
	 * 测试平台根据packageId删除“tenant_menu”表数据
	 * @param packageId
	 * @param tenantId
	 * @throws Exception 
	 */
    @SuppressWarnings("unchecked")
    private void deleteMenuByPackageId(String appId, String tenantId, String rootMenuKey) throws MaoCommonException {
        OrmQueryCondition condition = OrmQueryCondition.generatorCondition();
        condition.setCname("APPLICATIONID").setCompare("=").setValue(appId);
        try {
            ormDao.delete(TENENT_MENU_TABLE_NAME, condition, tenantId);

            // 删除菜单管理中新增的子菜单
            OrmQueryCondition childMenuCond = new OrmQueryCondition("PARENT_KEY", "=", rootMenuKey);
            ormDao.delete(TENENT_MENU_TABLE_NAME, childMenuCond, tenantId);

            // 检查"统计分析"菜单是否被删空
            String sql = "SELECT * from tenant_menu b WHERE b.PARENT_KEY = (SELECT a.`KEY` FROM `tenant_menu` a where a.`NAME`='"
                    + URLEncoder.encode("统计分析", "UTF-8") + "')";
            Map<?, ?> resultMap = sqlExecuteService.executeSQL(sql, SqlExecuteService.OPERATOR_QUERY, tenantId);
            ArrayList<Object> rows = (ArrayList<Object>) resultMap.get("rows");
            if (rows.size() == 0) {
                OrmQueryCondition condition1 = OrmQueryCondition.generatorCondition().setCname("NAME").setValue("统计分析")
                        .setCompare("=");
                ormDao.delete(TENENT_MENU_TABLE_NAME, condition1, tenantId);
            }
        } catch (UnsupportedEncodingException e) {
            logger.error(e.getMessage(), e);
            throw new MaoCommonException("不支持的编码类型。");
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw new MaoCommonException(e);
        }
    }
    
    /**
     * 判断应用的列表是否被其他菜单引用
     * @param list
     * @param rootMenuKey
     * @param appId
     * @param tenantId
     * @throws MaoCommonException
     */
    private void isQuotedList(List<String> list, String rootMenuKey, String appId, String tenantId)
            throws MaoCommonException {
        for (Iterator<String> iter = list.iterator(); iter.hasNext();) {
            String urlStr = iter.next();
            List<Map<String, String>> menuList = getMenuList(tenantId, urlStr);
            for (int i = 0; i < menuList.size(); i++) {
                if (!rootMenuKey.equals(menuList.get(i).get("PARENT_KEY"))) {
                    throw new MaoCommonException("应用列表" + urlStr + "被其他菜单引用，不能删除该应用。");
                }
            }
        }
    }
    
    /**
     * 获取应用的顶层菜单KEY
     * @param appId
     * @param tenantId
     * @return
     * @throws MaoCommonException
     */
    private String getMenuInfo(String appId, String tenantId) throws MaoCommonException {
        List<OrmQueryCondition> conditions = new ArrayList<OrmQueryCondition>();
        conditions.add(new OrmQueryCondition("APPLICATIONID", "=", appId));
        conditions.add(new OrmQueryCondition("PARENT_KEY", "=", "BCP_BPM"));
        try {
            List<Map<String, String>> data = ormDao.getData(TENENT_MENU_TABLE_NAME, new String[] { "KEY" }, conditions,
                    OrmDao.OPERATOR_AND, tenantId);
            if (!data.isEmpty() && data.size() > 0) {
                return data.get(0).get("KEY");
            } else {
                return "";
            }
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            throw e;
        }
    }
    
    /**
     * 根据URL获取应用列表和菜单引用列表的PARENT_KEY
     * @param tenantId
     * @param url
     * @return
     * @throws MaoCommonException
     */
    private List<Map<String, String>> getMenuList(String tenantId, String url) throws MaoCommonException {
        List<OrmQueryCondition> conditions = new ArrayList<OrmQueryCondition>();
        conditions.add(new OrmQueryCondition("URL", "like", "%" + url + "%"));
        try {
            List<Map<String, String>> data = ormDao.getData(TENENT_MENU_TABLE_NAME, new String[] { "PARENT_KEY" },
                    conditions, OrmDao.OPERATOR_AND, tenantId);
            if (!data.isEmpty() && data.size() > 0) {
                return data;
            } else {
                return new ArrayList<Map<String, String>>();
            }
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            throw e;
        }
    }

}
