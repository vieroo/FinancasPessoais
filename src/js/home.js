const userNameChange = ()=>{
    let login = localStorage.getItem("username")
    
    let user = document.getElementById('entrar')
    user.innerHTML = login
}
