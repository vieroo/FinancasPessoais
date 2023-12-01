let transactions = []



function createTransactionContainer(transactionID) {
  const container = document.createElement('div')
  container.classList.add('transaction')
  container.id = `transaction-${transactionID}`
  return container
}



function createTransactionName(transactionName) {
  const name = document.createElement('p')
  name.classList.add('transaction-name')
  name.textContent = transactionName
  return name
}



function createTransactionValue(transactionValue) {
  const value = document.createElement('span')

}



// Função para salvar as transações
async function saveTransaction(ev) {
  ev.preventDefault()

  const transactionID = document.getElementById('transaction-id')
  const transactionName = document.getElementById('transaction-name').value
  const transactionValue = parseFloat(document.getElementById('transaction-value').value)
  const transactionType = document.querySelector('input[name="transaction-type"]::checked').id


  // Verifica se já existe transacao, se tiver atualiza o valor
  if (transactionID) {
    const response = await fetch(`http://localhost:3000/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ transactionName, transactionValue, transactionType}),
      headers: {
        'Content-Type': 'Application/json'
      }
    })
    const transaction = await response.json()
    const indexToRemove = transactions.findIndex((t) => t.index === transactionID)
    transactions.splice(indexToRemove, 1, transaction)
    document.querySelector(`#transaction=${transactionID}`).remove()
    //renderTransaction(transaction) // faltar criar essa funcao

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
    //renderTransaction(transaction)
  }

  ev.target.reset()
  //updateBalance() // Atualizar o valor do saldo, falta criar ainda
}