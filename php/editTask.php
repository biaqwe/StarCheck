<?php
    session_start();
    if(!isset($_SESSION['userID'])){
        echo json_encode(['success'=>false, 'error'=>'user not logged in.']);
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
    $oldTask=$conn->real_escape_string($data['oldTask']);
    $newTask=$conn->real_escape_string($data['newTask']);
    $userID=$_SESSION['userID'];

    $stmt=$conn->prepare("UPDATE tasks SET task_text=? WHERE user_id=? AND task_text=?");
    $stmt->bind_param("sis", $newTask, $userID, $oldTask);

    if($stmt->execute()){
        echo json_encode(['success'=>true]);
    }
    else{
        echo json_encode(['success'=>false, 'error'=>'error editing task: ']);
    }

    $stmt->close();
    $conn->close();
?>
