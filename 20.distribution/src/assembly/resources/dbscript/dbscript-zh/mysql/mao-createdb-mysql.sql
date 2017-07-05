DELETE FROM mysql.user WHERE user = 'mao';
GRANT ALL PRIVILEGES ON *.* TO 'mao'@'%' IDENTIFIED BY 'U_mao_2015' WITH GRANT OPTION;

DROP SCHEMA IF EXISTS `MAO`;
CREATE SCHEMA `MAO` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE MAO;
DROP PROCEDURE IF EXISTS `cleanSchema`;
DELIMITER ;;
CREATE PROCEDURE `cleanSchema`(in schemaPrefix varchar(60))
BEGIN
DECLARE  no_more_products INT DEFAULT 0;
  DECLARE  prd_code VARCHAR(255);
  DECLARE  sqlStr VARCHAR(10000);
	DECLARE cur_product CURSOR FOR select SCHEMA_NAME from information_schema.SCHEMATA;
  DECLARE  CONTINUE HANDLER FOR NOT FOUND  SET  no_more_products = 1;#Routine body goes here...
    OPEN cur_product;
    FETCH  cur_product INTO prd_code;
    REPEAT
    IF INSTR(prd_code,schemaPrefix) = 1  THEN
      set @sqlStr = CONCAT('DROP SCHEMA IF EXISTS ',prd_code);
      prepare stmt from @sqlStr;
      EXECUTE stmt;
      deallocate prepare stmt;
    END IF;
    FETCH  cur_product INTO prd_code;
    UNTIL  no_more_products = 1
    END REPEAT;  
    CLOSE  cur_product;
END
;;
DELIMITER ;