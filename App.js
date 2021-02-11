import React from 'react';
import { Provider } from 'react-redux'
import Home from './Home';
import configureStore from './store'
import { PersistGate } from 'redux-persist/integration/react'
const {store, persistor} = configureStore();

function App() {
  return (
    <>
     <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Home/>
        </PersistGate>
    </Provider>
  </>
  );
}
export default App