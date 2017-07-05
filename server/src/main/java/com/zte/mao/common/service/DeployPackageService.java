package com.zte.mao.common.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.base.OrmQueryCondition;
import com.zte.mao.common.base.OrmQueryOrder;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.http.HttpRequestUtils;
import com.zte.mao.common.session.SessionManager;
import com.zte.mao.common.util.FileUtil;
import com.zte.mao.common.util.IdGenerator;

@Service
public class DeployPackageService {
	private static Logger logger = Logger.getLogger(DeployPackageService.class.getName());

	@Resource
	private SessionManager sessionManager;
	@Resource
	private OrmDao ormDao;
	@Resource
	private HttpRequestUtils httpRequestUtils;
	@Resource
	private SqlExecuteService sqlExecuteService;
	@Resource
	private DeployDataModelService deployDataModelService;


	public static final String UNZIP_FILE_PATH = "process_package";
	public static final String deployRestURI = "/bpe/service/repository/deployments";
	public static final String FOR_END_MENU = "1";

	private static final String DEFAULT_ANALYSIS = "32766";
	private static final String APPLICATION_TABLE_NAME = "bcp_re_import_process";
	private static final String TENANT_MENU_TABLE_NAME = "tenant_menu";

	public void deployPackage(String packageName, HttpServletRequest request) throws Exception {
		try {
			String tenantId = sessionManager.getTenantId(request);
			// 0. 先删除同名包的流程定义，再部署
			deleteExistPackageModel(packageName, tenantId);

			// 3. 导入数据模型
			deployDataModel(packageName, request, tenantId);

			// 2. 导入菜单
			// if (deployResult.size() > 0) { //没有流程时，也可以导入
			deployMenu(packageName, tenantId, request, null);
			// }

		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw e;
		}
	}

	/**
	 * 0. 先删除同名包的流程定义，再部署
	 * 
	 * @param packageName
	 * @param tenantId
	 * @throws Exception
	 */
	public void deleteExistPackageModel(String packageName, String tenantId) throws Exception {
		deletePackageImportInfo(packageName, tenantId);
	}

	private String getProcessPackageRootPath(String packageName, HttpServletRequest request, String tenantId) {
		StringBuilder filePath = new StringBuilder();

		filePath.append(FileUtil.getApplicationRealPath(request)).append(UNZIP_FILE_PATH).append(File.separator)
				.append(tenantId).append(File.separator).append(packageName).append(File.separator);
		return filePath.toString();
	}

	/**
	 * 导入表"tenant_menu"菜单数据
	 * @param packageName
	 * @param tenantId
	 * @param request
	 * @param packageId
	 * @return
	 * @throws Exception
	 */
    public void deployMenu(String packageName, String tenantId, HttpServletRequest request, String applicationId)
            throws Exception {
        // 读菜单配置json文件
        StringBuilder menuFilePath = new StringBuilder();
        StringBuilder rptMenuFilePath = new StringBuilder();
        String realPath = request.getServletContext().getRealPath("");
        menuFilePath.append(realPath)
                .append(UNZIP_FILE_PATH).append(File.separator)
                .append(tenantId).append(File.separator)
                .append(packageName).append(File.separator)
                .append("misc").append(File.separator)
                .append("menu_info.json");
        rptMenuFilePath.append(realPath)
                .append(UNZIP_FILE_PATH).append(File.separator)
                .append(tenantId).append(File.separator)
                .append(packageName).append(File.separator)
                .append("misc").append(File.separator)
                .append("rpt_menu_info.json");
        
        try {
            File menuFile = new File(menuFilePath.toString());
            String menuJsonStr = getFileAsString(menuFile, applicationId);
            JsonNode menuNode = new ObjectMapper().readTree(menuJsonStr);
            
            // 读报表菜单
            File rptMnuFile = new File(rptMenuFilePath.toString());
            String rptMenuJsonStr = getFileAsString(rptMnuFile, applicationId);
            JsonNode rptMenuNode = new ObjectMapper().readTree(rptMenuJsonStr);
            
            ArrayNode menuNodeArray = new ObjectMapper().createArrayNode();
            // 读取当前租户tenant_menu表数据的ORDER信息
            String menuOrder = getMenuOrderFromTable(tenantId);
            int order = Integer.parseInt(menuOrder);
            
            String parentKey = "";
            for (JsonNode node : menuNode) {
                if (node.get("parent_key").asText().equals("BCP_BPM")) {
                    String menuName = node.get("name").asText();
                    parentKey = existMenu(menuName, tenantId);
                    // 判断menuName这个菜单项是否已存在，存在并更新该菜单的order排序
                    // 如果存在，读取该菜单项key，并且设置为二级菜单 的parentKey;不存在，则要新建这层菜单
                    if (parentKey.equals("")) {
                        menuNodeArray.add(node);
                    } else {
                        order--;
                        updateMenuByKey(node, tenantId, order);
                    }
                } else {
                    menuNodeArray.add(node);
                    // 删除与业务 包同名的菜单及子菜单信息
                    if (!parentKey.equals("")) {
                        deleteMenuByPackageNameAndParentKey(node.get("name").asText(), parentKey, tenantId);
                    }
                }
            }
            
            List<Map<String, String>> menuData = new ArrayList<Map<String, String>>();
            menuData = handleMenuForm(menuNodeArray, parentKey, tenantId, order, applicationId);
            menuData = handleReportMenu(rptMenuNode, menuData, tenantId, applicationId);
            
            if (menuData.size() > 0) {
                ormDao.addList(TENANT_MENU_TABLE_NAME, menuData, tenantId);
            } 
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            deleteAppTable(applicationId, tenantId);
            throw e;
        }
	}


	private String ReplacePathWithTenantId(String url, String tenantId) {
		return url.replace("##", "/" + tenantId + "/");
	}

    private String getFileAsString(File file, String applicationId) throws FileNotFoundException,
            IOException, MaoCommonException {
        InputStream inputStream = null;
        InputStreamReader inputStreamReader = null;
        BufferedReader reader = null;
        StringBuffer resultBuffer = new StringBuffer();
        String tempLine = null;

        try {
            inputStream = new FileInputStream(file);
            inputStreamReader = new InputStreamReader(inputStream, "UTF-8");
            reader = new BufferedReader(inputStreamReader);
            while ((tempLine = reader.readLine()) != null) {
                resultBuffer.append(tempLine);
            }
        } catch (FileNotFoundException e) {
            logger.error(e.getMessage(), e);
            throw new FileNotFoundException("文件不存在。");
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
            throw new IOException("文件读取失败。");
        } finally {
            if (null != reader) {
                try {
                    reader.close();
                } catch (IOException e) {
                    logger.error(e.getMessage(), e);
                }
            }
            FileUtil.closeSilently(inputStreamReader);
            FileUtil.closeSilently(inputStream);

        }
        return resultBuffer.toString();
    }

    private void deleteMenuByPackageName(String packageName, String tenantId) throws Exception {
        StringBuilder sqlStr = new StringBuilder();
        sqlStr.append("SELECT `KEY` FROM `tenant_menu` a WHERE a. NAME = '")
                .append(URLEncoder.encode(packageName.toString(), "UTF-8"))
                .append("' UNION SELECT `KEY` FROM `tenant_menu` WHERE PARENT_KEY IN (SELECT `KEY` FROM `tenant_menu` a WHERE a. NAME = '")
                .append(URLEncoder.encode(packageName.toString(), "UTF-8"))
                .append("') UNION SELECT `KEY` FROM tenant_menu WHERE PARENT_KEY IN (SELECT `KEY` FROM `tenant_menu` WHERE PARENT_KEY IN (SELECT `KEY` FROM `tenant_menu` a WHERE a. NAME='")
                .append(URLEncoder.encode(packageName.toString(), "UTF-8")).append("'))");
        deleteMenuBySQL(tenantId, sqlStr.toString());
    }
	
    public void deleteMenuByPackageNameAndParentKey(String packageName, String parentKey, String tenantId
            ) throws Exception {
        String sqlStr = "SELECT `KEY` FROM `tenant_menu` a WHERE a. NAME = '"
                + URLEncoder.encode(packageName.toString(), "UTF-8") + "' and a.PARENT_KEY='" + parentKey + "'";
        deleteMenuBySQL(tenantId, sqlStr);
    }


	@SuppressWarnings("unchecked")
    private void deleteMenuBySQL(String tenantId, String sqlStr) throws Exception, MaoCommonException {
        List<String> keyIds = new ArrayList<String>();
        try {
            Map<?, ?> resultMap = sqlExecuteService.executeSQL(sqlStr.toString(), SqlExecuteService.OPERATOR_QUERY,
                    tenantId);
            ArrayList<Object> rows = (ArrayList<Object>) resultMap.get("rows");
            for (Object row : rows) {
                keyIds.add(((Map<?, ?>) row).get("KEY").toString());
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw e;
        }
        if (keyIds.size() > 0) {
            OrmQueryCondition condition = OrmQueryCondition.generatorCondition().setCname("KEY").setValues(keyIds)
                    .setCompare("IN");
            ormDao.delete(TENANT_MENU_TABLE_NAME, condition, tenantId);
        }
    }
	
	/**
	 * 删除“bcp_re_import_process”表应用表信息
	 * @param packageName
	 * @param tenantId
	 * @throws MaoCommonException
	 */
    public String deletePackageImportInfo(String packageName, String tenantId) throws MaoCommonException {
        List<OrmQueryCondition> conditions = new ArrayList<OrmQueryCondition>();
        OrmQueryCondition condition = OrmQueryCondition.generatorCondition();
        condition.setCname("process_packageName").setCompare("=").setValue(packageName);
        conditions.add(condition);
        
        try {
            String[] columns = new String[] { "id" };
            List<Map<String, String>> resData = ormDao.getData(APPLICATION_TABLE_NAME, columns, conditions,
                    OrmDao.OPERATOR_AND, tenantId);

            if (resData.size() <= 0) {
                throw new MaoCommonException("不存在应用数据。");
            }

            ormDao.delete(APPLICATION_TABLE_NAME, condition, tenantId);
            Map<String, String> resMap = resData.get(0);
            return resMap.get("id");
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            throw new MaoCommonException(e);
        }
    }

	/**
	 * 生成应用表
	 * @param packageName
	 * 		表名，比如packageName为“test”，则在tenant_tenantId这个数据库下生成“test”表
	 * @param request
	 * @param tenantId
	 * @throws Exception
	 */
	public void deployDataModel(String packageName, HttpServletRequest request, String tenantId) throws Exception {
        StringBuilder filePath = new StringBuilder();
        filePath.append(getProcessPackageRootPath(packageName, request, tenantId)).append("dataModel")
                .append(File.separator).append("dataModel.sql");
		
		deployDataModelService.excuteSql(deployDataModelService.getSql(filePath.toString()), tenantId);
	}

    private String getMenuKeyByName(String menuName, String tenantId) throws MaoCommonException {
        String menuKey = existMenu(menuName, tenantId);
        if (menuKey.equals("")) {
            return createMenu(menuName, tenantId);
        }
        return menuKey;
    }
	
	/**
	 * 判断菜单是否已存在
	 * @param menuName
	 * @param tenantId
	 * @return
	 * @throws MaoCommonException
	 */
    private String existMenu(String name, String tenantId) throws MaoCommonException {
        List<OrmQueryCondition> conditions = OrmQueryCondition.getConditions();
        OrmQueryCondition condition = OrmQueryCondition.generatorCondition();
        OrmQueryCondition condition2 = OrmQueryCondition.generatorCondition();
        condition.setCname("NAME").setCompare("=").setValue(name);
        conditions.add(condition);
        condition2.setCname("PARENT_KEY").setCompare("=").setValue("BCP_BPM");
        conditions.add(condition2);

        try {
            List<Map<String, String>> result = ormDao.getData(TENANT_MENU_TABLE_NAME, "KEY".split(","), conditions,
                    OrmDao.OPERATOR_AND, tenantId);
            if (result.size() > 0) {
                return result.get(0).get("KEY");
            } else {
                return "";
            }
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            throw e;
        }
    }

	/**
	 * 创建"统计分析"菜单
	 * @param menuName
	 * @param tenantId
	 * @return
	 * @throws MaoCommonException
	 */
	private String createMenu(String menuName, String tenantId) throws MaoCommonException {
		List<Map<String, String>> menuData = new ArrayList<Map<String, String>>();
		Map<String, String> rptMenuDataItem = new HashMap<String, String>();
		String parentKey = IdGenerator.getRandomString(10);
		rptMenuDataItem.put("KEY", parentKey);
		rptMenuDataItem.put("NAME", menuName);
		rptMenuDataItem.put("PARENT_KEY", "BCP_BPM");		
		rptMenuDataItem.put("URL", "#");
		rptMenuDataItem.put("STATUS", "1");
		rptMenuDataItem.put("ORDER", DEFAULT_ANALYSIS);
		rptMenuDataItem.put("RANGE", FOR_END_MENU);
		rptMenuDataItem.put("ICON", "fa fa-comments");
		rptMenuDataItem.put("TYPE", FOR_END_MENU);
		rptMenuDataItem.put("PACKAGEID", "");
		menuData.add(rptMenuDataItem);
		ormDao.addList(TENANT_MENU_TABLE_NAME, menuData, tenantId);
		return parentKey;
	}
	
	/**
	 * 获取tenant_menu表的ORDER最小值
	 * @param tenantId
	 * @return
	 * @throws MaoCommonException 
	 */
    private String getMenuOrderFromTable(String tenantId) throws MaoCommonException {
        String menuOrder = "";
        List<Map<String, String>> data = null;
        String[] columns = new String[] { "ORDER" };

        List<OrmQueryCondition> conditions = new ArrayList<OrmQueryCondition>();
        OrmQueryCondition ormQueryCondition = new OrmQueryCondition();
        ormQueryCondition.setCname("PARENT_KEY");
        ormQueryCondition.setCompare("=");
        ormQueryCondition.setValue("BCP_BPM");
        conditions.add(ormQueryCondition);

        List<OrmQueryOrder> orders = new ArrayList<OrmQueryOrder>();
        orders.add(new OrmQueryOrder("ORDER", OrmQueryOrder.ORDER_ASC));
        try {
            data = ormDao.getData(TENANT_MENU_TABLE_NAME, columns, conditions, OrmDao.OPERATOR_AND, orders, tenantId);
            if (null != data.get(0)) {
                menuOrder = data.get(0).get("ORDER");
            }
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            throw e;
        }
        return menuOrder;
    }
	
	/**
	 * 根据"KEY"值更新"tenant_menu"数据
	 * @param key
	 * @throws MaoCommonException 
	 */
    private void updateMenuByKey(JsonNode node, String tenantId, int order)
            throws MaoCommonException {
        Map<String, String> data = new HashMap<String, String>();
        List<OrmQueryCondition> conditions = new ArrayList<OrmQueryCondition>();

        String key = node.get("name").asText();
        data.put("ORDER", String.valueOf(order));

        conditions.add(new OrmQueryCondition("NAME", "=", key));
        conditions.add(new OrmQueryCondition("PARENT_KEY", "=", "BCP_BPM"));
        try {
            ormDao.update(TENANT_MENU_TABLE_NAME, data, conditions, OrmDao.OPERATOR_AND, tenantId);
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            throw new MaoCommonException("数据表更新失败。");
        }
    }
	
	/**
	 * 提取表单数据
	 * @param menuNodeArray
	 * @param parentKey
	 * @param packageName
	 * @param tenantId
	 * @param request
	 * @param order
	 * @param packageId
	 * @return
	 */
    private List<Map<String, String>> handleMenuForm(ArrayNode menuNodeArray, String parentKey, String tenantId,
            int order, String applicationId) {
        List<Map<String, String>> menuData = new ArrayList<Map<String, String>>();
        int childMenuOrder = 1;
        for (JsonNode node : menuNodeArray) {
            Map<String, String> menuDataItem = new HashMap<String, String>();
            if (node.has("key")) {
                menuDataItem.put("KEY", node.get("key").asText());
            }
            if (node.has("name")) {
                menuDataItem.put("NAME", node.get("name").asText());
            }
            String currentNodeParenetKey = "";
            if (node.has("parent_key")) {
                currentNodeParenetKey = node.get("parent_key").asText();
                if (parentKey.equals("")) {
                    menuDataItem.put("PARENT_KEY", currentNodeParenetKey);
                } else {
                    menuDataItem.put("PARENT_KEY", parentKey);
                }
            }
            if (node.has("url")) {
                String tempUrl = node.get("url").asText();
                if (tempUrl.indexOf("##") > -1) {
                    tempUrl = "userforms/" + ReplacePathWithTenantId(tempUrl, tenantId) + ".html?operator=add";
                }
                menuDataItem.put("URL", tempUrl);
            }
            if (node.has("status")) {
                if (node.get("status").asText().equals("")) {
                    menuDataItem.put("STATUS", FOR_END_MENU);
                } else {
                    menuDataItem.put("STATUS", node.get("status").asText());
                }
            }

            if (currentNodeParenetKey.equals("BCP_BPM")) {
                order--;
                if (order < 1) {
                    order = 32765;
                }
                menuDataItem.put("ORDER", String.valueOf(order));
            } else {
                menuDataItem.put("ORDER", String.valueOf(childMenuOrder)); 
                childMenuOrder ++;
            }
            
            menuDataItem.put("RANGE", FOR_END_MENU);
            if (node.has("icon")) {
                menuDataItem.put("ICON", node.get("icon").asText());
            }
            menuDataItem.put("TYPE", FOR_END_MENU);
            menuDataItem.put("APPLICATIONID", applicationId);
            menuData.add(menuDataItem);
        }

        return menuData;
    }
	
	/**
	 * 提取图表数据
	 * @param rptMenuNode
	 * @param menuData
	 * @param tenantId
	 * @param packageId
	 * @return
	 * @throws Exception
	 */
    private List<Map<String, String>> handleReportMenu(JsonNode rptMenuNode, List<Map<String, String>> menuData,
            String tenantId, String applicationId) throws Exception {
        for (JsonNode rptNode : rptMenuNode) {
            // 删除同名报表
            deleteMenuByPackageName(rptNode.get("name").asText(), tenantId);
            Map<String, String> rptMenuDataItem = new HashMap<String, String>();
            if (rptNode.has("key")) {
                rptMenuDataItem.put("KEY", rptNode.get("key").asText());
            }
            if (rptNode.has("name")) {
                rptMenuDataItem.put("NAME", rptNode.get("name").asText());
            }
            // 读"统计分析"菜单的key
            rptMenuDataItem.put("PARENT_KEY", getMenuKeyByName("统计分析", tenantId));

            String tempUrl = rptNode.get("url").asText();
            if (tempUrl.indexOf("##") > -1) {
                tempUrl = "userforms/" + ReplacePathWithTenantId(tempUrl, tenantId) + ".html";
            }
            rptMenuDataItem.put("URL", tempUrl);
            if (rptNode.has("status")) {
                if (rptNode.get("status").asText().equals("")) {
                    rptMenuDataItem.put("STATUS", FOR_END_MENU);
                } else {
                    rptMenuDataItem.put("STATUS", rptNode.get("status").asText());
                }
            }
            if (rptNode.has("order")) {
                rptMenuDataItem.put("ORDER", rptNode.get("order").asText());
            }
            rptMenuDataItem.put("RANGE", FOR_END_MENU);
            if (rptNode.has("icon")) {
                rptMenuDataItem.put("ICON", rptNode.get("icon").asText());
            }
            rptMenuDataItem.put("TYPE", FOR_END_MENU);
            rptMenuDataItem.put("APPLICATIONID", applicationId);

            menuData.add(rptMenuDataItem);
        }

        return menuData;
    }
    
    private void deleteAppTable(String applicationId, String tenantId) throws MaoCommonException {
        OrmQueryCondition appCond = new OrmQueryCondition("id", OrmQueryCondition.COMPARE_EQUALS, applicationId);
        try {
            ormDao.delete(APPLICATION_TABLE_NAME, appCond, tenantId);
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            throw new MaoCommonException(e);
        }
    }
	
}
