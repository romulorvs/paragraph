import debounce from 'debounce';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './index.css';

import App from './App';
import { updateState } from './redux/actions/paragraphs-actions';
import configStore from './redux/store';
import { ifff } from './utils';

const storedState = ifff(localStorage.getItem('@paragraph:data'), r => JSON.parse(r));

const store = configStore(storedState);
store.subscribe(
  debounce(() => {
    localStorage.setItem('@paragraph:data', JSON.stringify(store.getState()));
  }, 600),
);

setInterval(() => {
  if (!document.hasFocus()) {
    store.dispatch(updateState());
  }
}, 400);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
