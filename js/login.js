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
});