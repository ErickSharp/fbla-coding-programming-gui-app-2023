import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { invoke } from '@tauri-apps/api'

invoke("close_splashscreen");

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
)
