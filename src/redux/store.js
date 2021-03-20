/* eslint-disable no-underscore-dangle */
import { createStore, combineReducers } from 'redux';

import storedParagraphs from './reducers/paragraphs-reducer';

const reducers = combineReducers({
  storedParagraphs,
});

export default function configStore(initialState = undefined) {
  return createStore(
    reducers,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
  );
}
