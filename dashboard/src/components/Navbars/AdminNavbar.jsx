import React from 'react'
import { Link } from 'react-router-dom'
import {
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media
} from 'reactstrap'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import logo from '../../assets/logo2.png'

const propTypes = {
  children: PropTypes.node
}

const defaultProps = {}

class AdminNavbar extends React.Component {
  render () {
    return (
      <>
        <Navbar className='navbar-top navbar-dark' style={{ backgroundColor: 'gray', position: 'relative' }} expand='md' id='navbar-main'>
          <Container fluid>
            <Link
              className='h4 mb-0 text-white text-uppercase d-none d-lg-inline-block'
              to='/'
            >
              {this.props.brandText}
            </Link>
            <Nav className='align-items-center d-none d-md-flex' navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle className='pr-0' nav>
                  <Media className='align-items-center'>
                    <span className='avatar avatar-sm rounded-circle' style={{ backgroundColor: 'white' }}>
                      <img
                        alt='...'
                        src={logo}
                      />
                    </span>

                  </Media>
                </DropdownToggle>

              </UncontrolledDropdown>
            </Nav>
          </Container>
        </Navbar>
      </>
    )
  }
}

AdminNavbar.propTypes = propTypes
AdminNavbar.defaultProps = defaultProps

const mapStateToProps = state => ({
  inject: state.home.inject,
  refresh: state.home.refresh
})

const bindActions = dispatch => ({
  loadInject: () => dispatch(loadInject()),
  modifyInject: () => dispatch(modifyInject())
})

export default connect(mapStateToProps, bindActions)(AdminNavbar)
