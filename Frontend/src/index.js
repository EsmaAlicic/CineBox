import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import {createStore} from "redux";
import reducers from "./redux/reducers";
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';


const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(persistedReducer);
let persist = persistStore(store);

ReactDOM.render(
<React.StrictMode>
  <Provider store={store}>
      <PersistGate loading={null} persistor={persist}>
          <App />
      </PersistGate>
  </Provider>
</React.StrictMode>,
document.getElementById('root')
);

reportWebVitals();
