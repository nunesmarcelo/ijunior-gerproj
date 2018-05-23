<?php

function validateDate($date)
{
    $d = explode("-",substr($date,1,-1));
    if(count($d)==3 && $d[2] != ""){
        return checkdate($d[1], $d[2], $d[0]);
    }else{
        return false;
    }
}

include "Conexao.php";

$id = !isset($_REQUEST['id']) ? "" : intval($_REQUEST['id']);
$codinome = empty($_POST['codinome']) ? "''" : $conn->quote($_POST['codinome']);
$nome = empty($_POST['nome']) ? "''" : $conn->quote($_POST['nome']);
$cliente = empty($_POST['cliente']) ? "''" : intval($_POST['cliente']);
$assinatura = empty($_POST['assinatura']) ? "''" : $conn->quote($_POST['assinatura']);
$previsao = empty($_POST['previsao']) ? "''" : $conn->quote($_POST['previsao']);
$finalizacao = empty($_POST['finalizacao']) ? "NULL" : $conn->quote($_POST['finalizacao']);
$descricao = empty($_POST['descricao']) ? "''" : $conn->quote($_POST['descricao']);
$finalizado = empty($_POST['finalizado']) ? 0 : 1;  //bufix for finalized project with NULL finish date.


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

    case 'finalize':
        finalize();
        break;

    default:
        search();
        break;
}


function show(){
    global $conn, $id;
    $sql = "SELECT p.id,p.codinome,p.nome,p.assinatura,p.previsao,p.finalizacao,p.finalizado,p.descricao,p.cliente_id,c.nome as cliente FROM projeto p JOIN cliente c ON p.cliente_id=c.id WHERE p.id=$id";
    try {
        $almost_result = $conn->prepare($sql);
        $almost_result->execute();
        $result = $almost_result->fetchAll(PDO::FETCH_ASSOC);
        $obj["status"]="ok";
        $obj["count"]=count($result);
        $obj["data"]=$result;
    } catch (PDOException $e){
        $obj["status"]="sql_error";
        $obj["error"] = $e->getMessage();
    } catch (Exception $e){
        $obj["status"]="error";
        $obj["error"] = $e->getMessage();
    }
    echo json_encode($obj);
}

function search(){
    global $conn, $q;
    try {
        $sql = "SELECT p.id,p.codinome,p.nome,p.assinatura,p.previsao,p.finalizacao,p.finalizado,p.descricao,p.cliente_id,c.nome as cliente FROM projeto p JOIN cliente c ON p.cliente_id=c.id WHERE p.codinome LIKE '%$q%' OR p.nome LIKE '%$q%' ORDER BY previsao,finalizacao";
        $almost_result = $conn->prepare($sql);
        $almost_result->execute();
        $result = $almost_result->fetchAll(PDO::FETCH_ASSOC);
        $obj["status"]="ok";
        $obj["count"]=count($result);
        $obj["data"]=$result;
    } catch (PDOException $e){
        $obj["status"]="sql_error";
        $obj["error"] = $e->getMessage();
    } catch (Exception $e){
        $obj["status"]="error";
        $obj["error"] = $e->getMessage();
    }
    echo json_encode($obj);
}

function finalize(){
    global $conn, $id, $finalizacao;
    try {
        $sql = "SELECT finalizacao, finalizado FROM projeto WHERE id=$id";
        $almost_result = $conn->prepare($sql);
        $almost_result->execute();
        $result = $almost_result->fetch(PDO::FETCH_ASSOC);
        if($result["finalizado"]=="1"){
            $sql = "UPDATE projeto SET finalizado=0, finalizacao=NULL";
        }else{
            $sql = "UPDATE projeto SET finalizado=1";
            if($result["finalizacao"] == "" || $result["finalizacao"] == "0000-00-00" || strtotime($result["finalizacao"]) < strtotime(substr($finalizacao,1,-1))){
                $sql .= ", finalizacao=$finalizacao";
            }
        }
        $sql .= " WHERE id=$id";
        $obj["status"]="ok";
        $obj["count"]=$conn->exec($sql);
        $obj["data"]=[];
    } catch (PDOException $e){
        $obj["status"]="sql_error";
        $obj["error"] = $e->getMessage();
    } catch (Exception $e){
        $obj["status"]="error";
        $obj["error"] = $e->getMessage();
    }
    echo json_encode($obj);
}

function insert(){
    global $conn, $codinome, $nome, $assinatura, $previsao, $descricao, $cliente;
    try {
        $sql = "INSERT INTO `projeto`(`id`, `codinome`, `nome`, `assinatura`, `previsao`, `finalizacao`, `descricao`, `cliente_id`) VALUES (NULL, $codinome, $nome, $assinatura, $previsao, NULL, $descricao, $cliente)";

        if($nome=="''" || !validateDate($assinatura) || !validateDate($previsao) || $cliente=="''" || $cliente=="" || $cliente==0){
            throw new PDOException("Invalid data");
        }

        $obj["status"]="ok";
        $obj["count"]=$conn->exec($sql);
        $obj["data"]=[];
    } catch (PDOException $e){
        $obj["status"]="sql_error";
        $obj["error"] = $e->getMessage();
    } catch (Exception $e){
        $obj["status"]="error";
        $obj["error"] = $e->getMessage();
    }
    echo json_encode($obj);
}

function update(){
    global $conn, $id, $codinome, $nome, $assinatura, $previsao, $finalizacao, $descricao, $cliente, $finalizado;
    try {
        $sql = "UPDATE projeto SET codinome = $codinome, nome = $nome, assinatura = $assinatura, previsao = $previsao, finalizacao = $finalizacao, descricao = $descricao, cliente_id = $cliente WHERE id = $id";

        if($nome=="''" || $id=="" || $id==0 || !validateDate($assinatura) || !validateDate($previsao) || (!validateDate($finalizacao) && $finalizacao!="NULL") || ($finalizacao== "NULL" && $finalizado==1) ){
            throw new PDOException("Invalid data");
        }

        $obj["status"]="ok";
        $obj["count"]=$conn->exec($sql);
        $obj["data"]=[];
    } catch (PDOException $e){
        $obj["status"]="sql_error";
        $obj["error"] = $e->getMessage();
    } catch (Exception $e){
        $obj["status"]="error";
        $obj["error"] = $e->getMessage();
    }
    echo json_encode($obj);
}

function destroy(){
    global $conn, $id;
    try {
        $obj["status"]="ok";
        $obj["count"] = $conn->exec("DELETE FROM projeto WHERE id = $id");
        $obj["data"]=[];
    } catch (PDOException $e){
        $obj["status"]="sql_error";
        $obj["error"] = $e->getMessage();
    } catch (Exception $e){
        $obj["status"]="error";
        $obj["error"] = $e->getMessage();
    }
    echo json_encode($obj);

}
