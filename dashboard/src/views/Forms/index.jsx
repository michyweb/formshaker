import React from 'react'
import { Row, Col, Button } from 'reactstrap'
import { connect } from 'react-redux'
import MaterialTable from '@material-table/core'

import ModalEdit from './modalEdit'
import ModalSecrets from './modalSecrets'

import { loadForms, checkFormWithInject, appendForm, replaceForm } from './actions'

const formatForm = (row) => {
  return (
    <div style={{ width: 700, fontSize: 14 }}>
      <a style={{ color: 'black' }} target='_blank' href={row.action} title={row.action} rel='noreferrer'>{row.action.substring(0, 80)}...</a>
      <br />
      <a style={{ color: 'black' }} target='_blank' href={row.origin} title={row.origin} rel='noreferrer'>{row.origin.substring(0, 80)}...</a>
    </div>

  )
}

const formatUsed = (row) => {
  return (
    <div>{row.used ? 'Sí' : 'No'}</div>
  )
}

const formatInject = (row) => {
  return (
    <div>{row.inject ? 'Sí' : 'No'}</div>
  )
}

const formatOptions = (row, handleChangeForm) => {
  return (
    <div>
      <Button style={{ color: 'white', backgroundColor: '#E20000', fontWeight: 'bold' }} onClick={() => handleChangeForm(row)}>Editar</Button>
    </div>
  )
}

class Forms extends React.Component {
  state = {
    currentRow: '',
    showModalEdit: false,
    showModalSecrets: false,
    refresh: false
  }

  componentDidMount () {
    this.props.loadForms()
    this.ws = new WebSocket(`ws://${window.location.hostname}:4040/ws`) // eslint-disable-line

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({ type: 'WS_GREETINGS' }))
    }

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      switch (data.type) {
        case 'APPEND_FORM':
          this.props.appendForm(data.data)
          break
        case 'REPLACE_FORM':
          this.props.replaceForm(data.data)
          break
        default:
      }
    }
  }

  showModal = (row) => {
    this.setState({ currentRow: row, showModalEdit: true })
  }

  closeModalEdit = () => {
    this.setState({ currentRow: '', showModalEdit: false })
  }

  showModalSecret = () => {
    this.setState({ showModalSecrets: true })
  }

  closeModalSecret = () => {
    this.setState({ showModalSecrets: false })
  }

  render () {
    const columns = [
      { title: 'Formulario', field: 'action', render: rowData => formatForm(rowData) },
      { title: 'Código de estado', field: 'HttpStatusCode' },
      { title: 'ID ejecución', field: 'executionID' },
      { title: 'Intento', field: 'Attempt' },
      { title: 'Inyectable', field: 'inject', render: rowData => formatInject(rowData) },
      { title: 'Utilizado', field: 'used', render: rowData => formatUsed(rowData) },
      { title: 'Acción', field: '_', render: rowData => formatOptions(rowData, this.showModal) }
    ]

    return (
      <>
        <Row style={{ margin: 10 }}>
          <Col md={12}>
            <Button style={{ color: 'white', backgroundColor: '#E20000', fontWeight: 'bold' }} onClick={() => this.showModalSecret()}>Ver secretos</Button>
            <MaterialTable
              columns={columns}
              data={this.props.data}
              title='Formularios'
              options={{
                selection: true,
                search: true,
                rowStyle: row => {
                  return { backgroundColor: row.colour }
                }
              }}
              actions={[
                {
                  tooltip: 'Inyectar formularios',
                  icon: 'colorize',
                  onClick: (evt, data) => { this.props.checkFormWithInject(data) }
                }
              ]}
            />
          </Col>
        </Row>
        {this.state.showModalEdit
          ? <ModalEdit open={this.state.showModalEdit} onClose={() => this.closeModalEdit()} data={this.state.currentRow} />
          : null}
        {this.state.showModalSecrets
          ? <ModalSecrets open={this.state.showModalSecrets} onClose={() => this.closeModalSecret()} data={this.props.data} />
          : null}
      </>
    )
  }
}

const mapStateToProps = state => ({
  data: state.home.data,
  refresh: state.home.hasToFetch
})

const bindActions = dispatch => ({
  loadForms: () => dispatch(loadForms()),
  appendForm: data => dispatch(appendForm(data)),
  replaceForm: data => dispatch(replaceForm(data)),
  checkFormWithInject: data => dispatch(checkFormWithInject(data))
})

export default connect(mapStateToProps, bindActions)(Forms)
