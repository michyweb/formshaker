import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Route } from 'react-router'
import { connect } from 'react-redux'

class DefaultRoute extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  render () {
    const { component: RealComponent, ...restProps } = this.props
    return (
      <Route
        {...restProps} render={props => {
          return (
            <RealComponent {...props} />
          )
        }}
      />
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    currentURL: ownProps.location.pathname
  }
}

export default withRouter(connect(mapStateToProps)(DefaultRoute))
