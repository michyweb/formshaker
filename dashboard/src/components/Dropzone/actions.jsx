import {
  STORE_IMAGE
} from '../../actionTypes/home'

export const storeFiles = (fileB64) => {
  return dispatch => {
    dispatch({
      type: STORE_IMAGE,
      data: fileB64
    })
  }
}
