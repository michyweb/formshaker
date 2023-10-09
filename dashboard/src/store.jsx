import thunk from 'redux-thunk'
import { createBrowserHistory } from 'history'
import { createStore, applyMiddleware, compose } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import rootReducer from './reducers'

export const history = createBrowserHistory()

const enhancers = []
const middleware = [
  routerMiddleware(history),
  thunk
]

export default function configureStore (initialState) {
  const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
  )

  const store = createStore(
    connectRouter(history)(rootReducer),
    initialState,
    composedEnhancers
  )

  return store
}
