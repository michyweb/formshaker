import React, { Component } from 'react'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import { Switch } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@material-ui/core/styles'

import configureStore, { history } from './store'
import { DefaultRoute } from './components'

import { DefaultLayout } from './containers'

// Styles
import './assets/css/nucleo.css'
import './assets/scss/dashboard-react.scss'
import 'font-awesome/css/font-awesome.min.css'

class App extends Component {
  render () {
    const applyTheme = createTheme({
      typography: {
        useNextVariants: true
      }
    })
    return (
      <ThemeProvider theme={applyTheme}>
        <Provider store={configureStore()}>
          <ConnectedRouter history={history}>
            <Switch>
              <DefaultRoute path='/' name='Inicio' component={DefaultLayout} />
            </Switch>
          </ConnectedRouter>
        </Provider>
      </ThemeProvider>
    )
  }
}

export default App
