document.addEventListener("DOMContentLoaded", function(){
    const urlParams=new URLSearchParams(window.location.search);
    const error=urlParams.get('error');
    if(error){
        let message='';
        if(error==='invalid'){
            message='invalid username or password.';
        }
        document.getElementById('errorMsg').innerText=message;
    }

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
