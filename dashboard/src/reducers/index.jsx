import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import { createBrowserHistory } from 'history'
import { connectRouter } from 'connected-react-router'

import home from './homeReducer'
import patterns from './patternsReducer'

export const history = createBrowserHistory()

const reducers = combineReducers({
  router: connectRouter(history),
  form,
  home,
  patterns
})

export default reducers
