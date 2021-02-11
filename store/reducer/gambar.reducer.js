import * as Actions from '../actions'

const initialState = {
    image:[]
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case Actions.SAVE_IMAGE:
            return{
                ...state,
                image: [...state.image, action.payload]
            }
        default: 
            return state
    }

}

export default reducer