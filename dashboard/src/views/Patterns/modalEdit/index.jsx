import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field, submit, change } from 'redux-form'
import { Button, Row, Modal, ModalHeader, ModalBody, ModalFooter, Col } from 'reactstrap'
import { connect } from 'react-redux'

import { submitEditPattern } from '../actions'

const onSubmit = (values, dispatch, props) => {
  const data = {
    ...props.data,
    ...values
  }
  props.submitEditPattern(data, props)
  props.onClose()
}

const form = reduxForm({
  form: 'patternEditForm',
  onSubmit
})

class ModalEdit extends Component {
  static propTypes = {
    data: PropTypes.any.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  }

  state = {
    editing: false
  }

  closeModal = () => {
    this.props.onClose()
  }

  componentDidMount () {
    this.props.loadFormValue('patternEditForm', 'name', this.props.data.name)
    this.props.loadFormValue('patternEditForm', 'regex', this.props.data.regex)
    this.props.loadFormValue('patternEditForm', 'value', this.props.data.value)
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
        <ModalHeader toggle={this.closeModal}>Editar patrón</ModalHeader>
        <ModalBody>
          <form className='form-horizontal' onSubmit={handleSubmit}>
            <Row>
              <Col>
                <label>Nombre</label>
                <Field component='input' disabled={!this.state.editing} className='form-control' name='name' />
                <br />
                <label>Regex</label>
                <Field component='input' disabled={!this.state.editing} className='form-control' name='regex' />
                <br />
                <label>Valor</label>
                <Field component='textarea' rows={10} disabled={!this.state.editing} className='form-control' name='value' />
              </Col>
            </Row>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button style={{ backgroundColor: 'gray', color: 'white' }} onClick={() => this.closeModal()}>Cerrar</Button>
          {this.state.editing
            ? <Button style={{ backgroundColor: '#E20000', color: 'white', fontWeight: 'bold' }} type='button' onClick={() => this.submit()}>Guardar</Button>
            : <Button style={{ backgroundColor: '#E20000', color: 'white', fontWeight: 'bold' }} type='button' onClick={() => this.changeEdit()}>Editar</Button>}
        </ModalFooter>
      </Modal>
    )
  }
}

const bindActions = dispatch => ({
  submitForm: () => dispatch(submit('patternEditForm')),
  submitEditPattern: (data) => dispatch(submitEditPattern(data)),
  loadFormValue: (form, field, value) => dispatch(change(form, field, value))
})

export default connect(null, bindActions)(form(ModalEdit))
