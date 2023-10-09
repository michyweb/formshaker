import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field, submit, change } from 'redux-form'
import { Button, Row, Modal, ModalHeader, ModalBody, ModalFooter, Col } from 'reactstrap'
import { connect } from 'react-redux'

import { submitPattern } from '../actions'

const onSubmit = (values, dispatch, props) => {
  const data = {
    ...values
  }
  props.submitPattern(data, props)
  props.onClose()
}

const form = reduxForm({
  form: 'patternAddForm',
  onSubmit
})

class ModalAdd extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  }

  closeModal = () => {
    this.props.onClose()
  }

  submit = () => {
    this.props.submitForm()
  }

  changeEdit = () => {
    this.setState({ editing: true })
  }

  render () {
    const { open, handleSubmit } = this.props
    return (
      <Modal isOpen={open} toggle={this.closeModal} size='lg'>
        <ModalHeader toggle={this.closeModal}>Crear patrón</ModalHeader>
        <ModalBody>
          <form className='form-horizontal' onSubmit={handleSubmit}>
            <Row>
              <Col>
                <label>Nombre</label>
                <Field component='input' className='form-control' name='name' />
                <br />
                <label>Regex</label>
                <Field component='input' className='form-control' name='regex' />
                <br />
                <label>Valor</label>
                <Field component='textarea' rows={10} className='form-control' name='value' />
              </Col>
            </Row>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button style={{ backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }} onClick={() => this.closeModal()}>Cerrar</Button>
          <Button style={{ backgroundColor: '#E20000', color: 'white', fontWeight: 'bold' }} type='button' onClick={() => this.submit()}>Guardar</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({

})

const bindActions = dispatch => ({
  submitForm: () => dispatch(submit('patternAddForm')),
  submitPattern: (data) => dispatch(submitPattern(data)),
  loadFormValue: (form, field, value) => dispatch(change(form, field, value))
})

export default connect(mapStateToProps, bindActions)(form(ModalAdd))
