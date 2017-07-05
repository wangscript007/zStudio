-- ----------------------------
-- Procedure structure for createSchema
-- ----------------------------
DROP PROCEDURE IF EXISTS `createSchema`;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `createSchema`(in schemaName varchar(60) )
BEGIN
  DECLARE createSchemaSql varchar(21845);
  DECLARE grantSql varchar(21845);
  DECLARE sqlStr varchar(21845);
  DECLARE schemaN varchar(60);
    set @sqlStr = CONCAT('DROP SCHEMA IF EXISTS ',schemaName);
    prepare stmt from @sqlStr;
    EXECUTE stmt;
    deallocate prepare stmt;
    
    set @createSchemaSql = CONCAT('CREATE SCHEMA ',schemaName,' DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci');
    prepare stmt from @createSchemaSql;
    EXECUTE stmt;
    deallocate prepare stmt;
END
;;
DELIMITER ;