import axios from '../../requesters/axios'
import swal from 'sweetalert2/dist/sweetalert2.all.js'

import {
  LOAD_INJECT,
  MODIFY_INJECT
} from '../../actionTypes/home'

export const downloadAgent = data => {
  return dispatch => {
    axios.get(`/agent.js?mode=${data.mode}&minify=${data.minify}&obfuscated=${data.obfuscated}&limit=${data.limit}&url=${data.url}`)
      .then(() => {
        swal.fire({
          title: 'Agente generado',
          html: `<a href="${window.location.protocol}//${window.location.hostname}:4040/api/agent.js" target="_blank">${window.location.protocol}//${window.location.hostname}:4040/api/agent.js</a>`,
          confirmButtonText: 'Cerrar'
        })
      })
  }
}

export const loadInject = () => {
  return dispatch => {
    axios.get('/inject')
      .then((response) => {
        dispatch({
          type: LOAD_INJECT,
          data: response.data
        })
      })
  }
}

export const modifyInject = () => {
  return dispatch => {
    axios.post('/inject')
      .then(() => {
        dispatch({
          type: MODIFY_INJECT
        })
      })
  }
}
