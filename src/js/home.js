const userNameChange = () =>{
    
    let login = localStorage.getItem("username")

    if(login){
        let username = document.getElementById('entrar')

        username.onmouseover = () => {
            username.style.pointerEvents = 'none'
        }
        
        username.innerHTML = login
    }
}

const clearLocalStorage = () => {
    localStorage.removeItem('username')
}