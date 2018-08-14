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
        default: 
            return state;    
    }
}