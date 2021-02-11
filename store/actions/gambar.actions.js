export const SAVE_IMAGE = 'SAVE_IMAGE'

export function saveImage(name, folder){
    return async (dispatch, getState) => {
        dispatch({type: SAVE_IMAGE, payload: {name: name, folder: folder}})
    }
}