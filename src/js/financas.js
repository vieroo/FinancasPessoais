const transactions = []

const formater = new Intl.NumberFormat('pt-BR', {
  compactDisplay: 'long',
  style: 'currency',
  currency: 'BRL'
})

function createTransactionContainer(id) {
  const container = document.createElement('div')
  container.classList.add('transaction')
  container.id = `transaction-${id}`
  return container
}

function createTransactionName(transactionName) {
  const name = document.createElement('p')
  name.classList.add('transaction-name')
  name.textContent = transactionName
  return name
}

function createTransactionValue(transactionValue, transactionType) {
  const value = document.createElement('span')

  const valueFormated = formater.format(transactionValue)

  if (transactionType === 'debit') {
    value.textContent = `${valueFormated}`
    value.classList.add('transaction-value', 'debit')
  } else {
    value.textContent = `${valueFormated}`
    value.classList.add('transaction-value', 'credit')
  }

  return value
}

// Criar o botao de Editar a transação
function createEditTransactionBtn(transaction) {
  const editBtn = document.createElement('button')
  editBtn.classList.add('edit-btn')
  editBtn.textContent = 'Editar'
  editBtn.addEventListener('click', () => {
    document.querySelector('#transaction-id').value = transaction.id
    document.querySelector('#transaction-name').value = transaction.transactionName
    document.querySelector('#transaction-value').value = transaction.transactionValue

    if (transaction.transactionType == 'debit') {
      document.querySelector('#debit').checked =  true
    } else {
      document.querySelector('#credit').checked = true
    }

    document.getElementById('add-transaction').scrollIntoView()
  })

  return editBtn
}


// Criar botão de remover transação
function createDeleteTransactionBtn(id) {
  const deleteBtn = document.createElement('button')
  deleteBtn.classList.add('delete-btn')
  deleteBtn.textContent = 'Excluir'
  deleteBtn.addEventListener('click', async () => {
    await fetch(`https://localhost:3000/transactions/${id}`, {method: 'DELETE'})
    deleteBtn.parentElement.remove
    const indexToRemove = transactions.findIndex((t) => t.id === id)
    transactions.splice(indexToRemove, 1)
    updateBalance()
  })
  return deleteBtn
}


// Renderizar/Mostrar transações na tela
function renderTransaction(transaction) {
  const container = createTransactionContainer(transaction.id)
  const name = createTransactionName(transaction.transactionName)
  const value = createTransactionValue(transaction.transactionValue, transaction.transactionType)
  const editBtn = createEditTransactionBtn(transaction)
  const deleteBtn = createDeleteTransactionBtn(transaction.id)

  container.append(name, value, editBtn, deleteBtn)
  document.querySelector('#transactions-history').append(container)
}

// Função para salvar as transações
async function saveTransaction(ev) {
  ev.preventDefault()

  const id = document.getElementById('transaction-id').value
  const transactionName = document.getElementById('transaction-name').value
  let transactionValue = parseFloat(document.getElementById('transaction-value').value)
  const transactionType = document.querySelector('input[name="transaction-type"]:checked').id

  transactionValue = transactionType === 'debit' ? -(transactionValue) : +(transactionValue);

  // Verifica se já existe transacao, se tiver atualiza o valor
  if (id) {
    const response = await fetch(`http://localhost:3000/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ transactionName, transactionValue, transactionType}),
      headers: {
        'Content-Type': 'Application/json'
      }
    })
    const transaction = await response.json()
    const indexToRemove = transactions.findIndex((t) => t.index === id)
    transactions.splice(indexToRemove, 1, transaction)
    document.querySelector(`#transaction-${id}`).remove()
    renderTransaction(transaction)

  } else {
    // Criar uma nova transacao
    const response = await fetch('http://localhost:3000/transactions', {
      method: 'POST',
      body: JSON.stringify({ transactionName, transactionValue, transactionType}),
      headers: {
        'Content-Type': 'Application/json'
      }
    })

    const transaction = await response.json()
    transactions.push(transaction)
    renderTransaction(transaction)
  }

  ev.target.reset()
  updateBalance()
}

async function updateBalance(){

  const balance = document.getElementById('balance')

  const transactions = await fetch('http://localhost:3000/transactions')
  .then((res) => res.json())

  const valor = transactions.reduce((prevValor, transacao) => prevValor + transacao.transactionValue, 0)

  if (valor >=0 ) {
    balance.classList.add('credit')
  } else {
    balance.classList.add('debit')
  }

  const valueFormated = formater.format(valor)
  balance.innerHTML = valueFormated
}

// Buscar retorno transações
async function fetchTransaction(){
  return await fetch('http://localhost:3000/transactions').then((res) => res.json())
}

async function setup(){
  const results = await fetchTransaction()
  transactions.push(...results)
  transactions.forEach(renderTransaction)
  updateBalance()
}

document.addEventListener('DOMContentLoaded', setup)
document.querySelector('form').addEventListener('submit', saveTransaction)