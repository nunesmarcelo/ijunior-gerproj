<?php
if(empty($_REQUEST['action']))
    exit;

include_once('./txtSQL.class.php');
$sql = new txtSQL('./data');
$sql->connect('root', '');
$sql->selectdb('teste');

switch($_REQUEST['action']){
    case "edit":
        $edit = array(
            'table' => 'reg',
            'where' => array('id = '.$_REQUEST['id']),
            'values' => array(
                'nome' => $_REQUEST['nome'],
                'conteudo' => $_REQUEST['conteudo']
            )
        );
        $sql->update($edit);
        echo "{\"status\": \"ok\"}";
        break;

    case "delete":
        $delete = array(
            'table' => 'reg',
            'where' => array('id = '.$_REQUEST['id']),
        );
        $sql->delete($delete);
        echo "{\"status\": \"ok\"}";
        break;

    case "add":
        $insert = array(
            'table' => 'reg',
            'values' => array(
                'nome' => $_REQUEST['nome'],
                'conteudo' => $_REQUEST['conteudo']
            )
        );
        $sql->insert($insert);
        echo "{\"status\": \"ok\"}";
        break;

    case "show":
        $data = $sql->select(array(
            'table'   => 'reg',
            'where'   => array('id = '.$_REQUEST['id'])
        ));
        echo "{\"status\": \"ok\", \"data\": [";
        foreach ( $data as $key => $row ) {
            if($key!=0) echo ', ';
            echo "{\"id\": ".$row['id'].", \"nome\": \"".$row['nome']."\", \"conteudo\": \"".$row['conteudo']."\"}";
        }
        echo "]}";
        break;

    default:
        $data = $sql->select(array(
            'table'   => 'reg',
            'orderby' => array('id', 'ASC')
        ));
        echo "{\"status\": \"ok\", \"data\": [";
        foreach ( $data as $key => $row ) {
            if($key!=0) echo ', ';
            echo "{\"id\": ".$row['id'].", \"nome\": \"".$row['nome']."\", \"conteudo\": \"".$row['conteudo']."\"}";
        }
        echo "]}";
        break;
}
?>
