document.getElementById('doLogin').addEventListener('click', () => {
  let username = document.getElementById('username').value
  let password = document.getElementById('password').value

  console.log(username)
  console.log(password)

  getLogin(username, password)
})

async function getLogin(username, password) {
  fetch('http://localhost:3000/users')
  .then(response => response.json())
  .then(users => {
    const user = users.find(u => u.login === username && u.password == password)
    if (user) {
      window.location.href='home.html'
    } else {
      alert('Usuario ou senha incorretos')
    }
  })
}