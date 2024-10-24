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

    $userID=$_SESSION['userID'];

    $stmt=$conn->prepare("SELECT id, task_text, completed FROM tasks WHERE user_id=? ORDER BY id DESC");
    $stmt->bind_param("i", $userID);
    $stmt->execute();
    $result=$stmt->get_result();

    $tasks=[];
    while($row=$result->fetch_assoc()){
        $tasks[]=$row;
    }

    $stmt->close();
    $conn->close();

    echo json_encode($tasks);
?>
