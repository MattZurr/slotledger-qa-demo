import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App element not found')
}

app.innerHTML = `
  <h1>SlotLedger</h1>
  <p>QA Release Check Demo</p>
`