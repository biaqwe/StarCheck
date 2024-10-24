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
    $email=$_POST['email'];
    $password=$_POST['password'];
    $confirmPassword=$_POST['confirmPassword'];

    if($password!==$confirmPassword){
        header("location: ../html/signup.html?error=dontMatch");
        exit();
    }

    $stmt=$conn->prepare("SELECT COUNT(*) FROM users WHERE email=?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->bind_result($emailCount);
    $stmt->fetch();
    $stmt->close();

    if($emailCount>0){
        header("location: ../html/signup.html?error=userExists");
        exit();
    }

    $stmt=$conn->prepare("SELECT COUNT(*) FROM users WHERE username=?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->bind_result($usernameCount);
    $stmt->fetch();
    $stmt->close();

    if($usernameCount>0){
        header("location: ../html/signup.html?error=userExists");
        exit();
    }

    $hashedPassword=password_hash($password, PASSWORD_DEFAULT);

    $stmt=$conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $hashedPassword);

    if($stmt->execute()){
        header("location: ../html/login.html");
    }
    else{
        echo "error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
?>
