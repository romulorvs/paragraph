import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './index.css';

import { updateState } from './redux/actions/paragraphs-actions';
import configStore from './redux/store';
import { ifff } from './utils';
import App from './views/app';

const storedState = ifff(localStorage.getItem('@paragraph:data'), r => JSON.parse(r));

const store = configStore(storedState);

store.dispatch({
  type: 'RESET',
});

store.subscribe(() => {
  localStorage.setItem('@paragraph:data', JSON.stringify(store.getState()));
});

// setInterval(() => {
//   if (!document.hasFocus()) {
//     store.dispatch(updateState());
//   }
// }, 400);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
