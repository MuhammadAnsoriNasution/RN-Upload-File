import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';

import thunk from 'redux-thunk';
import rootReducer from './reducer';

const composerEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)


export default () => {
    let store = createStore(persistedReducer, composerEnhancer(applyMiddleware(thunk)));
    let persistor = persistStore(store)
    return { store, persistor }
}
  