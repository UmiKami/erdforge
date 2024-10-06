import { createRoot } from 'react-dom/client'
import Layout from './Layout.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Layout />
  </Provider>,
)
