import {
  LOAD_FORMS,
  APPEND_FORM,
  REPLACE_FORM,
  LOAD_INJECT,
  MODIFY_INJECT,
  STORE_IMAGE,
  SUBMIT_EDIT_FORM,
  CLEAN_FORMS_REDUCER
} from '../actionTypes/home'
import _ from 'underscore'

const initialState = {
  data: [],
  file: '',
  hasToFetch: false,
  inject: false
}

export default function (state = initialState, action) {
  let cleaned = {}
  switch (action.type) {
    case LOAD_FORMS:
      return {
        ...state,
        data: action.data,
        hasToFetch: false
      }
    case APPEND_FORM:
      return {
        ...state,
        data: [...state.data, action.data]
      }
    case REPLACE_FORM:
      const index = _.findIndex(state.data, x => x._id.$oid === action.data._id.$oid) // eslint-disable-line
      if (index > -1) {
        const forms = state.data.slice()
        forms[index] = action.data
        return {
          ...state,
          data: forms
        }
      }
      break
    case LOAD_INJECT:
      return {
        ...state,
        inject: action.data[0],
        refresh: false
      }
    case MODIFY_INJECT:
      return {
        ...state,
        refresh: true
      }
    case STORE_IMAGE:
      return {
        ...state,
        file: action.data
      }
    case SUBMIT_EDIT_FORM:
      return {
        ...state,
        hasToFetch: true
      }
    case CLEAN_FORMS_REDUCER:
      if (action.payload.props === '*') {
        cleaned = initialState
      } else if (Array.isArray(action.payload.props)) {
        action.payload.props.forEach(p => {
          cleaned[p] = initialState[p]
        })
      }
      return {
        ...state,
        ...cleaned
      }
    default:
      return state
  }
}
