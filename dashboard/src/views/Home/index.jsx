import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import swal from 'sweetalert2/dist/sweetalert2.all.js'

import { downloadAgent, loadInject, modifyInject } from './actions'

import logo from '../../assets/logo3.png'

class Home extends React.Component {
  state = {
    refresh: false
  }

  componentDidMount () {
    this.props.loadInject()
  }

  // eslint-disable-next-line react/no-typos
  static getDerivedStateFromProps (props, state) {
    if (props.refresh) {
      props.loadInject()
      return { refresh: false }
    }
    return { refresh: false }
  }

  render () {
    return (
      <div style={{ textAlign: 'center' }}>
        <img src={logo} width='50%' height='100%' alt='Formshaker' style={{ marginTop: 10 }} />
        <div style={{ fontWeight: 'bold', marginTop: 20 }}>Standalone version</div>
        <div className='custom-toggle custom-toggle-primary' title='Standalone version' style={{ marginBottom: 10 }} onClick={() => this.props.modifyInject()}>
          <input type='checkbox' checked={this.props.inject} onChange={() => {}} />
          <span className='custom-toggle-slider rounded-circle' />
        </div>
        <br />

        <Button
          className='btn btn-danger' onClick={() => {
            swal.fire({
              title: 'Selecciona tipo',
              confirmButtonText: 'Aceptar',
              html: `
            <div style="text-align: center;">
              <h3>Tipo</h3>
              <div style="width: 100%">
              <select id= "swal-select" class="form-control">
                <option value="iframeAJAX">Iframe & AJAX</option>
                <option value="iframe">Iframe</option>
                <option value="ajax">AJAX</option>
              </select>
              </div>
              <br />
              <h3>API URL</h3>
              <input type="text" placeholder="http://${window.location.hostname}:4040" class="form-control" id="swal-url"/>
              <br />
              <h3>LIMITE DE PÁGINAS VISITADAS</h3>
              <input type="number" placeholder="30" class="form-control" id="swal-limit"/>
              <br />
              <h3>Opciones</h3>
              <label>Minificado: <input type="checkbox" id="swal-minify"/></label>
              <br />
              <label>Ofuscado: <input type="checkbox" id="swal-obfuscated" /></label>
            </div>
            `,
              preConfirm: () => {
                return {
                  mode: document.getElementById('swal-select').value,
                  minify: document.getElementById('swal-minify').checked,
                  obfuscated: document.getElementById('swal-obfuscated').checked,
                  limit: document.getElementById('swal-limit').value ? parseInt(document.getElementById('swal-limit').value, 10) : 30,
                  url: document.getElementById('swal-url').value ? document.getElementById('swal-url').value : `http://${window.location.hostname}:4040`
                }
              }
            }).then((result) => {
              if (result.isConfirmed) {
                this.props.downloadAgent(result.value)
              }
            })
          }}
        >Descargar script
        </Button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  inject: state.home.inject,
  refresh: state.home.refresh
})

const bindActions = dispatch => ({
  downloadAgent: data => dispatch(downloadAgent(data)),
  loadInject: () => dispatch(loadInject()),
  modifyInject: () => dispatch(modifyInject())
})

export default connect(mapStateToProps, bindActions)(Home)
