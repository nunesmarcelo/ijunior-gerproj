<?php

function validateEmail($email){
    $d = explode("@", substr($email, 1, -1));
    if (count($d) !=2 || $d[0] == ""){
        return false;
    }
    $e = explode(".", $d[1]);
    if (count($e) < 2){
        return false;
    }
    foreach ($e as $j){
        if ($j == ""){
            return false;
        }
    }
    return true;
}
include "Conexao.php";

$id = !isset($_REQUEST['id']) ? "" : intval($_REQUEST['id']);
$nome = empty($_POST['nome']) ? "''" : $conn->quote($_POST['nome']);
$empresa = empty($_POST['empresa']) ? "''" : $conn->quote($_POST['empresa']);
$telefixo = empty($_POST['telefixo']) ? "''" : $conn->quote($_POST['telefixo']);
$celular = empty($_POST['celular']) ? "''" : $conn->quote($_POST['celular']);
$endereco = empty($_POST['endereco']) ? "''" : $conn->quote($_POST['endereco']);
$email = empty($_POST['email']) ? "''" : $conn->quote($_POST['email']);
$observacoes = empty($_POST['observacoes']) ? "''" : $conn->quote($_POST['observacoes']);

$q = empty($_REQUEST['q']) ? "" : substr($conn->quote($_REQUEST['q']),1,-1);
$action = empty($_REQUEST['action']) ? "" : $_REQUEST['action'];

switch ($action) {
    case 'show':
        show();
        break;

    case 'update':
        update();
        break;

    case 'destroy':
        destroy();
        break;

    case 'insert':
        insert();
        break;

    default:
        search();
        break;
}

function show(){
    global $conn, $id;
    try {
        $sql = "SELECT * FROM `cliente` WHERE id=$id";
        $almost_result = $conn->prepare($sql);
        $almost_result->execute();
        $result = $almost_result->fetchAll(PDO::FETCH_ASSOC);
        $obj["status"]="ok";
        $obj["data"]=$result;
        $obj["count"]=count($result);
        $obj["data"][0]["projects"] = list_projects($id);
    }
    catch ( PDOException $e ){
        $obj["status"]="sql_error";
        $obj["error"]=$e->getMessage();
    }
    catch ( Exception $e ){
        $obj["status"]="error";
        $obj["error"]=$e->getMessage();
    }
    echo json_encode($obj);
}

function search(){
    global $conn, $q;
    try {
        $sql = "SELECT * FROM cliente WHERE nome LIKE '%$q%' OR email LIKE '%$q%' OR empresa LIKE '%$q%'";
        $almost_result = $conn->prepare($sql);
        $almost_result->execute();
        $result = $almost_result->fetchAll(PDO::FETCH_ASSOC);
        $obj["status"]="ok";
        $obj["count"]=count($result);
        $obj["data"]=$result;
    }catch ( PDOException $e ){
        $obj["status"]="sql_error";
        $obj["error"]=$e->getMessage();
    }
    catch ( Exception $e ){
        $obj["status"]="error";
        $obj["error"]=$e->getMessage();
    }
    echo json_encode($obj);

}

function list_projects($id){
    global $conn;
    try{
        $sql = "SELECT * FROM projeto WHERE cliente_id=$id ORDER BY previsao,finalizacao";
        $almost_result = $conn->prepare($sql);
        $almost_result->execute();
        $result = $almost_result->fetchAll(PDO::FETCH_ASSOC);
        $obj["count"]=count($result);
        $obj["data"]=$result;
        return $obj;
    }catch(Exception $e){
        return null;
    }
}



function insert(){
    global $conn, $nome, $empresa, $telefixo, $celular, $endereco, $email, $observacoes;
    try {
        $sql = "INSERT INTO `cliente`(`id`, `nome`, `empresa`, `telefixo`, `celular`, `endereco`, `email`, `observacoes`) VALUES (NULL,  $nome, $empresa, $telefixo, $celular, $endereco, $email, $observacoes)";
        if ($nome == "''" ||  $telefixo == "''" || $endereco  == "''" || !validateEmail($email)){
            throw new PDOException("Invalid data");
        }
        $obj["status"]="ok";
        $obj["count"]=$conn->exec($sql);
        $obj["data"]=[];
    }   catch (PDOException $e){
        $obj["status"]="sql_error";
        $obj["error"] = $e->getMessage();
    } catch (Exception $e){
        $obj["status"]="error";
        $obj["error"] = $e->getMessage();
    }
    echo json_encode($obj);

}

function update(){
    global $conn, $id, $nome, $empresa, $telefixo, $celular, $endereco, $email, $observacoes;
    try {
        $sql = "UPDATE cliente SET nome = $nome, empresa = $empresa, telefixo = $telefixo, celular = $celular, endereco = $endereco, email = $email, observacoes = $observacoes WHERE id = $id";
        if ($id == 0 || $nome == "''" ||  $telefixo == "''" || $endereco  == "''" || !validateEmail($email)){
            throw new PDOException("Invalid data");
        }
        $obj["status"]="ok";
        $obj["count"]=$conn->exec($sql);
        $obj["data"]=[];
    }   catch (PDOException $e){
        $obj["status"]="sql_error";
        $obj["error"] = $e->getMessage();
    }   catch (Exception $e){
        $obj["status"]="error";
        $obj["error"] = $e->getMessage();
    }
    echo json_encode($obj);
}

function destroy(){
    global $conn, $id;
    try {
        $obj["status"]="ok";
        $obj["count"] = $conn->exec("DELETE FROM cliente WHERE id = $id");
        $obj["data"]=[];
    }   catch (PDOException $e){
        $obj["status"]="sql_error";
        $obj["error"] = $e->getMessage();
    }   catch (Exception $e){
        $obj["status"]="error";
        $obj["error"] = $e->getMessage();
    }
    echo json_encode($obj);

}
