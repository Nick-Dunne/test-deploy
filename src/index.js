import React from 'react';
import { createRoot } from 'react-dom/client';
import store from './store';
import {Provider} from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './app/App';


import './styles/index.scss';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
/*   <React.StrictMode> */
    // провайдер прокинет редаксовский стор в всех компоненты внутри...
    <Provider store={store}>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </Provider>
 /*  </React.StrictMode> */
);


