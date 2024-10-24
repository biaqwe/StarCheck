document.addEventListener("DOMContentLoaded", function(){
    const urlParams=new URLSearchParams(window.location.search);
    const error=urlParams.get('error');
    if(error){
        let message='';
        //check after form is submitted
        if(error==='dontMatch'){
            message='passwords do not match.';
        }
        else if(error==='userExists'){
            message='a user with this email or username already exists.';
        }
        document.getElementById('errorMsg').innerText=message;
    }
    const signupForm=document.getElementById('signupForm');
    //check before form is submitted
    signupForm.addEventListener('submit', function(event){
        const password=document.getElementById('password').value;
        const confirmPassword=document.getElementById('confirmPassword').value;
        if(password!==confirmPassword){
            event.preventDefault();
            document.getElementById('errorMsg').innerText='passwords do not match.';
        }
    });
});