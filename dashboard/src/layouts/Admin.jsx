import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'
import AdminNavbar from '../components/Navbars/AdminNavbar.jsx'
import Sidebar from '../components/Sidebar/Sidebar.jsx'

import routes from 'routes.js'

class Admin extends React.Component {
  componentDidUpdate (e) {
    document.documentElement.scrollTop = 0
    document.scrollingElement.scrollTop = 0
  }

  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === '/admin') {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        )
      } else {
        return null
      }
    })
  }

  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name
      }
    }
    return 'Brand'
  }

  render () {
    return (
      <>
        <Sidebar
          {...this.props}
          routes={routes}
          logo={{
            innerLink: '/',
            imgSrc: 'http://via.placeholder.com/400x150',
            imgAlt: 'logo'
          }}
        />
        <div className='main-content'>
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          <Switch>{this.getRoutes(routes)}</Switch>
          <Container fluid />
        </div>
      </>
    )
  }
}

export default Admin
