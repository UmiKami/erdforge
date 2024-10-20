import { createRoot } from 'react-dom/client'
import Layout from './Layout.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { StrictMode } from 'react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <Provider store={store}>
    <Layout />
  </Provider>,
  </StrictMode>
)
