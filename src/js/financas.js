let transactions = []

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

// Renderizar/Mostrar transações na tela
function renderTransaction(transaction) {
  const container = createTransactionContainer(transaction.id)
  const name = createTransactionName(transaction.transactionName)
  const value = createTransactionValue(transaction.transactionValue, transaction.transactionType)

  container.append(name, value)
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

  let i = 0
  let valor = 0
  const balance = document.getElementById('balance')

  const transactions = await fetch('http://localhost:3000/transactions')
  .then((res) => res.json())

  transactions.forEach(()=>{
      valor += transactions[i].transactionValue
      i += 1
  })

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

