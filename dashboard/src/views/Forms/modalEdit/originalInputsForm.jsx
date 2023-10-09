import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field, submit, change } from 'redux-form'
import { Card } from 'reactstrap'
import { connect } from 'react-redux'
import moment from 'moment'

import { submitEditForm } from '../actions'
import './styles.css'

const form = reduxForm({
  form: 'originalInputsForm'
})

class OriginalInputsForm extends Component {
  static propTypes = {
    data: PropTypes.any.isRequired
  }

  componentDidMount () {
    this.props.data.originalInputs.map(x => {
      if (x.Type !== 'file') {
        this.props.loadFormValue('originalInputsForm', x.name, x.value)
      }
      return ''
    })
  }

  render () {
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
      <div>
        <label><strong>Valores más recientes ({this.props.data.updatedDate && this.props.data.updatedDate.$date ? moment(this.props.data.updatedDate.$date).add(-2, 'hour').format('DD-MM-YYYY HH:mm:ss') : ''})</strong></label>
        <Card style={{ padding: 10 }}>
          {this.props.data.originalInputs.length > 0
            ? this.props.data.originalInputs.map((x, index) => {
              return (
                <div key={x.name + index}>
                  <label style={x.modified ? { color: 'green' } : { color: 'black' }}>{x.name} - <strong>({x.Type})</strong></label>
                  {
                  x.Type === 'select-one'
                    ? <Field component='select' disabled className='form-control' name={x.name}>
                      {options(this.props.data.originalInputs[index])}
                    </Field> // eslint-disable-line
                    : (
                        x.Type === 'file'
                          ? <div />
                          : <Field component='input' disabled className='form-control' name={x.name} />
                      )
                }
                </div>
              )
            })
            : null}
        </Card>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formulario: state.form.originalInputsForm
})

const bindActions = dispatch => ({
  submitForm: () => dispatch(submit('originalInputsForm')),
  submitEditForm: (data) => dispatch(submitEditForm(data)),
  loadFormValue: (form, field, value) => dispatch(change(form, field, value))
})

export default connect(mapStateToProps, bindActions)(form(OriginalInputsForm))
