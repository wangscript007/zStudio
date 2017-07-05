SET FOREIGN_KEY_CHECKS=0;

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
-- Table structure for process_res
-- ----------------------------
DROP TABLE IF EXISTS `process_res`;
CREATE TABLE `process_res` (
  `ID` int(20) NOT NULL AUTO_INCREMENT,
  `MODULE` varchar(20) NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `IP` varchar(20) NOT NULL,
  `PORT` varchar(10) NOT NULL,
  `CAPACITY` smallint(6) NOT NULL,
  `USED_CAPACITY` smallint(6) NOT NULL,
  `STATUS` tinyint(4) NOT NULL DEFAULT '2',
  `CREATED_TIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `INDEX_PROCESS_RES` (`MODULE`,`NAME`,`IP`,`PORT`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
-- Table structure for tenant
-- ----------------------------
DROP TABLE IF EXISTS `tenant`;
CREATE TABLE `tenant` (
  `ID` bigint(20) NOT NULL,
  `NAME` varchar(50) NOT NULL,
  `OA_ID` tinyint(4) DEFAULT NULL,
  `CREATE_TIME` timestamp NULL DEFAULT NULL,
  `TYPE` tinyint(4) DEFAULT 1,	-- 1 -普通租户, 2 - 演示租户
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `TENANT_ID` bigint(20) NOT NULL,
  `LOGIN_NAME` varchar(100) NOT NULL,
  `PASSWORD` varchar(100) NOT NULL,
  `MOBILE` varchar(20) DEFAULT NULL,
  `EMAIL` varchar(100) DEFAULT NULL,
  `REGIST_TIME` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`LOGIN_NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of terminal_register
-- ----------------------------

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
-- View structure for table_definition_view
-- ----------------------------

-- ----------------------------
-- Table structure for `portals_user`
-- ----------------------------
DROP TABLE IF EXISTS `portals_user`;
CREATE TABLE `portals_user` (
  `TENANT_ID` bigint(20) NOT NULL,
  `LOGIN_NAME` varchar(100) NOT NULL,
  `PASSWORD` varchar(100) NOT NULL,
  `SUB_COMPANY_ID` int(11) DEFAULT NULL,
  `MOBILE` varchar(20) DEFAULT NULL,
  `EMAIL` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`LOGIN_NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `portals_module`
-- ----------------------------
DROP TABLE IF EXISTS `portals_module`;
CREATE TABLE `portals_module` (
  `KEY` varchar(255) NOT NULL,
  `NAME` varchar(50) DEFAULT NULL,
  `PARENT_KEY` varchar(255) DEFAULT '',
  `URL` varchar(255) DEFAULT NULL,
  `ORDER` int(11) DEFAULT NULL,
  `STATUS` bit(1) DEFAULT b'1',
  `target` varchar(20) DEFAULT '_self',
  `REMARK` varchar(512) DEFAULT '',
  PRIMARY KEY (`KEY`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for portals_login_log
-- ----------------------------
DROP TABLE IF EXISTS `portals_login_log`;
CREATE TABLE `portals_login_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `tenant_id` bigint(20) DEFAULT NULL COMMENT '租户id',
  `login_name` varchar(100) DEFAULT NULL COMMENT '登陆名称',
  `login_type` varchar(10) DEFAULT NULL COMMENT '登陆/登出',
  `login_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '登陆/登出时间',
  `ip` varchar(20) DEFAULT NULL COMMENT 'ip',
  `user_agent` varchar(255) DEFAULT NULL COMMENT '浏览器信息',
  `remark` varchar(512) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for portals_operation_log
-- ----------------------------
DROP TABLE IF EXISTS `portals_operation_log`;
CREATE TABLE `portals_operation_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `tenant_id` bigint(20) DEFAULT NULL COMMENT '租户id',
  `login_name` varchar(100) DEFAULT NULL COMMENT '登陆名称',
  `operation_type` varchar(20) DEFAULT NULL COMMENT '操作类型(数据模型、表单、报表)',
  `operation_name` varchar(512) DEFAULT NULL COMMENT '操作名称',
  `operation_description` varchar(512) DEFAULT NULL COMMENT '操作描述',
  `operation_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '操作时间',
  `remark` varchar(512) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- ----------------------------
-- View structure for view_active_user
-- ----------------------------
DROP VIEW IF EXISTS `view_active_user`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%` SQL SECURITY DEFINER  VIEW `view_active_user` AS SELECT
	loginlog.id,
	loginlog.tenant_id,
	loginlog.login_name,
	loginlog.login_type,
	loginlog.login_time,
	loginlog.ip,
	loginlog.user_agent,
	loginlog.remark
FROM
	portals_login_log loginlog
WHERE
	DATEDIFF(
		NOW(),
		loginlog.login_time
	) < 30
AND DATEDIFF(
	NOW(),
	loginlog.login_time
) >- 1 ;

	
-- ----------------------------
-- View structure for view_active_user_distinct
-- ----------------------------
DROP VIEW IF EXISTS `view_active_user_distinct`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%` SQL SECURITY DEFINER  VIEW `view_active_user_distinct` AS SELECT DISTINCT
	tenant_id,
	login_name,
	date_format(login_time,'%Y%m%d') login_time
FROM
	view_active_user ;
	
-- ----------------------------
-- View structure for view_active_user_count
-- ----------------------------
DROP VIEW IF EXISTS `view_active_user_count`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%`  VIEW `view_active_user_count` AS SELECT
	DATE_FORMAT(login_time, '%Y%m%d') days,
	COUNT(1) active_user_count
FROM
	view_active_user_distinct
GROUP BY
	days ;

	
-- ----------------------------
-- View structure for view_active_user_info
-- ----------------------------
DROP VIEW IF EXISTS `view_active_user_info`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%`  VIEW `view_active_user_info` AS SELECT
	t2.tenant_id tenant_id,
	t2.login_name login_name,
	t2.mobile mobile,
	t2.email email,
	t1.ip ip,
	t1.login_time login_time
FROM
	view_active_user t1,
	USER t2
WHERE
	t1.login_name = t2.login_name
AND t1.tenant_id = t2.tenant_id ;

-- ----------------------------
-- View structure for view_tenant_count
-- ----------------------------
DROP VIEW IF EXISTS `view_tenant_count`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%` SQL SECURITY DEFINER  VIEW `view_tenant_count` AS SELECT
	COUNT(1) tenant_count,
	DATE_FORMAT(CREATE_TIME, '%Y%m%d') days
FROM
	tenant
GROUP BY
	days ;

-- ----------------------------
-- View structure for view_tenant_user
-- ----------------------------
DROP VIEW IF EXISTS `view_tenant_user`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%` SQL SECURITY DEFINER  VIEW `view_tenant_user` AS SELECT
	t1.id tenant_id,
	t1.name name,
	t1.create_time create_time,
	t2.login_name login_name,
	t2.mobile mobile,
	t2.email email,
	t2.regist_time regist_time
FROM
	tenant t1,
	USER t2
WHERE
	t1.id = t2.tenant_id ;

-- ----------------------------
-- View structure for view_tenant_user_count
-- ----------------------------
DROP VIEW IF EXISTS `view_tenant_user_count`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%`  VIEW `view_tenant_user_count` AS SELECT
	view_tenant_user.tenant_id tenant_id,
	view_tenant_user.`NAME` NAME,
	COUNT(
		view_tenant_user.login_name
	) users,
	view_tenant_user.create_time regist_time
FROM
	view_tenant_user
GROUP BY
	view_tenant_user.tenant_id ;

-- ----------------------------
-- View structure for view_user_count
-- ----------------------------
DROP VIEW IF EXISTS `view_user_count`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mao`@`%` SQL SECURITY DEFINER  VIEW `view_user_count` AS SELECT
	DATE_FORMAT(REGIST_TIME, '%Y%m%d') days,
	COUNT(1) user_count
FROM
	user
GROUP BY
	days ;
-- ----------------------------
-- Records of portals_module
-- ----------------------------
INSERT INTO `portals_module` VALUES ('CONTACT', '关于', '', 'aboutus.html', '6', '', '_self', null),
('CONTACT-ABOUTUS', '关于我们', 'CONTACT', 'aboutus.html', '0', '', '_self', ''),
('CONTACT-HELP', '在线帮助', '', 'help.html', '3', '', '_blank', ''),
('CONTACT-QUESTION', '问题反馈', 'CONTACT', 'https://github.com/51ksy/zStudio/issues', '2', '', '_blank', ''),
('HOMEPAGE', '首页', '', 'index.html', '0', '', '_self', null),
('PRODUCT', '云服务', '', 'datamodel.html', '1', '', '_self', null),
('PRODUCT-DATA', '图表设计', 'PRODUCT', 'zdata.html', '2', '', '_self', null),
('PRODUCT-DATAMODEL', '模型设计', 'PRODUCT', 'datamodel.html', '0', '', '_self', null),
('PRODUCT-FORMDESIGNER', '页面设计', 'PRODUCT', 'form.html', '1', '', '_self', null),
('RESOURCE', '下载', '', 'resource.html', '5', '', '_self', null),
('SERVICE', '演示', '', 'service.html', '2', '', '_self', null),
('SOLUTION', '案例', '', 'solution.html', '4', '', '_self', null),
('SOLUTION-APPCASE', '应用案例', 'SOLUTION', 'solution.html', '4', '', '_self', null),
('SOLUTION-EMBEDCASE', '集成案例', 'SOLUTION', 'solution-embed.html', '4', '', '_self', null);

-- ----------------------------
-- Records of portals_user
-- ----------------------------
INSERT INTO `portals_user` VALUES ('10001001', 'admin@mao', '08461B1BFF860F5D4E792B772AAE372D', null, null, null);
