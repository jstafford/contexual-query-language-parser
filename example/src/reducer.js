import {combineReducers} from 'redux'
import {QUERY_CHANGE} from './actions'

const queryString = (state = '', action) => {
  switch (action.type) {
    case QUERY_CHANGE:
      return action.payload
    default:
      return state
  }
}

const rootReducer = combineReducers({queryString})

export default rootReducer
