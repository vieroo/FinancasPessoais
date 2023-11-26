document.getElementById('save-transaction').addEventListener('onclick', (ev) => {
  ev.preventDefault();

  const transactionName = document.getElementById('transaction-name').value
  const transactionValue = document.getElementById('transaction-value').value
  const transactionType = document.querySelector('input[name="transaction-type"]::checked').id

  const newTransaction = {
    name: transactionName,
    value: transactionValue,
    type: transactionType
  }

  addNewTransaction(newTransaction)
})

async function addNewTransaction(newTransaction) {
 await fetch('http://lolcalhost:3000/transaction')
}