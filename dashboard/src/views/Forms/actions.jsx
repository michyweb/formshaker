import axios from '../../requesters/axios'
import swal from 'sweetalert2/dist/sweetalert2.all.js'

import {
  LOAD_FORMS,
  APPEND_FORM,
  REPLACE_FORM,
  SUBMIT_EDIT_FORM
} from '../../actionTypes/home'

export const loadForms = () => {
  return dispatch => {
    axios.get('/forms')
      .then((response) => {
        dispatch({
          type: LOAD_FORMS,
          data: response.data
        })
      })
  }
}

export const appendForm = data => {
  return dispatch => {
    dispatch({
      type: APPEND_FORM,
      data
    })
  }
}

export const replaceForm = data => {
  return dispatch => {
    dispatch({
      type: REPLACE_FORM,
      data
    })
  }
}

export const submitEditForm = (data) => {
  return dispatch => {
    axios.put(`/forms/${data._id.$oid}`, data)
      .then((response) => {
        dispatch({
          type: SUBMIT_EDIT_FORM,
          data: response.data
        })
        swal.fire({
          icon: 'success',
          showConfirmButton: false,
          backdrop: true,
          timer: 2000,
          title: 'Se ha actualizado correctamente'
        })
      })
  }
}

export const checkFormWithInject = (data) => {
  return dispatch => {
    axios.post('/forms/inject', data)
      .then((response) => {
        dispatch({
          type: SUBMIT_EDIT_FORM,
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
