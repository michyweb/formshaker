import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Modal, ModalHeader, ModalBody, ModalFooter, Col, Card, CardBody, CardHeader, ListGroup, ListGroupItem } from 'reactstrap'
import { connect } from 'react-redux'
import _ from 'underscore'
import swal from 'sweetalert2/dist/sweetalert2.all.js'

class ModalSecrets extends Component {
  static propTypes = {
    data: PropTypes.any.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  }

  state = {
    findings: ['password', 'secret', 'email', 'accessToken', 'appId', 'user_token', 'ucc'],
    values: []
  }

  closeModal = () => {
    this.props.onClose()
  }

  deleteSecret = y => {
    const index = _.findIndex(this.state.findings, x => x === y)
    if (index > -1) {
      const findings = this.state.findings.slice()
      findings.splice(index, 1)
      this.setState({
        findings,
        values: []
      })
    }
  }

  addSecret = () => {
    swal.fire({
      title: 'Introduce clave',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Añadir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && result.value !== '') {
        this.setState({ findings: [...this.state.findings, result.value], values: [] })
      }
    })
  }

  render () {
    const { open } = this.props

    const result = this.props.data.map((x, index) => {
      return x.inputs.map((y) => {
        const indice = _.findIndex(this.state.findings, x => x === y.name)
        const indiceValor = _.findIndex(this.state.values, x => x === y.value)
        if (indice > -1 && indiceValor === -1 && y.value !== '' && x.colour !== 'gray') {
          this.state.values.push(y.value)
          return (
            <ListGroupItem style={{ backgroundColor: x.colour }} key={`${y.name}_${index}`}>{`${y.name}: ${y.value}`}</ListGroupItem>
          )
        }
      })
    })

    return (
      <Modal isOpen={open} toggle={this.closeModal} style={{ maxWidth: 1000 }}>
        <ModalHeader toggle={this.closeModal}>Ver secretos</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={6}>
              <Card>
                <CardHeader style={{ height: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'lightgray' }}>
                  <strong>Añadir clave</strong>
                  <Button onClick={() => this.addSecret()}>+</Button>
                </CardHeader>
                <CardBody style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <ListGroup style={{ width: '100%' }}>
                    {this.state.findings.map((x, index) => {
                      return (
                        <ListGroupItem key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <label>{x}</label>
                          <Button style={{ color: 'white', backgroundColor: '#E20000', fontWeight: 'bold' }} onClick={() => this.deleteSecret(x)}>-</Button>
                        </ListGroupItem>
                      )
                    })}
                  </ListGroup>
                </CardBody>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <CardHeader style={{ height: 80, display: 'flex', alignItems: 'center', backgroundColor: 'lightgray' }}>
                  <strong>Secretos</strong>
                </CardHeader>
                <CardBody>
                  <ListGroup>
                    {result}
                  </ListGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button style={{ backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }} onClick={() => this.closeModal()}>Cerrar</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default connect(null, null)(ModalSecrets)
