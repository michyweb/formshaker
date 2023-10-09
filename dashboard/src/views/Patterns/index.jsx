import React from 'react'
import {
  Row,
  Col,
  Button
} from 'reactstrap'
import { connect } from 'react-redux'
import MaterialTable from '@material-table/core'
import swal from 'sweetalert2/dist/sweetalert2.all.js'

import ModalAdd from './modalAdd'
import ModalEdit from './modalEdit'
import ModalSettings from './modalSettings'

import { loadPatterns, deletePattern } from './actions'

const formatOptions = (row, showModal, props) => {
  return (
    <div>
      <Button style={{ backgroundColor: 'gray', color: 'white' }} onClick={() => showModal(row)}>Editar</Button>
      <Button
        style={{ color: 'white', backgroundColor: '#E20000', fontWeight: 'bold' }}
        onClick={() => {
          swal.fire({
            title: 'Borrar patrón',
            text: '¿Estás seguro de que deseas borrar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.value) {
              props.deletePattern(row)
            }
          })
        }}
      >Borrar
      </Button>
    </div>
  )
}

class Patterns extends React.Component {
  state = {
    currentRow: '',
    showModal: false,
    showModalEdit: false,
    showModalSettings: false,
    refresh: false
  }

  componentDidMount () {
    this.props.loadPatterns()
  }

  // eslint-disable-next-line react/no-typos
  static getDerivedStateFromProps (props, state) {
    if (props.refresh) {
      props.loadPatterns()
      return { refresh: false }
    }
    return { refresh: false }
  }

  showModal = () => {
    this.setState({ showModal: true })
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }

  showModalEdit = (row) => {
    this.setState({ currentRow: row, showModalEdit: true })
  }

  closeModalEdit = () => {
    this.setState({ currentRow: '', showModalEdit: false })
  }

  showModalSettings = () => {
    this.setState({ showModalSettings: true })
  }

  closeModalSettings = () => {
    this.setState({ currentRow: '', showModalSettings: false })
  }

  render () {
    const columnData = [
      { title: 'Nombre', field: 'name' },
      { title: 'Regex', field: 'regex' },
      { title: 'Valor', field: 'value', render: rowData => <div title={rowData.value}>{rowData.value ? rowData.value.substring(0, 30) : ''}</div> },
      { title: 'Opciones', field: '_', render: rowData => formatOptions(rowData, this.showModalEdit, this.props) }
    ]
    return (
      <>
        <Row style={{ margin: 10 }}>
          <Col md={12}>
            <Button style={{ color: 'white', backgroundColor: '#E20000', fontWeight: 'bold' }} onClick={() => this.showModal()}>Crear patrón</Button>
            <Button style={{ color: 'white', backgroundColor: 'gray', fontWeight: 'bold' }} onClick={() => this.showModalSettings()}>Ajustes</Button>
            <br />
            <MaterialTable
              columns={columnData}
              data={this.props.data}
              title='Patrones'
            />
          </Col>
        </Row>
        {this.state.showModal
          ? <ModalAdd open={this.state.showModal} onClose={() => this.closeModal()} />
          : null}
        {this.state.showModalEdit
          ? <ModalEdit open={this.state.showModalEdit} onClose={() => this.closeModalEdit()} data={this.state.currentRow} />
          : null}
        {this.state.showModalSettings
          ? <ModalSettings open={this.state.showModalSettings} onClose={() => this.closeModalSettings()} />
          : null}
      </>
    )
  }
}

const mapStateToProps = state => ({
  data: state.patterns.data,
  refresh: state.patterns.hasToFetch
})

const bindActions = dispatch => ({
  loadPatterns: () => dispatch(loadPatterns()),
  deletePattern: data => dispatch(deletePattern(data))
})

export default connect(mapStateToProps, bindActions)(Patterns)
