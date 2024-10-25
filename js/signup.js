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

    //dark mode toggle
    const theme=document.getElementById('theme');
    const themeIcon=document.querySelector("i");
    const body=document.body;
    theme.addEventListener('click', function(){
        body.classList.toggle('dark');
        if(body.classList.contains('dark')){
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        else{
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });
});
