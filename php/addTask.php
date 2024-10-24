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
    $taskText=json_decode(file_get_contents("php://input"))->task_text;

    $stmt=$conn->prepare("INSERT INTO tasks (task_text, user_id, completed) VALUES (?, ?, ?)");
    $completed=0;
    $stmt->bind_param("sii", $taskText, $userID, $completed);

    if($stmt->execute()){
        $newTask=[
            'id'=>$stmt->insert_id,
            'task_text'=>$taskText,
            'completed'=>$completed,
        ];
        echo json_encode(['success'=>true, 'task'=>$newTask]);
    }
    else {
        echo json_encode(['success'=>false, 'error'=>'error adding task']);
    }

    $stmt->close();
    $conn->close();
?>
