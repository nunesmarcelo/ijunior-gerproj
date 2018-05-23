<?php

$DB_SERVER="localhost";
$DB_USER="root";
$DB_PASSWORD="";
$DB_NAME="gerprj";

try{
    $conn = new PDO("mysql:host=$DB_SERVER;dbname=$DB_NAME;charset=utf8",$DB_USER,$DB_PASSWORD);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}catch(PDOException $e){
    echo "{\"status\": \"".$e->getMessage()."\"}";
    $conn=null;
    exit();
}
