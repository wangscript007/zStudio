SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for bcp_re_agent
-- ----------------------------
DROP TABLE IF EXISTS `bcp_re_agent`;
CREATE TABLE `bcp_re_agent` (
  `username` varchar(125) COLLATE utf8_bin NOT NULL,
  `processType` varchar(100) COLLATE utf8_bin NOT NULL DEFAULT '',
  `beginDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `assignee` varchar(125) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`username`,`processType`,`assignee`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of bcp_re_agent
-- ----------------------------

-- ----------------------------
-- Table structure for bcp_re_buttons
-- ----------------------------
DROP TABLE IF EXISTS `bcp_re_buttons`;
CREATE TABLE `bcp_re_buttons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `processDefId` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `processDefName` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `nodeId` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `nodeName` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `buttons` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '1：审批，\r\n2：驳回，\r\n3：终止，\r\n4：任务转发',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of bcp_re_buttons
-- ----------------------------

-- ----------------------------
-- Table structure for bcp_re_candidate
-- ----------------------------
DROP TABLE IF EXISTS `bcp_re_candidate`;
CREATE TABLE `bcp_re_candidate` (
  `processDefId` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `nodeId` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `nodeName` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `resourceType` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `resourceId` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `resourceName` varchar(2000) COLLATE utf8_bin DEFAULT NULL,
  `resourceNameText` varchar(2000) COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of bcp_re_candidate
-- ----------------------------

-- ----------------------------
-- Table structure for bcp_re_form
-- ----------------------------
DROP TABLE IF EXISTS `bcp_re_form`;
CREATE TABLE `bcp_re_form` (
  `id` int(50) NOT NULL AUTO_INCREMENT COMMENT '表单ID',
  `name` varchar(100) COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '表单名称',
  `type` varchar(100) COLLATE utf8_bin NOT NULL COMMENT '表单分类',
  `formurl` varchar(100) COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '表单URL',
  `description` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `status` varchar(10) COLLATE utf8_bin DEFAULT NULL COMMENT '状态',
  `creator` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT '创建者',
  `createTime` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT '创建时间',
  `processRef` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT '应用流程',
  `packageid` varchar(100) COLLATE utf8_bin NOT NULL COMMENT '流程包ID',
  `modelid` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_bcp_re_form_formurl_unique` (`formurl`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=COMPACT;


-- ----------------------------
-- Records of bcp_re_form
-- ----------------------------

-- ----------------------------
-- Table structure for bcp_re_formbussinessmap
-- ----------------------------
DROP TABLE IF EXISTS `bcp_re_formbussinessmap`;
CREATE TABLE `bcp_re_formbussinessmap` (
  `processInstId` varchar(255) NOT NULL DEFAULT '',
  `processNodeId` varchar(255) NOT NULL DEFAULT '',
  `tableName` varchar(255) DEFAULT NULL,
  `formURL` varchar(255) DEFAULT NULL,
  `keyValue` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`processInstId`,`processNodeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of bcp_re_formbussinessmap
-- ----------------------------

-- ----------------------------
-- Table structure for bcp_re_formcategory
-- ----------------------------
DROP TABLE IF EXISTS `bcp_re_formcategory`;
CREATE TABLE `bcp_re_formcategory` (
  `ID` varchar(100) COLLATE utf8_bin NOT NULL DEFAULT '',
  `name` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `parentID` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `path` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of bcp_re_formcategory
-- ----------------------------

-- ----------------------------
-- Table structure for bcp_re_orgcatelog
-- ----------------------------
DROP TABLE IF EXISTS `bcp_re_orgcatelog`;
CREATE TABLE `bcp_re_orgcatelog` (
  `catelogId` tinyint(4) NOT NULL AUTO_INCREMENT,
  `catelogName` varchar(255) DEFAULT NULL,
  `catelogDesc` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`catelogId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- ----------------------------
-- Records of bcp_re_orgcatelog
-- ----------------------------

-- ----------------------------
-- Table structure for bcp_re_orgpart
-- ----------------------------
DROP TABLE IF EXISTS `bcp_re_orgpart`;
CREATE TABLE `bcp_re_orgpart` (
  `dimensionType` tinyint(4) DEFAULT NULL COMMENT ' 0:项目； 1：部门',
  `catelogId` tinyint(4) DEFAULT NULL,
  `partId` smallint(6) NOT NULL AUTO_INCREMENT,
  `partName` varchar(255) DEFAULT NULL,
  `partDesc` varchar(500) DEFAULT NULL,
  `orgPath` varchar(255) DEFAULT NULL,
  `level` tinyint(4) DEFAULT NULL,
  `parentPartId` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`partId`),
  KEY `IndexOrgPath` (`orgPath`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of bcp_re_orgpart
-- ----------------------------
INSERT INTO `bcp_re_orgpart` VALUES ('1', null, '1', '根部门', '根部门不可删除', '1', '0', null);

-- ----------------------------
-- Table structure for bcp_re_orgpost
-- ----------------------------
DROP TABLE IF EXISTS `bcp_re_orgpost`;
CREATE TABLE `bcp_re_orgpost` (
  `dimensionType` tinyint(4) DEFAULT NULL COMMENT ' 0:项目； 1：部门',
  `catelogId` tinyint(4) DEFAULT NULL,
  `partId` smallint(6) DEFAULT NULL,
  `postId` smallint(6) NOT NULL AUTO_INCREMENT,
  `postName` varchar(255) DEFAULT NULL,
  `postDesc` varchar(500) DEFAULT NULL,
  `level` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`postId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- ----------------------------
-- Records of bcp_re_orgpost
-- ----------------------------

-- ----------------------------
-- Table structure for bcp_re_orgrank
-- ----------------------------
DROP TABLE IF EXISTS `bcp_re_orgrank`;
CREATE TABLE `bcp_re_orgrank` (
  `catelogId` tinyint(4) DEFAULT NULL,
  `rankId` smallint(6) NOT NULL AUTO_INCREMENT,
  `rankName` varchar(255) DEFAULT NULL,
  `rankDesc` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`rankId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of bcp_re_orgrank
-- ----------------------------

-- ----------------------------
-- Table structure for bcp_re_processform
-- ----------------------------
DROP TABLE IF EXISTS `bcp_re_processform`;
CREATE TABLE `bcp_re_processform` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `processDefId` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `processDefName` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `nodeId` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT '0: 全局表单',
  `nodeName` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `terminalTypeId` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `formId` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `formName` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `isHiddenComment` tinyint(1) DEFAULT NULL,
  `formURL` varchar(500) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=COMPACT;

-- ----------------------------
-- Table structure for bcp_re_processnode
-- ----------------------------
DROP TABLE IF EXISTS `bcp_re_processnode`;
CREATE TABLE `bcp_re_processnode` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `processDefId` varchar(100) NOT NULL,
  `processDefName` varchar(255) DEFAULT NULL,
  `nodeId` varchar(100) NOT NULL,
  `nodeName` varchar(255) DEFAULT NULL,
  `nodeType` varchar(255) DEFAULT NULL COMMENT 'userTask, serviceTask, gateway等。。',
  `nextNodeId` varchar(100) NOT NULL COMMENT '后续节点ID',
  `nextNodeName` varchar(255) DEFAULT NULL COMMENT '后续节点名称',
  `multiInstanceType` char(10) DEFAULT '0',
  `organzation_config` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of bcp_re_processnode
-- ----------------------------

-- ----------------------------
-- Table structure for bcp_re_rule
-- ----------------------------
DROP TABLE IF EXISTS `bcp_re_rule`;
CREATE TABLE `bcp_re_rule` (
  `processDefId` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `processDefName` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `currentNodeType` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `currentNodeId` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `currentNodeName` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `nextNodeId` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `nextNodeName` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `jumpToNodeId` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `jumptoNodeName` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `ruleName` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `ruleScript` varchar(2000) COLLATE utf8_bin DEFAULT NULL,
  `serviceType` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '服务类型，现只支持rest',
  `serviceURL` varchar(5000) COLLATE utf8_bin DEFAULT NULL COMMENT 'serviceTask专用 。现主要指rest服务地址',
  `variableName` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '变量名。多个变量名用, 隔开',
  `ruleOrder` int(11) DEFAULT NULL,
  `note` varchar(1000) COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=COMPACT;



-- ----------------------------
-- Table structure for bcp_re_universalagent
-- ----------------------------
DROP TABLE IF EXISTS `bcp_re_universalagent`;
CREATE TABLE `bcp_re_universalagent` (
  `username` varchar(100) NOT NULL DEFAULT '',
  `beginDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `assignees` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of bcp_re_universalagent
-- ----------------------------

-- ----------------------------
-- Table structure for bcp_re_userinfo
-- ----------------------------
DROP TABLE IF EXISTS `bcp_re_userinfo`;
CREATE TABLE `bcp_re_userinfo` (
  `userId` int(11) DEFAULT NULL,
  `type` smallint(6) DEFAULT NULL COMMENT '0: 项目; 1: 部门; 2: 职位; 3: 岗位; 4: 区域责任人; 5: 区域人员',
  `value` int(11) DEFAULT NULL,
  KEY `IndexUserId` (`userId`) USING BTREE,
  KEY `IndexType` (`type`) USING BTREE,
  KEY `IndexValue` (`value`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of bcp_re_userinfo
-- ----------------------------

-- ----------------------------
-- Table structure for bcp_re_variable
-- ----------------------------
DROP TABLE IF EXISTS `bcp_re_variable`;
CREATE TABLE `bcp_re_variable` (
  `varId` int(11) NOT NULL AUTO_INCREMENT,
  `processDefId` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `processDefName` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `nodeId` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `varName` varchar(60) COLLATE utf8_bin DEFAULT NULL,
  `varDatatype` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `varType` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '自定义变量:selfdefine、表单变量:form、ESB输出变量:ESBOutput',
  `formName` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `formId` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '关联表单时，指表单ID；若varType=ESBOutput，此字段表示流程节点ID',
  `formItemId` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `note` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`varId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=COMPACT;


-- ----------------------------
-- Table structure for bcp_re_workgroup
-- ----------------------------
DROP TABLE IF EXISTS `bcp_re_workgroup`;
CREATE TABLE `bcp_re_workgroup` (
  `groupId` int(11) NOT NULL AUTO_INCREMENT,
  `groupName` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `orgType` varchar(255) DEFAULT NULL,
  `creattime` date DEFAULT NULL,
  PRIMARY KEY (`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of bcp_re_workgroup
-- ----------------------------

-- ----------------------------
-- Table structure for calendar
-- ----------------------------
DROP TABLE IF EXISTS `calendar`;
CREATE TABLE `calendar` (
  `ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `LOGIN_NAME` varchar(100) DEFAULT NULL COMMENT '用户名称',
  `EVENT_ID` varchar(13) DEFAULT NULL COMMENT '事件ID',
  `TITLE` varchar(50) DEFAULT NULL COMMENT '事件标题',
  `CONTENT` varchar(1000) DEFAULT NULL COMMENT '事件内容',
  `START` datetime DEFAULT NULL COMMENT '事件开始时间',
  `END` datetime DEFAULT NULL COMMENT '事件结束时间',
  `LEVEL` tinyint(2) unsigned DEFAULT '1' COMMENT '1：一般,2：重要,3：非常重要',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='我的日程事件记录表';

-- ----------------------------
-- Records of calendar
-- ----------------------------

-- ----------------------------
-- Table structure for workbench_module
-- ----------------------------
DROP TABLE IF EXISTS `workbench_module`;
CREATE TABLE `workbench_module` (
  `ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `LOGIN_NAME` varchar(100) DEFAULT NULL COMMENT '登录名称',
  `MODULE_ID` smallint(3) NOT NULL COMMENT '模块ID',
  `MODULE_NAME` varchar(100) DEFAULT NULL COMMENT '模块名称',
  `M_SHOW` tinyint(1) unsigned DEFAULT '1' COMMENT '是否显示模块,0：不显示，1：显示',
  `M_ORDER` smallint(3) DEFAULT '1' COMMENT '显示顺序',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='我的工作台 模块显示';

-- ----------------------------
-- Records of workbench_module
-- ----------------------------

-- ----------------------------
-- Table structure for enterprise_info
-- ----------------------------
DROP TABLE IF EXISTS `enterprise_info`;
CREATE TABLE `enterprise_info` (
  `ID` tinyint(4) NOT NULL,
  `ENTERPRISE` varchar(200) DEFAULT NULL,
  `EMPLOYEES` smallint(6) DEFAULT NULL,
  `DEVICES` smallint(6) DEFAULT NULL,
  `ADDRESS` varchar(400) DEFAULT NULL,
  `POSTCODE` varchar(10) DEFAULT NULL,
  `LEGAL_PERSON` varchar(100) DEFAULT NULL,
  `CONTACT_NUMBER` varchar(50) DEFAULT NULL,
  `CONTACT_NAME` varchar(50) DEFAULT NULL,
  `BUSINESS_SCOPE` varchar(200) DEFAULT NULL,
  `INTRODUCE` varchar(500) DEFAULT NULL,
  `TAG` varchar(50) DEFAULT NULL,
  `LOGO` varchar(100) DEFAULT NULL,
  `INDUSTRY` varchar(50) DEFAULT NULL,
  `MAX_USERS` int(11) DEFAULT NULL,
  `ONLINE_USERS` int(11) DEFAULT NULL,
  `MAX_TERMINALS` int(11) DEFAULT NULL,
  `ONLINE_TERMINALS` int(11) DEFAULT NULL,
  `PRODUCT_ID` int(11) DEFAULT NULL,
  `COMMENCE_TIME` datetime DEFAULT NULL,
  `EXPIRATION_TIME` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of enterprise_info
-- ----------------------------
INSERT INTO `enterprise_info` VALUES ('1', '', null, null, '', '', '', '', '', '', '', '', '', '', '10', '10', '2', '2', null, null, null);

-- ----------------------------
-- Table structure for multi_table_definition_table
-- ----------------------------
DROP TABLE IF EXISTS `multi_table_definition_table`;
CREATE TABLE `multi_table_definition_table` (
  `ID` varchar(100) NOT NULL,
  `DESCRIPTION` varchar(1500) DEFAULT NULL,
  `COMBINATIVE_TABLE` varchar(500) DEFAULT NULL,
  `PROJECT_NAME` varchar(100) DEFAULT NULL,
  `SCENE` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for multi_table_metadata_table
-- ----------------------------
DROP TABLE IF EXISTS `multi_table_metadata_table`;
CREATE TABLE `multi_table_metadata_table` (
  `ID` varchar(32) NOT NULL,
  `RESOURCE_ID` varchar(100) DEFAULT NULL,
  `TABLE_NAME` varchar(100) DEFAULT NULL,
  `TABLE_COLUMN_NAME` varchar(100) DEFAULT NULL,
  `RESOURCE_COLUMN_NAME` varchar(100) DEFAULT NULL,
  `DATABASE_NAME` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for operator_res_extra
-- ----------------------------
DROP TABLE IF EXISTS `operator_res_extra`;
CREATE TABLE `operator_res_extra` (
  `KEY` varchar(50) NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `DESC` varchar(500) DEFAULT NULL,
  `FUNCTION_KEY` varchar(50) DEFAULT NULL,
  `PARENT_KEY` varchar(50) DEFAULT NULL,
  `URL` varchar(200) DEFAULT NULL,
  `METHOD` varchar(20) DEFAULT NULL,
  `STATUS` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`KEY`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `ID` tinyint(4) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(100) NOT NULL,
  `DESC` varchar(500) DEFAULT NULL,
  `DISOPERATOR_KEYS` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role
-- ----------------------------

-- ----------------------------
-- Table structure for single_table_definition_table
-- ----------------------------
DROP TABLE IF EXISTS `single_table_definition_table`;
CREATE TABLE `single_table_definition_table` (
  `TABLE_NAME` varchar(64) NOT NULL,
  `DESCRIPTION` varchar(600) DEFAULT NULL,
  `TABLE_TYPE` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`TABLE_NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of single_table_definition_table
-- ----------------------------

-- Table structure for sm_user_table
-- ----------------------------
DROP TABLE IF EXISTS `sm_user_table`;
CREATE TABLE `sm_user_table` (
  `USERID` int(11) NOT NULL AUTO_INCREMENT,
  `TENANT_ID` bigint(20) NOT NULL,
  `LOGIN_NAME` varchar(100) NOT NULL,
  `SUB_COMPANY_ID` int(11) DEFAULT NULL,
  `MOBILE` varchar(20) DEFAULT NULL,
  `EMAIL` varchar(200) DEFAULT NULL,
  `PASSWORD` varchar(100) DEFAULT NULL,
  `ROLE_ID` tinyint(4) DEFAULT NULL,
  `GENDER` varchar(10) DEFAULT NULL,
  `BIRTH_DATE` varchar(10) DEFAULT NULL,
  `PICTURE` varchar(200) DEFAULT NULL,
  `REAL_NAME` varchar(100) DEFAULT NULL,
  `NICK_NAME` varchar(100) DEFAULT NULL,
  `TAG` varchar(200) DEFAULT NULL,
  `STATUS` tinyint(4) NOT NULL DEFAULT '1',
  `CREATE_TIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `MODIFY_TIME` timestamp NULL DEFAULT NULL,
  `SIGNATURE` varchar(500) DEFAULT NULL,
  `DESCRIPTION` varchar(500) DEFAULT NULL,
  `USERNAME` varchar(200) DEFAULT NULL,
  `FULLNAME` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`USERID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sm_user_table
-- ----------------------------

-- ----------------------------
-- Table structure for tenant_menu
-- ----------------------------
DROP TABLE IF EXISTS `tenant_menu`;
CREATE TABLE `tenant_menu` (
  `KEY` varchar(50) NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `PARENT_KEY` varchar(50) DEFAULT NULL,
  `URL` varchar(200) DEFAULT NULL,
  `STATUS` tinyint(4) DEFAULT NULL,
  `ORDER` smallint(8) DEFAULT NULL,
  `RANGE` tinyint(4) DEFAULT NULL,	-- 0全局菜单、1前台菜单，2后台菜单，运行平台不能有全局菜单，设计平台所有菜单都是0
  `TYPE` tinyint(4) DEFAULT NULL,	-- 0系统预定义菜单、1用户自定义菜单
  `ICON` varchar(50) DEFAULT NULL,
  `APPLICATIONID` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`KEY`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tenant_menu
-- ----------------------------
INSERT INTO `tenant_menu` VALUES 
('BCP_BPM_SETTING', '应用管理', 'BCP_BPM', '#', '1', '32766', '1','0', 'fa fa-road', ''),
('BCP_BPM_SYS', '系统管理', 'BCP_BPM', '#', '1', '32767', '1','0', 'fa fa-bullhorn', ''),
('BCP_BPM_SYS_MENU', '菜单管理', 'BCP_BPM_SYS', 'app-menu.html', '1', '1', '1','0', 'fa fa-wrench', ''),
('BCP_BPM_CONFIG_MANAGE', '应用部署', 'BCP_BPM_SETTING', 'process_form.html', '1', '1', '1','0', 'fa fa-bell', '');

-- ----------------------------
-- Records of tenant_menu RUNTIME需要执行
-- ----------------------------
-- INSERT INTO `tenant_menu` VALUES 
-- ('BCP_BPM_ORG', '项目管理', 'BCP_BPM', '#', '1', '3', '1','0', 'fa fa-comments'),
-- ('BCP_BPM_ORG_USERMANAGE', '用户管理', 'BCP_BPM_ORG', 'tenant_user_list.html', '1', '6', '1','0', 'fa fa-unlock');

-- ----------------------------
-- Records of tenant_menu
-- ----------------------------
-- INSERT INTO `tenant_menu` VALUES 
-- ('BCP_BPM_APPLY', '我的申请', 'BCP_BPM', '#', '0', '1', '1','0', 'fa fa-heart'),
-- ('BCP_BPM_APPLY_EXPANCES', '报销申请', 'BCP_BPM_APPLY', '#', '0', '4', '1','0', 'fa fa-gear'),
-- ('BCP_BPM_APPLY_HISTORY', '我的申请', 'BCP_BPM_APPLY', 'workflow-myapproval.html', '0', '1', '1','0', 'fa fa-star'),
-- ('BCP_BPM_APPLY_INITIATE', '发起流程', 'BCP_BPM_APPLY', 'workflow-initiate.html', '0', '2', '1','0', 'fa fa-film'),
-- ('BCP_BPM_APPLY_PURCHASE', '采购申请', 'BCP_BPM_APPLY', '#', '0', '3', '1','0', 'fa fa-signal'),
-- ('BCP_BPM_CLIENT_SETTING', '个人设置', 'BCP_BPM', '#', '0', '3', '1','0', 'fa fa-magnet'),
-- ('BCP_BPM_CLIENT_SETTING_PROXY', '任务委托', 'BCP_BPM_CLIENT_SETTING', 'workflow-proxy-setup.html', '0', '1', '1','0', 'fa fa-comments'),
-- ('BCP_BPM_CLIENT_SETTING_USERINFO', '个人信息', 'BCP_BPM_CLIENT_SETTING', '#', '0', '2', '1','0', 'fa fa-square-o'),
-- ('BCP_BPM_INSTANCE', '流程管理', 'BCP_BPM', '#', '1', '5', '1','0', 'fa fa-heart'),
-- ('BCP_BPM_INSTANCE_HISTORY', '流程历史管理', 'BCP_BPM_INSTANCE', 'workflow-historical-list.html', '0', '3', '1','0', 'fa fa-signal'),
-- ('BCP_BPM_INSTANCE_MONITOR', '流程实例监控', 'BCP_BPM_INSTANCE', '#', '0', '2', '1','0', 'fa fa-film'),
-- ('BCP_BPM_INSTANCE_TASK', '流程任务管理', 'BCP_BPM_INSTANCE', 'workflow-task-list.html', '0', '1', '1','0', 'fa fa-star'),
-- ('BCP_BPM_INSTANCE_TIME', '流程耗时管理', 'BCP_BPM_INSTANCE', '#', '0', '4', '1','0', 'fa fa-gear'),
-- ('BCP_BPM_MYAPPROVE', '我的审批', 'BCP_BPM', '#', '1', '2', '1','0', 'fa fa-road'),
-- ('BCP_BPM_MYAPPROVE_HISTORY', '我已审批', 'BCP_BPM_MYAPPROVE', 'workflow-approved.html', '0', '2', '1','0', 'fa fa-crosshairs'),
-- ('BCP_BPM_MYAPPROVE_WAITTING', '待我审批', 'BCP_BPM_MYAPPROVE', 'workflow-approving.html', '0', '1', '1','0', 'fa fa-book'),
-- ('BCP_BPM_ORG', '项目管理', 'BCP_BPM', '#', '0', '3', '1','0', 'fa fa-comments'),
-- ('BCP_BPM_ORG_CATALOG', '组织类型', 'BCP_BPM_ORG', 'bcp_org_catelog.html', '0', '5', '1','0', 'fa fa-github'),
-- ('BCP_BPM_ORG_DEPT', '部门管理', 'BCP_BPM_ORG', 'bcp_org_part.html', '0', '1', '1','0', 'fa fa-square-o'),
-- ('BCP_BPM_ORG_POST', '岗位管理', 'BCP_BPM_ORG', 'org-rank-list.html', '0', '2', '1','0', 'fa fa-bookmark-o'),
-- ('BCP_BPM_ORG_RANK', '职位管理', 'BCP_BPM_ORG', 'org-post-list.html', '0', '3', '1','0', 'fa fa-phone-square'),
-- ('BCP_BPM_ORG_ROLE', '角色管理', 'BCP_BPM_ORG', 'role-main.html', '0', '4', '1','0', 'fa fa-facebook'),
-- ('BCP_BPM_ORG_USERINFO', '用户信息', 'BCP_BPM_ORG', 'org_userinfo_list.html', '0', '7', '1','0', 'fa fa-rss'),
-- ('BCP_BPM_ORG_USERMANAGE', '用户管理', 'BCP_BPM_ORG', 'tenant_user_list.html', '0', '6', '1','0', 'fa fa-unlock'),
-- ('BCP_BPM_SETTING', '应用管理', 'BCP_BPM', '#', '1', '1', '1','0', 'fa fa-road'),
-- ('BCP_BPM_SETTING_EXPENCES', '报销流程配置', 'BCP_BPM_SETTING', '#', '0', '2', '1','0', 'fa fa-crosshairs'),
-- ('BCP_BPM_SETTING_LEAVE', '请假流程配置', 'BCP_BPM_SETTING', '#', '0', '1', '1','0', 'fa fa-book'),
-- ('BCP_BPM_SETTING_PURCHASE', '采购流程配置', 'BCP_BPM_SETTING', '#', '0', '3', '1','0', 'fa fa-magnet'),
-- ('BCP_BPM_SYS', '系统管理', 'BCP_BPM', '#', '1', '7', '1','0', 'fa fa-bullhorn'),
-- ('BCP_BPM_SYS_LOG', '系统日志', 'BCP_BPM_SYS', '#', '0', '3', '1','0', 'fa fa-tasks'),
-- ('BCP_BPM_SYS_MENU', '菜单管理', 'BCP_BPM_SYS', 'workflow-application-menu.html', '1', '2', '1','0', 'fa fa-wrench'),
-- ('BCP_BPM_SYS_PARAM', '常规参数', 'BCP_BPM_SYS', '#', '0', '1', '1','0', 'fa fa-bell'),
-- ('BCP_BPM_TEST_MANAGE', '流程测试管理', '#', 'workflow-test_form.html', '0', '6', '1','0', 'fa fa-bell'),
-- ('BCP_BPM_CONFIG_MANAGE', '应用部署', 'BCP_BPM_SETTING', 'operation_process_deploy.html', '1', '5', '1','0', 'fa fa-bell');

-- ----------------------------
-- Records of tenant_menu 开发联调临时菜单：MAO1.0功能对比
-- ----------------------------
-- INSERT INTO `tenant_menu` VALUES ('COS_process', '流程管理(旧)', 'BCP_BPM', '/bpm/cos/jump-page/chenbo-formtype.html', 0, 15, 2, 0, 'fa fa-comments');
-- INSERT INTO `tenant_menu` VALUES ('COS_process_deploy', '流程部署', 'COS_process', '/bpm/cos/jump-page/processUploadandDeploy.html', 0, 16, 2, 0, 'fa fa-comments');
-- INSERT INTO `tenant_menu` VALUES ('COS_process_history', '流程历史管理', 'COS_process', '/bpm/cos/jump-page/yzm-historicalList.html', 0, 18, 2, 0, 'fa fa-comments');
-- INSERT INTO `tenant_menu` VALUES ('COS_process_inst', '流程实例管理', 'COS_process', '/bpm/cos/jump-page/yzm-processinstance.html', 0, 19, 2, 0, 'fa fa-comments');
-- INSERT INTO `tenant_menu` VALUES ('COS_process_list', '流程模型列表', 'COS_process', '/bpm/cos/jump-page/zl-processDefList-serverPaging.html', 0, 17, 2, 0, 'fa fa-comments');
-- INSERT INTO `tenant_menu` VALUES ('COS_process_monitor', '流程监控', 'CMS_monitor', '/bpm/cos/jump-page/zl_eventmonitor.html', 0, 31, 2, 0, 'fa fa-comments');
-- INSERT INTO `tenant_menu` VALUES ('COS_process_monitor_event', '事件监控', 'COS_process_monitor', '/bpm/cos/jump-page/zl_eventmonitor.html', 0, 31, 2, 0, 'fa fa-comments');
-- INSERT INTO `tenant_menu` VALUES ('COS_process_monitor_service', '服务监控', 'COS_process_monitor', '/bpm/cos/jump-page/zl_servicemonitor.html', 0, 32, 2, 0, 'fa fa-comments');
-- INSERT INTO `tenant_menu` VALUES ('COS_process_monitor_task', '用户任务监控', 'COS_process_monitor', '/bpm/cos/jump-page/zl_taskmonitor.html', 0, 33, 2, 0, 'fa fa-comments');
-- INSERT INTO `tenant_menu` VALUES ('COS_process_task', '流程任务管理', 'COS_process', '/bpm/cos/jump-page/yzm-tasklist.html', 0, 20, 2, 0, 'fa fa-comments');

-- INSERT INTO `tenant_menu` VALUES ('COS_workspace', '与我相关(旧)', 'BCP_BPM', '/bpm/cos/jump-page/chenbo-formtype.html', 0, 15, 1, 1, 'fa fa-comments');
-- INSERT INTO `tenant_menu` VALUES ('COS_workspace_apply', '我的申请', 'COS_workspace', '/bpm/cos/jump-page/chenbo-processinstance.html', 0, 22, 1, 1, 'fa fa-comments');
-- INSERT INTO `tenant_menu` VALUES ('COS_workspace_approval', '待我审批', 'COS_workspace', '/bpm/cos/jump-page/chenbo-approval_todo.html', 0, 23, 1, 1, 'fa fa-comments');
-- INSERT INTO `tenant_menu` VALUES ('COS_workspace_approved', '我已审批', 'COS_workspace', '/bpm/cos/jump-page/chenbo-approval_done.html', 0, 24, 1, 1, 'fa fa-comments');
-- INSERT INTO `tenant_menu` VALUES ('COS_workspace_settint', '我的设置', 'COS_workspace', '/bpm/cos/jump-page/chenbo-setup.html', 0, 28, 1, 1, 'fa fa-comments');


DROP TABLE IF EXISTS `bcp_re_import_process`;
CREATE TABLE `bcp_re_import_process` (
   `id` bigint(200) NOT NULL AUTO_INCREMENT,
  `process_package_version` varchar(255) NOT NULL,
  `process_packageName` varchar(255) DEFAULT NULL,
  `process_def_id` varchar(255) DEFAULT NULL,
  `import_userName` varchar(255) DEFAULT NULL,
  `status` char(10) DEFAULT '0',
  `import_time` datetime DEFAULT NULL,
  `process_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
-- ----------------------------
-- View structure for bcpreorgpost_bcpreorgpart_bcpreorgcatelog
-- ----------------------------
DROP VIEW IF EXISTS `bcpreorgpost_bcpreorgpart_bcpreorgcatelog`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%` SQL SECURITY DEFINER  VIEW `bcpreorgpost_bcpreorgpart_bcpreorgcatelog` AS SELECT
	`bcp_re_orgpost`.`dimensionType` AS `bcp_re_orgpost$$dimensionType`,
	`bcp_re_orgpost`.`catelogId` AS `bcp_re_orgpost$$catelogId`,
	`bcp_re_orgpost`.`partId` AS `bcp_re_orgpost$$partId`,
	`bcp_re_orgpost`.`postId` AS `bcp_re_orgpost$$postId`,
	`bcp_re_orgpost`.`postName` AS `bcp_re_orgpost$$postName`,
	`bcp_re_orgpost`.`postDesc` AS `bcp_re_orgpost$$postDesc`,
	`bcp_re_orgpost`.`level` AS `bcp_re_orgpost$$level`,
	`bcp_re_orgpart`.`dimensionType` AS `bcp_re_orgpart$$dimensionType`,
	`bcp_re_orgpart`.`catelogId` AS `bcp_re_orgpart$$catelogId`,
	`bcp_re_orgpart`.`partId` AS `bcp_re_orgpart$$partId`,
	`bcp_re_orgpart`.`partName` AS `bcp_re_orgpart$$partName`,
	`bcp_re_orgpart`.`partDesc` AS `bcp_re_orgpart$$partDesc`,
	`bcp_re_orgpart`.`orgPath` AS `bcp_re_orgpart$$orgPath`,
	`bcp_re_orgpart`.`level` AS `bcp_re_orgpart$$level`,
	`bcp_re_orgpart`.`parentPartId` AS `bcp_re_orgpart$$parentPartId`,
	`bcp_re_orgcatelog`.`catelogId` AS `bcp_re_orgcatelog$$catelogId`,
	`bcp_re_orgcatelog`.`catelogName` AS `bcp_re_orgcatelog$$catelogName`,
	`bcp_re_orgcatelog`.`catelogDesc` AS `bcp_re_orgcatelog$$catelogDesc`
FROM
	(
		(
			`bcp_re_orgpost`
			LEFT JOIN `bcp_re_orgpart` ON (
				(
					(
						`bcp_re_orgpost`.`dimensionType` = `bcp_re_orgpart`.`dimensionType`
					)
					AND (
						`bcp_re_orgpost`.`partId` = `bcp_re_orgpart`.`partId`
					)
				)
			)
		)
		LEFT JOIN `bcp_re_orgcatelog` ON (
			(
				`bcp_re_orgpost`.`catelogId` = `bcp_re_orgcatelog`.`catelogId`
			)
		)
	);

-- ----------------------------
-- View structure for bcpview_org_rankcatelog
-- ----------------------------
DROP VIEW IF EXISTS `bcpview_org_rankcatelog`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%` SQL SECURITY DEFINER  VIEW `bcpview_org_rankcatelog` AS select `b`.`catelogId` AS `CATELOGID`,`b`.`catelogName` AS `CATELOGNAME`,`a`.`rankId` AS `RANKID`,`a`.`rankName` AS `RANKNAME`,`a`.`rankDesc` AS `RANKDESC` from (`bcp_re_orgrank` `a` join `bcp_re_orgcatelog` `b`) where (`a`.`catelogId` = `b`.`catelogId`) ;

-- ----------------------------
-- View structure for bcpview_re_gateway
-- ----------------------------
DROP VIEW IF EXISTS `bcpview_re_gateway`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%` SQL SECURITY DEFINER  VIEW `bcpview_re_gateway` AS SELECT
	`bcp_re_rule`.`processDefId` AS `processDefId`,
	`bcp_re_rule`.`processDefName` AS `processDefName`,
	`bcp_re_rule`.`currentNodeType` AS `currentNodeType`,
	`bcp_re_rule`.`currentNodeId` AS `currentNodeId`,
	`bcp_re_rule`.`currentNodeName` AS `currentNodeName`,
	`bcp_re_rule`.`nextNodeId` AS `nextNodeId`,
	`bcp_re_rule`.`nextNodeName` AS `nextNodeName`,
	`bcp_re_rule`.`jumpToNodeId` AS `jumpToNodeId`,
	`bcp_re_rule`.`jumptoNodeName` AS `jumptoNodeName`,
	`bcp_re_rule`.`ruleName` AS `ruleName`,
	`bcp_re_rule`.`ruleScript` AS `ruleScript`,
	`bcp_re_rule`.`ruleOrder` AS `ruleOrder`,
	`bcp_re_rule`.`note` AS `note`,
	`bcp_re_rule`.`serviceType` AS `serviceType`,
	`bcp_re_rule`.`serviceURL` AS `serviceURL`,
	`bcp_re_rule`.`variableName` AS `variableName`
FROM
	`bcp_re_rule`
WHERE
	(
		`bcp_re_rule`.`currentNodeType` = 'exclusiveGateway'
	) ;

-- ----------------------------
-- View structure for bcpview_re_servicetask
-- ----------------------------
DROP VIEW IF EXISTS `bcpview_re_servicetask`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%` SQL SECURITY DEFINER  VIEW `bcpview_re_servicetask` AS SELECT
	`bcp_re_rule`.`processDefId` AS `processDefId`,
	`bcp_re_rule`.`processDefName` AS `processDefName`,
	`bcp_re_rule`.`currentNodeType` AS `currentNodeType`,
	`bcp_re_rule`.`currentNodeId` AS `currentNodeId`,
	`bcp_re_rule`.`currentNodeName` AS `currentNodeName`,
	`bcp_re_rule`.`nextNodeId` AS `nextNodeId`,
	`bcp_re_rule`.`nextNodeName` AS `nextNodeName`,
	`bcp_re_rule`.`jumpToNodeId` AS `jumpToNodeId`,
	`bcp_re_rule`.`jumptoNodeName` AS `jumptoNodeName`,
	`bcp_re_rule`.`ruleName` AS `ruleName`,
	`bcp_re_rule`.`ruleScript` AS `ruleScript`,
	`bcp_re_rule`.`ruleOrder` AS `ruleOrder`,
	`bcp_re_rule`.`note` AS `note`,
	`bcp_re_rule`.`serviceType` AS `serviceType`,
	`bcp_re_rule`.`serviceURL` AS `serviceURL`,
	`bcp_re_rule`.`variableName` AS `variableName`
FROM
	`bcp_re_rule`
WHERE
	(
		`bcp_re_rule`.`currentNodeType` = 'serviceTask'
	) ;

-- ----------------------------
-- View structure for bcpview_user_part
-- ----------------------------
DROP VIEW IF EXISTS `bcpview_user_part`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%` SQL SECURITY DEFINER  VIEW `bcpview_user_part` AS SELECT
	`BCP_RE_USERINFO`.`USERID` AS `USERID`,
	`BCP_RE_USERINFO`.`VALUE` AS `PARTID`
FROM
	`BCP_RE_USERINFO`
WHERE
	(
		`BCP_RE_USERINFO`.`TYPE` IN (0, 1)
	) ;

-- ----------------------------
-- View structure for bcpview_user_post
-- ----------------------------
DROP VIEW IF EXISTS `bcpview_user_post`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%` SQL SECURITY DEFINER  VIEW `bcpview_user_post` AS SELECT
	`BCP_RE_USERINFO`.`USERID` AS `USERID`,
	`BCP_RE_USERINFO`.`VALUE` AS `POSTID`
FROM
	`BCP_RE_USERINFO`
WHERE
	(`BCP_RE_USERINFO`.`TYPE` = 2) ;

-- ----------------------------
-- View structure for bcpview_user_part_post
-- ----------------------------
DROP VIEW IF EXISTS `bcpview_user_part_post`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%` SQL SECURITY DEFINER  VIEW `bcpview_user_part_post` AS SELECT
	`A`.`USERID` AS `USERID`,
	`A`.`PARTID` AS `PARTID`,
	`B`.`POSTID` AS `POSTID`,
	`C`.`POSTNAME` AS `POSTNAME`,
	`C`.`DIMENSIONTYPE` AS `DIMENSIONTYPE`,
	`C`.`CATELOGID` AS `CATELOGID`
FROM
	(
		(
			`BCPVIEW_USER_PART` `A`
			JOIN `BCPVIEW_USER_POST` `B` ON (
				(`A`.`USERID` = `B`.`USERID`)
			)
		)
		JOIN `BCP_RE_ORGPOST` `C` ON (
			(`B`.`POSTID` = `C`.`POSTID`)
		)
	)
ORDER BY
	`C`.`POSTID` ;

-- ----------------------------
-- View structure for databasetime_view
-- ----------------------------
DROP VIEW IF EXISTS `databasetime_view`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%`  VIEW `databasetime_view` AS SELECT
	NOW() nowdate ;

-- ----------------------------
-- View structure for table_definition_view
-- ----------------------------
DROP VIEW IF EXISTS `table_definition_view`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%`  VIEW `table_definition_view` AS SELECT
	stdt.TABLE_NAME AS `TABLE_NAME`,
	stdt.DESCRIPTION AS `DESCRIPTION`,
	stdt.TABLE_TYPE AS `TABLE_TYPE`
FROM
	SINGLE_TABLE_DEFINITION_TABLE stdt
UNION
	SELECT
		mtdt.ID AS `TABLE_NAME`,
		mtdt.DESCRIPTION AS `DESCRIPTION`,
		'2' AS `TABLE_TYPE`
	FROM
		MULTI_TABLE_DEFINITION_TABLE mtdt
	WHERE mtdt.SCENE = 1 ;

-- ----------------------------
-- 数据模型基础信息表
-- ----------------------------
DROP TABLE IF EXISTS `DATA_MODEL_INFO_TABLE`;
CREATE TABLE `DATA_MODEL_INFO_TABLE` (
  `ID` varchar(100) NOT NULL,-- 数据模型ID
  `NAME` varchar(200) NOT NULL,-- 数据模型名称
  `DESCRIPTION` text(2000) DEFAULT NULL,-- 数据模型描述
  `SCENE` int(2) NOT NULL,-- 1:现有表 2:新建表 3:自定义SQL
  `CREATOR` varchar(200) NOT NULL,-- 创建者
  `CREATE_TIME` datetime NOT NULL,-- 创建时间
  `UPDATE_TIME` datetime NOT NULL,-- 更新时间
  `BIND_TABLE_NAME` varchar(100) NOT NULL, -- 现有表 
  `SCRIPT` blob NULL, -- 现有表
  `I18N` varchar(200) NULL, -- 国际化文件名
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- 数据模型数据项表
-- ----------------------------
DROP TABLE IF EXISTS `DATA_MODEL_ITEM_TABLE`;
CREATE TABLE `DATA_MODEL_ITEM_TABLE` (
  `ID` varchar(60) NOT NULL,-- 数据项ID
  `NAME` varchar(200) NOT NULL,-- 数据项名称
  `MODEL_ID` varchar(100) NOT NULL,-- 数据模型ID
  `TYPE` int(3) NOT NULL,--  1:短文本,2:长文本,3:逻辑型,4:整数,5:浮点型,6:日期 
  `IS_NULL` int(1) DEFAULT '1',-- 是否允许为空 0:允许 1:不允许
  `COLUMN_KEY` int(1) DEFAULT '1',-- 是否为主键 1:是 0:不是
  `LENGTH` int(8) DEFAULT '0',-- 长度
  `DECIMAL` int(8) DEFAULT '0',-- 精度
  `DEFAULT` varchar(200) DEFAULT NULL,-- 缺省值
  `INDEX` int(100) NOT NULL AUTO_INCREMENT,
  `COMPONENT_TYPE` int(3) DEFAULT NULL,--  组件类型
  `UI_VISIBLE` int(1) DEFAULT '1',--  是否可见 1:可见 2:不可见
  `LAYOUT` int(2), --  布局 0:占半行，后面有其他控件 1:独占一行 2:占半行，后面为空
  `DATA_BLOCK` int(10) DEFAULT '0', -- 数据块，数据块数值大小为数据块的顺序
  PRIMARY KEY (`INDEX`),-- 序列号
  UNIQUE KEY `INDEX_DATA_MODEL_ITEM` (`ID`,`MODEL_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- 数据源表
-- ----------------------------
DROP TABLE IF EXISTS `DATA_SOURCE_INFO_TABLE`;
CREATE TABLE `DATA_SOURCE_INFO_TABLE` (
  `ID` varchar(100) NOT NULL,-- 数据源ID
  `NAME` varchar(200) NOT NULL,-- 数据源名称 
  `DESCRIPTION` text(2000) DEFAULT NULL,-- 数据源描述
  `ADAPTER_TYPE` int(10) NOT NULL,-- 1:内置ORM数据源 2:外部ORM数据源 3:JDBC数据源
  `HOST` varchar(100) NOT NULL,-- 主机地址
  `PORT` varchar(8) NOT NULL,-- 主机端口
  `SCHEMA` varchar(100) DEFAULT NULL,-- 数据库名/URI名
  `USER` varchar(100) DEFAULT NULL,-- 用户名
  `PASSWORD` varchar(100) DEFAULT NULL,-- 密码
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
-- ----------------------------
-- View structure for view_user_by_part
-- ----------------------------
DROP VIEW IF EXISTS `view_user_by_part`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%` SQL SECURITY DEFINER  VIEW `view_user_by_part` AS SELECT
	`sm_user_table`.`USERID` AS `USERID`,
	`sm_user_table`.`USERNAME` AS `USERNAME`,
	`sm_user_table`.`FULLNAME` AS `FULLNAME`,
	`sm_user_table`.`DESCRIPTION` AS `DESCRIPTION`,
	`sm_user_table`.`EMAIL` AS `EMAIL`,
	`bcp_re_orgpart`.`partName` AS `partName`,
	`bcp_re_orgpart`.`dimensionType` AS `dimensionType`,
	`bcp_re_orgpart`.`catelogId` AS `catelogId`,
	`bcp_re_orgpart`.`partId` AS `partId`,
	`bcp_re_orgcatelog`.`catelogName` AS `catelogName`
FROM
	(
		(
			(
				`sm_user_table`
				INNER JOIN `bcp_re_userinfo` ON (
					(
						`sm_user_table`.`USERID` = `bcp_re_userinfo`.`userId`
					)
				)
			)
			INNER JOIN  `bcp_re_orgpart` ON (
				(
					(
						`bcp_re_userinfo`.`value` = `bcp_re_orgpart`.`partId`
					)
					AND (
						`bcp_re_orgpart`.`dimensionType` = bcp_re_userinfo.type
					)
				)
			)
		)
		INNER JOIN `bcp_re_orgcatelog` ON (
			(
				`bcp_re_orgpart`.`catelogId` = `bcp_re_orgcatelog`.`catelogId`
			)
		)
	) ;

-- ----------------------------
-- View structure for view_user_membership_credentials
-- ----------------------------
DROP VIEW IF EXISTS `view_user_membership_credentials`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%` SQL SECURITY DEFINER  VIEW `view_user_membership_credentials` AS -- 0: 项目; 1: 部门; 2: 职位; 3: 岗位
SELECT
	sm_user_table.USERID AS USER_ID,
	sm_user_table.LOGIN_NAME AS LOGIN_NAME,
	sm_user_table.ROLE_ID AS ROLE_ID,
	userinfo_re_orgproject.`value` AS PROJECT_ID,
	userinfo_re_orgpart.`value` AS PART_ID,
	userinfo_re_orgpost.`value` AS POST_ID,
	userinfo_re_orgrank.`value` AS RANK_ID
FROM
	sm_user_table
LEFT JOIN bcp_re_userinfo userinfo_re_orgproject ON sm_user_table.USERID = userinfo_re_orgproject.userId
AND userinfo_re_orgproject.type = '0'
LEFT JOIN bcp_re_userinfo userinfo_re_orgpart ON sm_user_table.USERID = userinfo_re_orgpart.userId
AND userinfo_re_orgpart.type = '1'
LEFT JOIN bcp_re_userinfo userinfo_re_orgpost ON sm_user_table.USERID = userinfo_re_orgpost.userId
AND userinfo_re_orgpost.type = '2'
LEFT JOIN bcp_re_userinfo userinfo_re_orgrank ON sm_user_table.USERID = userinfo_re_orgrank.userId
AND userinfo_re_orgrank.type = '3' ;

DROP VIEW IF EXISTS `bcpview_org_userinfo`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%` SQL SECURITY DEFINER VIEW `bcpview_org_userinfo` AS 
SELECT DISTINCT
	`smuser`.`USERID` AS `userId`,
	`smuser`.`USERNAME` AS `username`,
	`project`.dimensionType AS projDimensionType,
	`project`.`catelogId` AS `projCatelogId`,
	`project`.`partId` AS `project`,
	`project`.`partName` AS `projectName`,
	`department`.`dimensionType` AS `partDimensionType`,
	`department`.`catelogId` AS `partCatelogId`,
	`department`.`partId` AS `partId`,
	`department`.`partName` AS `partName`,
	`post`.`postId` AS `postId`,
	`post`.`postName` AS `postName`,
	`rank`.`rankId` AS `rankId`,
	`rank`.`rankName` AS `rankName`
FROM
	(
		(
			(
				(
					(
						`sm_user_table` `smuser`
						LEFT JOIN `bcp_re_userinfo` `user` ON (
							(
								`user`.`userId` = `smuser`.`USERID`
							)
						)
					)
					LEFT JOIN `bcp_re_orgpart` `project` ON (
						(
							(`user`.`type` = 0)
							AND (
								`user`.`value` = `project`.`partId`
							)
							AND (
								`project`.`dimensionType` = 0
							)
						)
					)
				)
				LEFT JOIN `bcp_re_orgpart` `department` ON (
					(
						(`user`.`type` = 1)
						AND (
							`user`.`value` = `department`.`partId`
						)
						AND (
							`department`.`dimensionType` = 1
						)
					)
				)
			)
			LEFT JOIN `bcp_re_orgpost` `post` ON (
				(
					(`user`.`type` = 2)
					AND (
						`user`.`value` = `post`.`postId`
					)
				)
			)
		)
		LEFT JOIN `bcp_re_orgrank` `rank` ON (
			(
				(`user`.`type` = 3)
				AND (
					`user`.`value` = `rank`.`rankId`
				)
			)
		)
	)
WHERE
	`project`.`partId` IS NOT NULL
OR `department`.`partId` IS NOT NULL
OR `rank`.`rankId` IS NOT NULL
OR `post`.`postId` IS NOT NULL;

DROP VIEW IF EXISTS `bcpview_org_userpost`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%` SQL SECURITY DEFINER VIEW `bcpview_org_userpost` AS 
SELECT 
bcpview_org_userinfo.username,
bcp_re_orgpost.postId,
bcp_re_orgpost.postName,
bcpview_org_userinfo.userId
FROM 
bcpview_org_userinfo 
RIGHT OUTER JOIN bcp_re_orgpost ON bcp_re_orgpost.postId = bcpview_org_userinfo.postId;

DROP VIEW IF EXISTS bcpview_re_agent;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%` SQL SECURITY DEFINER VIEW `bcpview_re_agent` as 
select `bcp_re_agent`.`processType` AS `act_re_procdef$$NAME_`,`bcp_re_agent`.`processType` AS `bcp_re_agent$$processType`,`bcp_re_agent`.`beginDate` AS `bcp_re_agent$$beginDate`,`bcp_re_agent`.`endDate` AS `bcp_re_agent$$endDate`,`bcp_re_agent`.`assignee` AS `bcp_re_agent$$assignee` from `bcp_re_agent` ;

-- ----------------------------
-- View structure for bcpview_user_by_part_catelog
-- ----------------------------
DROP VIEW IF EXISTS `bcpview_user_by_part_catelog`;
CREATE  VIEW `bcpview_user_by_part_catelog` AS SELECT
	`sm_user_table`.`USERID` AS `USERID`,
	`sm_user_table`.`USERNAME` AS `USERNAME`,
	`sm_user_table`.`FULLNAME` AS `FULLNAME`,
	`sm_user_table`.`DESCRIPTION` AS `DESCRIPTION`,
	`sm_user_table`.`EMAIL` AS `EMAIL`,
	`bcp_re_orgpart`.`partName` AS `partName`,
	`bcp_re_orgpart`.`dimensionType` AS `dimensionType`,
	`bcp_re_orgpart`.`catelogId` AS `catelogId`,
	`bcp_re_orgpart`.`partId` AS `partId`,
	`bcp_re_orgcatelog`.`catelogName` AS `catelogName`
FROM
	(
		(
			(
				`sm_user_table`
				INNER JOIN `bcp_re_userinfo` ON (
					(
						`sm_user_table`.`USERID` = `bcp_re_userinfo`.`userId`
					)
				)
			)
			INNER JOIN  `bcp_re_orgpart` ON (
				(
					(
						`bcp_re_userinfo`.`value` = `bcp_re_orgpart`.`partId`
					)
					AND (
						`bcp_re_orgpart`.`dimensionType` = bcp_re_userinfo.type
					)
				)
			)
		)
		INNER JOIN `bcp_re_orgcatelog` ON (
			(
				`bcp_re_orgpart`.`catelogId` = `bcp_re_orgcatelog`.`catelogId`
			)
		)
	) ;

-- ----------------------------
-- View structure for `view_user_role`
-- ----------------------------
DROP VIEW IF EXISTS `view_user_role`;
CREATE VIEW `view_user_role` AS 
select `role`.`DISOPERATOR_KEYS` AS `DISOPERATOR_KEYS`,
`ur`.`LOGIN_NAME` AS `LOGIN_NAME`,
`ur`.`ROLE_ID` AS `ROLE_ID` 
from (`sm_user_table` `ur` join `role` on((`ur`.`ROLE_ID` = `role`.`ID`)));	

-- ----------------------------
-- View structure for `view_user_role`
-- ----------------------------
DROP VIEW IF EXISTS `operator_res`;
CREATE VIEW `operator_res` AS 
SELECT
	`operator_res_extra`.`KEY`,
	`operator_res_extra`.`NAME`,
	`operator_res_extra`.`PARENT_KEY`,
	`operator_res_extra`.`URL`,
	`operator_res_extra`.`STATUS`
FROM
	`operator_res_extra` where `operator_res_extra`.`STATUS`=1
UNION ALL
	SELECT
		`tenant_menu`.`KEY`,
		`tenant_menu`.`NAME`,
		`tenant_menu`.`PARENT_KEY`,
		`tenant_menu`.`URL`,
		`tenant_menu`.`STATUS`
	FROM
		`tenant_menu` where `tenant_menu`.`STATUS`=1;
		
-- ----------------------------
-- 流程包信息表分组视图
-- ----------------------------
DROP VIEW IF EXISTS `bcpview_import_package_group`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%` SQL SECURITY DEFINER  VIEW `bcpview_import_package_group` AS select * from bcp_re_import_process GROUP BY process_packageName ;

-- ----------------------------
-- 流程包过滤
-- ----------------------------
DROP VIEW IF EXISTS `bcpview_import_process_package`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%`  VIEW `bcpview_import_process_package` AS SELECT * FROM `bcp_re_import_process` where process_def_id IS NOT NULL ;
