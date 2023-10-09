import axios from '../../requesters/axios'
import swal from 'sweetalert2/dist/sweetalert2.all.js'

import {
  LOAD_PATTERNS,
  SUBMIT_PATTERN,
  SUBMIT_EDIT_PATTERN,
  DELETE_PATTERN,
  LOAD_SEEDS,
  CREATE_SEED,
  REMOVE_SEED,
  LOAD_BLACKLIST,
  CREATE_BLACKLIST,
  REMOVE_BLACKLIST
} from '../../actionTypes/patterns'

export const loadPatterns = () => {
  return dispatch => {
    axios.get('/patterns')
      .then((response) => {
        dispatch({
          type: LOAD_PATTERNS,
          data: response.data
        })
      })
  }
}

export const submitPattern = (data) => {
  return dispatch => {
    axios.post('/patterns', data)
      .then((response) => {
        dispatch({
          type: SUBMIT_PATTERN,
          data: response.data
        })
        swal.fire({
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
          title: 'Se ha creado correctamente'
        })
      })
  }
}

export const submitEditPattern = (data) => {
  return dispatch => {
    axios.post(`/patterns/${data._id.$oid}`, data)
      .then((response) => {
        dispatch({
          type: SUBMIT_EDIT_PATTERN,
          data: response.data
        })
        swal.fire({
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
          title: 'Se ha actualizado correctamente'
        })
      })
  }
}

export const deletePattern = (data) => {
  return dispatch => {
    axios.delete(`/patterns/${data._id.$oid}`)
      .then((response) => {
        dispatch({
          type: DELETE_PATTERN,
          data: response.data
        })
        swal.fire({
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
          title: 'Se ha borrado correctamente'
        })
      })
  }
}

export const loadSeeds = () => {
  return dispatch => {
    axios.get('/seeds')
      .then((response) => {
        dispatch({
          type: LOAD_SEEDS,
          data: response.data
        })
      })
  }
}

export const createSeed = (data) => {
  return dispatch => {
    axios.post('/seeds', data)
      .then((response) => {
        dispatch({
          type: CREATE_SEED,
          data: response.data
        })
        swal.fire({
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
          title: 'Se ha creado correctamente'
        })
      })
  }
}

export const removeSeed = seedId => {
  return dispatch => {
    axios.delete(`/seeds/${seedId}`)
      .then((response) => {
        dispatch({
          type: REMOVE_SEED,
          data: response.data
        })
        swal.fire({
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
          title: 'Se ha eliminado correctamente'
        })
      })
  }
}

export const loadBlacklist = (data) => {
  return dispatch => {
    axios.get('/blacklist', data)
      .then((response) => {
        dispatch({
          type: LOAD_BLACKLIST,
          data: response.data
        })
      })
  }
}

export const createBlacklist = (data) => {
  return dispatch => {
    axios.post('/blacklist', data)
      .then((response) => {
        dispatch({
          type: CREATE_BLACKLIST
        })
        swal.fire({
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
          title: 'Se ha creado correctamente'
        })
      })
  }
}

export const removeBlacklist = blacklistId => {
  return dispatch => {
    axios.delete(`/blacklist/${blacklistId}`)
      .then(() => {
        dispatch({
          type: REMOVE_BLACKLIST
        })
        swal.fire({
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
          title: 'Se ha eliminado correctamente'
        })
      })
  }
}
