import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field, submit, change } from 'redux-form'
import { Button, Row, Modal, ModalHeader, ModalBody, ModalFooter, Col, Card } from 'reactstrap'
import { connect } from 'react-redux'
import moment from 'moment'

import Dropzone from '../../../components/Dropzone'
import OriginalInputsForm from './originalInputsForm'

import { submitEditForm } from '../actions'
import './styles.css'

const onSubmit = (values, dispatch, props) => {
  const inputs = props.data.inputs.map(x => {
    if (x.Type === 'file') {
      x.value = props.file.value
      x.contentType = props.file.contentType
      x.fileName = props.file.fileName
      x.modified = true
    } else {
      if (typeof values[x.name] !== 'undefined' && x.value !== values[x.name]) {
        x.modified = true
      } else {
        x.modified = false
      }
      if (values[x.name]) {
        x.value = values[x.name]
      }
    }
    return x
  })

  const data = {
    _id: props.data._id,
    inputs
  }
  props.submitEditForm(data, props)
  props.onClose()
}

const form = reduxForm({
  form: 'formEditForm',
  onSubmit
})

class ModalEdit extends Component {
  static propTypes = {
    data: PropTypes.any.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  }

  state = {
    editing: true,
    tempFile: null
  }

  openChangeImageModal = (tempFile) => {
    this.setState({ tempFile })
  }

  closeModal = () => {
    this.props.onClose()
  }

  componentDidMount () {
    this.props.data.inputs.map(x => {
      if (x.Type !== 'file') {
        this.props.loadFormValue('formEditForm', x.name, x.value)
      }
      return ''
    })
  }

  submit = () => {
    this.props.submitForm()
  }

  changeEdit = () => {
    this.setState({ editing: true })
  }

  render () {
    const { open, handleSubmit } = this.props

    const options = x => {
      const data = JSON.parse(x.value)
      const result = data.map((y, index) => {
        return (
          <option value={y.value} key={index}>{y.text}</option>
        )
      })
      return result
    }

    return (
      <Modal isOpen={open} toggle={this.closeModal} size='lg'>
        <ModalHeader toggle={this.closeModal}>Editar formulario ({this.props.data.mode})</ModalHeader>
        <ModalBody>
          <form className='form-horizontal' onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <label><strong>Valores a inyectar ({moment(this.props.data.creationDate.$date).add(-2, 'hour').format('DD-MM-YYYY HH:mm:ss')})</strong></label>
                <Card style={{ padding: 10 }}>
                  {this.props.data.inputs.length > 0
                    ? this.props.data.inputs.map((x, index) => {
                      return (
                        <div key={x.name + index}>
                          <label style={x.modified ? { color: 'green' } : { color: 'black' }}>{x.name} - <strong>({x.Type})</strong></label>
                          {
                          x.Type === 'select-one'
                            ? <Field component='select' disabled={!this.state.editing} className='form-control' name={x.name}>
                              {options(this.props.data.originalInputs[index])}
                            </Field> // eslint-disable-line
                            : (
                                x.Type === 'file'
                                  ? <div>
                                    <Field
                                      name={x.name}
                                      placeholder='Imagen'
                                      component={Dropzone}
                                      imageValue={x.value}
                                      type='file'
                                    />
                                  </div> // eslint-disable-line
                                  : <Field component='input' disabled={!this.state.editing} className='form-control' name={x.name} />
                              )
                        }
                        </div>
                      )
                    })
                    : null}
                </Card>
              </Col>
              <Col md={6}>
                <OriginalInputsForm data={this.props.data} />

              </Col>
            </Row>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button style={{ backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }} onClick={() => this.closeModal()}>Cerrar</Button>
          {this.state.editing
            ? <Button style={{ backgroundColor: '#E20000', color: 'white', fontWeight: 'bold' }} type='button' onClick={() => this.submit()}>Guardar</Button>
            : <Button style={{ backgroundColor: '#E20000', color: 'white', fontWeight: 'bold' }} type='button' onClick={() => this.changeEdit()}>Editar</Button>}
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  formulario: state.form.casesEditForm,
  file: state.home.file
})

const bindActions = dispatch => ({
  submitForm: () => dispatch(submit('formEditForm')),
  submitEditForm: (data) => dispatch(submitEditForm(data)),
  loadFormValue: (form, field, value) => dispatch(change(form, field, value))
})

export default connect(mapStateToProps, bindActions)(form(ModalEdit))
