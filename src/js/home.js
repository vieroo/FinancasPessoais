const userNameChange = () =>{
    
    let login = localStorage.getItem("username")
    if(login){
        let username = document.getElementById('entrar')

        username.onmouseover = () => {
            username.style.pointerEvents = 'none'
        }
        username.classList.remove('text-light')
        username.classList.add('text-warning')
        username.innerHTML = login
        
    }
}



const clearLocalStorage = () => {
    localStorage.removeItem('username')
}