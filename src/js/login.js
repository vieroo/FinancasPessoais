document.getElementById('doLogin').addEventListener('click', () => {
  let username = document.getElementById('username').value
  let password = document.getElementById('password').value

  console.log(username)
  console.log(password)

  getLogin(username, password)
})


function erroOnLogin() {
  const erroLogin = document.getElementById('erroLogin')

  while (erroLogin.firstChild) {
    erroLogin.removeChild(erroLogin.firstChild)
  }

  const p = document.createElement('p')
  p.textContent = 'Usuário ou senha incorretos!'
  p.classList.add('erroLogin', 'my-4')
  erroLogin.appendChild(p)
  document.getElementById('password').value = ''
}


async function getLogin(username, password) {
  fetch('http://localhost:3000/users')
  .then(response => response.json())
  .then(users => {
    const user = users.find(u => u.login === username && u.password == password)
    if (user) {
      window.location.href='home.html'
    } else {
      erroOnLogin()
    }
  })
}