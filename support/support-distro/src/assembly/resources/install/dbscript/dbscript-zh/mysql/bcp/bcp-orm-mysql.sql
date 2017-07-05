USE UEP4X;
/* 多表定义表 */
DROP TABLE IF EXISTS `MULTI_TABLE_DEFINITION_TABLE`;
CREATE TABLE `MULTI_TABLE_DEFINITION_TABLE` 
(
   `ID`                   VARCHAR(100)                   not null,
   `DESCRIPTION`          VARCHAR(1500)                   null,
   `COMBINATIVE_TABLE`    VARCHAR(500)                   null,
   `PROJECT_NAME`         VARCHAR(100)                   null,
   `SCENE`                TINYINT                        null,
   CONSTRAINT PK_MULTI_TABLE_DEFINITION_TABLE PRIMARY KEY (ID)
);
/* 多表定义字段表 */
DROP TABLE IF EXISTS `MULTI_TABLE_METADATA_TABLE`;
CREATE TABLE `MULTI_TABLE_METADATA_TABLE` 
(
   `ID`                   VARCHAR(32)                    not null,
   `RESOURCE_ID`          VARCHAR(100)                   null,
   `TABLE_NAME`           VARCHAR(100)                   null,
   `TABLE_COLUMN_NAME`    VARCHAR(100)                   null,
   `RESOURCE_COLUMN_NAME` VARCHAR(100)                   null,
   `DATABASE_NAME`		  VARCHAR(100) 				     null,
   CONSTRAINT PK_MULTI_TABLE_METADATA_TABLE PRIMARY KEY (ID)
);
/* 单表定义表 TABLE_TYPE（“0”为单表，“1”为视图） */
DROP TABLE IF EXISTS `SINGLE_TABLE_DEFINITION_TABLE`;
CREATE TABLE `SINGLE_TABLE_DEFINITION_TABLE` 
(
   `TABLE_NAME`           VARCHAR(64)                    not null,
   `DESCRIPTION`          VARCHAR(600)                   null,
   `TABLE_TYPE`           TINYINT                        null,
   CONSTRAINT PK_SINGLE_TABLE_DEFINITION_TABLE PRIMARY KEY (TABLE_NAME)
);
/* 单表和多表定义视图，TABLE_TYPE（“0”为单表，“1”为视图，“2”为多表） */
DROP VIEW IF EXISTS `TABLE_DEFINITION_VIEW`;
CREATE VIEW `TABLE_DEFINITION_VIEW` AS SELECT
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
	WHERE mtdt.SCENE = 1;