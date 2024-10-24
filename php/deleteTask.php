<?php
    session_start();
    if(!isset($_SESSION['userID'])){
        echo json_encode(['success'=>false, 'error'=>'user not logged in']);
        exit();
    }

    $servername="localhost"; 
    $username="root"; 
    $password=""; 
    $dbname="starcheck"; 

    $conn=new mysqli($servername, $username, $password, $dbname);
    if($conn->connect_error){
        die("connection failed: ".$conn->connect_error);
    }

    $data=json_decode(file_get_contents('php://input'), true);
    $taskText=$data['task_text'];
    $userID=$_SESSION['userID'];

    $stmt=$conn->prepare("DELETE FROM tasks WHERE task_text=? AND user_id=?");
    $stmt->bind_param("si", $taskText, $userID);

    if($stmt->execute()){
        echo json_encode(['success'=>true]);
    }
    else{
        echo json_encode(['success'=>false, 'error'=>'error deleting task']);
    }

    $stmt->close();
    $conn->close();
?>
