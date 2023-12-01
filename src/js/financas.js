let transactions = []



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

  const formater = new Intl.NumberFormat('pt-BR', {
    compactDisplay: 'long',
    style: 'currency',
    currency: 'BRL'
  })

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
  const transactionValue = parseFloat(document.getElementById('transaction-value').value)
  const transactionType = document.querySelector('input[name="transaction-type"]:checked').id

  // Verificar se é despesa ou receita
  // if (transactionType === 'debit') {
  //   transactionValue = -(transactionValue)
  // } else {
  //   transactionValue = +(transactionValue)
  // }


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

  //ev.target.reset()
  //updateBalance() // Atualizar o valor do saldo, falta criar ainda
}



// Buscar retorno transações
async function fetchTransaction(){
  return await fetch('http://localhost:3000/transactions').then((res) => res.json())
}



async function setup(){
  const results = await fetchTransaction()
  transactions.push(...results)
  transactions.forEach(renderTransaction)
}



document.addEventListener('DOMContentLoaded', setup)
document.querySelector('form').addEventListener('submit', saveTransaction)