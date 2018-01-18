import axios from "axios";

import settings from "../settings";
import {
  createServerComId,
  startServerComAction,
  successServerComAction,
  failedServerComAction
} from "./application";

import { Models } from "./models";

/** Actions used to control fetching model entities */
const CurrentModel = {
  SELECT_MODEL: "SELECT_MODEL",

  VARIABLES_SUCCESS: "VARIABLES_SUCCESS",
  VARIABLES_FAILURE: "VARIABLES_FAILURE",
  VARIABLES_CHANGE_STATE: "VARIABLES_CHANGE_STATE",

  VARIABLE_NEW: "VARIABLE_NEW",
  VARIABLE_DELETE: "VARIABLE_DELETE",
  VARIABLE_UPDATE: "VARIABLE_UPDATE"
};

/** Initial store for holding current model */
const initialStore = {
  currentModel: undefined,
  variables: undefined,
  variablesState: undefined,
  rules: undefined,
  macros: undefined
};

/**
 * Reducer for current model
 */
export function currentModel(state = initialStore, action) {
  switch (action.type) {
    case CurrentModel.VARIABLES_SUCCESS:
      return {
        ...state,
        variables: action.variables
      };

    case CurrentModel.VARIABLES_FAILURE:
      return initialStore;

    case CurrentModel.SELECT_MODEL:
      return {
        ...initialStore,
        currentModel: action.guid
      };

    case Models.MODEL_DELETE:
      // If we delete current model, reset current model
      return state.currentModel === action.guid ? initialStore : state;

    case CurrentModel.VARIABLES_CHANGE_STATE:
      var variablesState = {
        ...state.variablesState,
        [action.partialStateName]: action.partialStateValue
      };
      return {
        ...state,
        variablesState
      };

    default:
      return state;
  }
}

const variablesSuccessAction = variables => ({
  type: CurrentModel.VARIABLES_SUCCESS,
  variables
});

const variablesFailureAction = error => ({
  type: CurrentModel.VARIABLES_FAILURE,
  error
});

export const selectModelAction = guid => ({
  type: CurrentModel.SELECT_MODEL,
  guid
});

export const variablesStateAction = (partialStateName, partialStateValue) => ({
  type: CurrentModel.VARIABLES_CHANGE_STATE,
  partialStateName,
  partialStateValue
});

/**
 * Function for fetching information about available variables
 */
export function requestVariables(modelGuid) {
  return dispatch => {
    var comId = createServerComId();

    // Dispatch that we are fetching the models
    dispatch(startServerComAction(comId));

    return axios
      .get(`${settings.serverUrl}/api/variables/${modelGuid}`)
      .then(variables => {
        dispatch(successServerComAction(comId));
        dispatch(variablesSuccessAction(variables.data));
      })
      .catch(error => {
        dispatch(variablesFailureAction(error));
        dispatch(failedServerComAction(comId));
      });
  };
}
