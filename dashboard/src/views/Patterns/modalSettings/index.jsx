import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Modal, ModalHeader, ModalBody, ModalFooter, Col, Card, CardBody, CardHeader, ListGroup, ListGroupItem } from 'reactstrap'
import { connect } from 'react-redux'
import swal from 'sweetalert2/dist/sweetalert2.all.js'

import { loadSeeds, createSeed, removeSeed, loadBlacklist, createBlacklist, removeBlacklist } from '../actions'

class ModalSettings extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  }

  state = {
    refresh: false
  }

  componentDidMount () {
    this.props.loadSeeds()
    this.props.loadBlacklist()
  }

  // eslint-disable-next-line react/no-typos
  static getDerivedStateFromProps (props, state) {
    if (props.refresh) {
      props.loadSeeds()
      props.loadBlacklist()
      return { refresh: false }
    }
    return { refresh: false }
  }

  closeModal = () => {
    this.props.onClose()
  }

  addSeed = () => {
    swal.fire({
      title: 'Introduce clave',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Añadir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && result.value !== '') {
        this.props.createSeed({ value: result.value })
      }
    })
  }

  addBlacklist = () => {
    swal.fire({
      title: 'Introduce clave',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Añadir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && result.value !== '') {
        this.props.createBlacklist({ value: result.value })
      }
    })
  }

  render () {
    const { open } = this.props
    return (
      <Modal isOpen={open} toggle={this.closeModal} style={{ maxWidth: 1000 }}>
        <ModalHeader toggle={this.closeModal}>Ajustes</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={6}>
              <Card>
                <CardHeader style={{ height: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'lightgray' }}>
                  <strong>Seeds</strong>
                  <Button onClick={() => this.addSeed()}>+</Button>
                </CardHeader>
                <CardBody style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <ListGroup style={{ width: '100%' }}>
                    {this.props.seeds.map((x, index) => {
                      return (
                        <ListGroupItem key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <label>{x.value}</label>
                          <Button style={{ color: 'white', backgroundColor: '#E20000', fontWeight: 'bold' }} onClick={() => this.props.removeSeed(x._id.$oid)}>-</Button>
                        </ListGroupItem>
                      )
                    })}
                  </ListGroup>
                </CardBody>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <CardHeader style={{ height: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'lightgray' }}>
                  <strong>Blacklist</strong>
                  <Button onClick={() => this.addBlacklist()}>+</Button>
                </CardHeader>
                <CardBody>
                  <ListGroup>
                    {this.props.blacklist.map((x, index) => {
                      return (
                        <ListGroupItem key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <label>{x.value}</label>
                          <Button style={{ color: 'white', backgroundColor: '#E20000', fontWeight: 'bold' }} onClick={() => this.props.removeBlacklist(x._id.$oid)}>-</Button>
                        </ListGroupItem>
                      )
                    })}
                  </ListGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => this.closeModal()}>Cerrar</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  seeds: state.patterns.seeds,
  blacklist: state.patterns.blacklist,
  refresh: state.patterns.refresh
})

const bindActions = dispatch => ({
  loadSeeds: () => dispatch(loadSeeds()),
  createSeed: data => dispatch(createSeed(data)),
  removeSeed: data => dispatch(removeSeed(data)),
  loadBlacklist: () => dispatch(loadBlacklist()),
  createBlacklist: data => dispatch(createBlacklist(data)),
  removeBlacklist: data => dispatch(removeBlacklist(data))
})

export default connect(mapStateToProps, bindActions)(ModalSettings)
