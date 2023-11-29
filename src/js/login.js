document.getElementById('doLogin').addEventListener('click', () => {
  let username = document.getElementById('username').value
  let password = document.getElementById('password').value
  localStorage.setItem("username", username)

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

document.addEventListener('DOMContentLoaded', function() {
  const inputs = document.querySelectorAll('.form input')
  const passwordInput = document.getElementById('password')
  const loginButton = document.getElementById('doLogin')

  function checkEnter(evt) {
    if (evt.key === 'Enter') {
      if (evt.target === passwordInput) {
          let username = document.getElementById('username').value
          let password = document.getElementById('password').value

          localStorage.setItem("username", username)
    
          getLogin(username, password)
      } else {
        const currentIndex = Array.from(inputs).indexOf(evt.target)
        const nextIndex = (currentIndex + 1) % inputs.length

        inputs[nextIndex].focus();
      }
    }
  }

  inputs.forEach(input => {
    input.addEventListener('keydown', checkEnter)
  })

})