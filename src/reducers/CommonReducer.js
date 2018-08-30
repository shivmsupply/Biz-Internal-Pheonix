import * as types from "../constants/";

const initialState = {
    savedInput: ''
}

export default function(state=initialState, action) {
	switch(action.type) {
        case types.SAVE_INPUT_DATA: 
            return Object.assign({}, state, {
                savedInput: action.data
            })
        case types.TAB_URL: 
            return {...state, tabUrl: action.url}
        default: 
            return state;    
    }
}