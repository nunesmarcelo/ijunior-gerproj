<?php
$CFG = array();

// Path to the txtSQL.class.php file
$CFG['txtsql']['class']     = '../../txtSQL.class.php';

// Path to the directory containing 'txtSQL.core.php'
$CFG['txtsql']['core_path'] = '../../';

// Path to the directory containing the txtSQL databases
$CFG['txtsql']['data_path'] = '../../data';

include('./startup.php');
?>

<?php

//FIXES for PHP 5.6

// Fix for removed Session functions
function fix_session_register(){
    function session_register(){
        $args = func_get_args();
        foreach ($args as $key){
            $_SESSION[$key]=$GLOBALS[$key];
        }
    }
    function session_is_registered($key){
        return isset($_SESSION[$key]);
    }
    function session_unregister($key){
        unset($_SESSION[$key]);
    }
}
if (!function_exists('session_register')) fix_session_register();
?>
