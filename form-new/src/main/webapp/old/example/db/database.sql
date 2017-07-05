DROP TABLE IF EXISTS `id_name_demo`;
CREATE TABLE id_name_demo (
id  int(11) NOT NULL ,
name  varchar(100) ,
col1  varchar(100) ,
col2  varchar(100) ,
col3  varchar(100) ,
col4  varchar(100) ,
PRIMARY KEY (id)
);


SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `goods`
-- ----------------------------
DROP TABLE IF EXISTS `product_list_demo`;
CREATE TABLE `product_list_demo` (
  `ID` tinyint(4) NOT NULL DEFAULT '0',
  `GOODS_NAME` varchar(500) DEFAULT NULL,
  `GOODS_PRICE` decimal(10,0) DEFAULT NULL,
  `GOODS_PROVIDER` varchar(500) DEFAULT NULL,
  `GOODS_IMG_URL` varchar(500) DEFAULT NULL,
  `GOODS_STORE_PRICE` decimal(10,0) DEFAULT NULL,
  `SALE_NUMBER` int(11) DEFAULT NULL,
  `ESTIMATE` decimal(10,0) DEFAULT NULL,
  `DESCRIPTION` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of goods
-- ----------------------------
INSERT INTO `product_list_demo` VALUES ('0', 'Apple iPhone 6s Plus (A1699) 64G 玫瑰金色 移动联通电信4G手机', '5000', '苹果', '../img/product-list/phone.jpg', '4500', '2000', '95', 'Apple iPhone 6s Plus (A1699) 64G 玫瑰金色 移动联通电信4G手机');
INSERT INTO `product_list_demo` VALUES ('1', 'Apple MacBook Air 13.3英寸笔记本电脑 银色(Core i5 处理器/8GB内存/128GB SSD闪存 MMGF2CH/A)', '6500', '苹果', '../img/product-list/mac.jpg', '6000', '1862', '85', 'Apple MacBook Air 13.3英寸笔记本电脑 银色(Core i5 处理器/8GB内存/128GB SSD闪存 MMGF2CH/A)');
-- ----------------------------
-- Tables for NestingObjectTesing
-- ----------------------------
DROP TABLE IF EXISTS `bfd_user`;
CREATE TABLE bfd_user
(
id int(11) not null AUTO_INCREMENT,
login_name varchar(50) not null,
userid int(50) not null,
password varchar(50) not null,
email varchar(50),
mobile varchar(50),
primary key (id)
);
DROP TABLE IF EXISTS `bfd_user_position`;
CREATE TABLE bfd_user_position
(
id int(11) not null AUTO_INCREMENT,
userid int(50),
position_num varchar(50) not null,
position varchar(50) not null,
level varchar(50) not null,
primary key (id)
);
DROP TABLE IF EXISTS `bfd_user_company`;
CREATE TABLE bfd_user_company
(
id int(11) not null AUTO_INCREMENT,
userid int(50),
company_name varchar(50) not null,
type varchar(50) not null,
primary key (id)
);
DROP TABLE IF EXISTS `bfd_user_roles`;
CREATE TABLE bfd_user_roles
(
id int(11) not null AUTO_INCREMENT,
role_description varchar(50),
userid int(50),
role_num varchar(50),
role_name varchar(50),
primary key (id)
);

-- ----------------------------
-- Table structure for `asset_area`
-- ----------------------------
DROP TABLE IF EXISTS `asset_area`;
CREATE TABLE `asset_area` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `AREA_ID` varchar(20) DEFAULT NULL,
  `NAME` varchar(100) DEFAULT NULL,
  `PARENT_ID` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `asset_area` VALUES
(1, '110101', '北京 北京市 东城区 ', NULL),
(2, '120101', '天津 天津市 和平区 ', NULL);


-- ----------------------------
-- Table structure for `asset_inst_base`
-- ----------------------------
DROP TABLE IF EXISTS `asset_inst_base`;
CREATE TABLE `asset_inst_base` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(255) DEFAULT NULL,
  `TYPE` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `asset_inst_base` VALUES 
(1, '电脑', '电脑'),
(2, 'SIM卡', 'SIM卡'),
(3, '铁塔', '铁塔'),
(4, '车辆', '车辆');