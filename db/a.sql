SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

CREATE SCHEMA IF NOT EXISTS `gerprj` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ;
USE `gerprj`;

-- -----------------------------------------------------
-- Table `gerprj`.`cliente`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `gerprj`.`cliente` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `nome` VARCHAR(100) NOT NULL ,
  `empresa` VARCHAR(100) NOT NULL,
  `telefixo` VARCHAR(20) NULL ,
  `celular` VARCHAR(20) NULL ,
  `endereco` TEXT NOT NULL ,
  `email` VARCHAR(100) NOT NULL ,
  `observacoes` TEXT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gerprj`.`projeto`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `gerprj`.`projeto` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `codinome` VARCHAR(30) NULL ,
  `nome` VARCHAR(200) NOT NULL ,
  `assinatura` DATE NOT NULL ,
  `previsao` DATE NOT NULL ,
  `finalizacao` DATE NULL ,
  `descricao` TEXT NOT NULL ,
  `cliente_id` INT NOT NULL ,
  `finalizado` BOOLEAN NOT NULL DEFAULT FALSE, 
  PRIMARY KEY (`id`, `cliente_id`) ,
  INDEX `fk_projeto_cliente` (`cliente_id` ASC) ,
  CONSTRAINT `fk_projeto_cliente`
    FOREIGN KEY (`cliente_id` )
    REFERENCES `gerprj`.`cliente` (`id` )
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
