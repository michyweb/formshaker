import {
  LOAD_PATTERNS,
  LOAD_SEEDS,
  CREATE_SEED,
  REMOVE_SEED,
  LOAD_BLACKLIST,
  CREATE_BLACKLIST,
  REMOVE_BLACKLIST,
  SUBMIT_PATTERN,
  SUBMIT_EDIT_PATTERN,
  DELETE_PATTERN,
  CLEAN_PATTERNS_REDUCER
} from '../actionTypes/patterns'

const initialState = {
  data: [],
  seeds: [],
  blacklist: [],
  hasToFetch: false,
  refresh: false
}

export default function (state = initialState, action) {
  let cleaned = {}
  switch (action.type) {
    case LOAD_PATTERNS:
      return {
        ...state,
        data: action.data,
        hasToFetch: false
      }
    case LOAD_SEEDS:
      return {
        ...state,
        seeds: action.data,
        refresh: false
      }
    case LOAD_BLACKLIST:
      return {
        ...state,
        blacklist: action.data,
        refresh: false
      }
    case CREATE_SEED:
      return {
        ...state,
        refresh: true
      }
    case REMOVE_SEED:
      return {
        ...state,
        refresh: true
      }
    case CREATE_BLACKLIST:
      return {
        ...state,
        refresh: true
      }
    case REMOVE_BLACKLIST:
      return {
        ...state,
        refresh: true
      }
    case SUBMIT_EDIT_PATTERN:
      return {
        ...state,
        hasToFetch: true
      }
    case SUBMIT_PATTERN:
      return {
        ...state,
        hasToFetch: true
      }
    case DELETE_PATTERN:
      return {
        ...state,
        hasToFetch: true
      }
    case CLEAN_PATTERNS_REDUCER:
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
