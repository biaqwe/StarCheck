document.addEventListener("DOMContentLoaded", function(){
    //save theme preference in local storage to keep after page refresh and across pages
    const body=document.body;
    const theme=document.getElementById('theme');
    const themeIcon=theme.querySelector("i");
    const storedTheme=localStorage.getItem('theme');

    if(storedTheme==='dark'){
        body.classList.add('dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    else{
        body.classList.remove('dark');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

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
    theme.addEventListener('click', function(){
        body.classList.toggle('dark');
        if(body.classList.contains('dark')){
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        }
        else{
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
});
