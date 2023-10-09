import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'

import logo from '../../assets/logo.png'
import AdminNavbar from '../../components/Navbars/AdminNavbar.jsx'
import Sidebar from '../../components/Sidebar/Sidebar.jsx'

import routes from '../../routes'

class DefaultLayout extends Component {
  componentDidUpdate (e) {
    document.documentElement.scrollTop = 0
    document.scrollingElement.scrollTop = 0
  }

  getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].path
        ) !== -1
      ) {
        return routes[i].name
      }
    }
    return ''
  }

  render () {
    return (
      <>
        <Sidebar
          {...this.props}
          routes={routes}
          logo={{
            innerLink: '/',
            imgSrc: logo,
            imgAlt: 'logo'
          }}
        />
        <div className='main-content'>
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          <Switch>
            {routes.map((route, idx) => {
              return route.component
                ? (<Route
                    key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                      <route.component {...props} />
                    )}
                   />)
                : (null)
            }
            )}
            <Redirect from='/' to='/home' />
          </Switch>
          <Container fluid />
        </div>
      </>
    )
  }
}

export default DefaultLayout
