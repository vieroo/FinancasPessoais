document.getElementById('doLogin').addEventListener('click', () => {
  let username = document.getElementById('username').value
  let password = document.getElementById('password').value

  if (username === 'admin' && password === 'admin') {
    alert('Login efetuado com sucesso')
  } else {
    alert('Usuario ou senha incorretos')
  }
})