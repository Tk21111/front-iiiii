import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { store } from './app/store'
import { Provider } from 'react-redux'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header';

//import {disableReactDevTools} from '@fvilers/disable-react-devtools'

//if (process.env.NODE_ENV === 'production') disableReactDevTools()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
          
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);