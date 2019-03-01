import {
  WEB3_CONNECTED
} from '../actions';

const defaultState = {};

export const handlers = {
  transactionReducer:{
    [WEB3_CONNECTED]: (state, action) => {
      return {
        ...state,
        blockExplorer: action.payload.blockExplorer
      }
    }
  }
}  

function reducer (state = defaultState, action) {
  const handler = handlers.transactionReducer[action.type]
  if (!handler) { return state }
  return handler(state, action)
}

export default reducer;