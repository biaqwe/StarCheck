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

    $userID=$_SESSION['userID'];
    $data=json_decode(file_get_contents("php://input"));
    $taskId=$data->task_id;
    $completed=$data->completed;

    $stmt=$conn->prepare("UPDATE tasks SET completed=? WHERE id=? AND user_id=?");
    $stmt->bind_param("iii", $completed, $taskId, $userID);

    if($stmt->execute()){
        echo json_encode(['success'=>true]);
    }
    else{
        echo json_encode(['success'=>false, 'error'=>'error completing task']);
    }

    $stmt->close();
    $conn->close();
?>
