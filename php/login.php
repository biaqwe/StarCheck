<?php
    session_start();

    $servername="localhost"; 
    $username="root"; 
    $password=""; 
    $dbname="starcheck"; 

    $conn=new mysqli($servername, $username, $password, $dbname);

    if($conn->connect_error){
        die("connection failed: ".$conn->connect_error);
    }

    $username=$_POST['username'];
    $password=$_POST['password'];

    $stmt=$conn->prepare("SELECT id, password FROM users WHERE username=?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if($stmt->num_rows>0){
        $stmt->bind_result($userID, $hashedPassword);
        $stmt->fetch();

        if(password_verify($password, $hashedPassword)){
            $_SESSION['username']=$username;  
            $_SESSION['userID']=$userID;
            $_SESSION['logged_in']=true;
            header("location: ../html/tasks.html");
            exit();
        }
        else{
            header("location: ../html/login.html?error=invalid");
            exit();
        }
    }
    else{
        header("location: ../html/login.html?error=invalid");
        exit();
    }

    $stmt->close();
    $conn->close();
?>
