<?php
    session_start();
    if(!isset($_SESSION['userID'])){
        echo json_encode(['success'=>false, 'error'=>'user not logged in.']);
        exit();
    }

    $username=$_SESSION['username'];

    if($username){
        echo json_encode(['success'=>true, 'user'=>['name'=>$username]]);
    }
    else{
        echo json_encode(['success'=>false, 'error'=>'user not found']);
    }
?>
