import { combineReducers, compose } from 'redux'
import gambar from './gambar.reducer'
export const composerEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const rootReducer = combineReducers({
    gambar
})

export default rootReducer


