import axios from "axios";

import settings from "../settings";
import {
  createServerComId,
  startServerComAction,
  successServerComAction,
  failedServerComAction
} from "./application";

/** Actions used to control fetching models */
export const Models = {
  MODELS_SUCCESS: "MODELS_SUCCESS",
  MODELS_FAILURE: "MODELS_FAILURE",

  MODEL_NEW: "MODEL_NEW",
  MODEL_DELETE: "MODEL_DELETE",
  MODEL_COPY: "MODEL_COPY",
  MODEL_EDIT: "MODEL_EDIT",
  MODEL_UPDATE: "MODEL_UPDATE",
  MODEL_SELECT: "MODEL_SELECT"
};

/** Initial store for holding models */
const initialStore = {
  models: []
};

/**
 * Reducer for models part of state
 */
export function models(state = initialStore, action) {
  switch (action.type) {
    case Models.MODELS_SUCCESS:
      return {
        ...state,
        models: action.models
      };

    case Models.MODELS_FAILURE:
      return {
        ...state,
        models: []
      };

    case Models.MODEL_EDIT:
      var modelIdx = state.models.findIndex(m => m.guid === action.guid);
      var models = state.models.slice();
      if (modelIdx !== -1) {
        models[modelIdx].id = action.id;
        models[modelIdx].description = action.description;
        models[modelIdx].editing = true;
      }
      return {
        ...state,
        models
      };

    case Models.MODEL_UPDATE:
      // Mark model as no longer being edited
      modelIdx = state.models.findIndex(m => m.guid === action.guid);
      models = state.models.slice();
      if (modelIdx !== -1) {
        models[modelIdx].editing = false;
      }
      return {
        ...state,
        models
      };

    default:
      return state;
  }
}

const modelsSuccessAction = models => ({
  type: Models.MODELS_SUCCESS,
  models
});

const modelsFailureAction = error => ({
  type: Models.MODELS_FAILURE,
  error
});

export const editModelAction = (guid, id, description) => ({
  type: Models.MODEL_EDIT,
  guid,
  id,
  description
});

const updateModelAction = (guid, id, description) => ({
  type: Models.MODEL_UPDATE,
  guid,
  id,
  description
});

const deleteModelAction = guid => ({
  type: Models.MODEL_DELETE,
  guid
});

/**
 * Function for fetching information about available models
 */
export function requestModels() {
  return dispatch => {
    var comId = createServerComId();

    // Dispatch that we are fetching the models
    dispatch(startServerComAction(comId));

    return axios
      .get(`${settings.serverUrl}/api/models`)
      .then(models => {
        dispatch(successServerComAction(comId));
        dispatch(modelsSuccessAction(models.data));
      })
      .catch(error => {
        dispatch(modelsFailureAction(error));
        dispatch(failedServerComAction(comId));
      });
  };
}

/**
 * Function for copying a model given the models guid
 */
export function copyModel(modelGuid) {
  return dispatch => {
    var comId = createServerComId();
    dispatch(startServerComAction(comId));

    return axios
      .post(`${settings.serverUrl}/api/models/create?guid=${modelGuid}`)
      .then(model => {
        dispatch(successServerComAction(comId));
        requestModels()(dispatch);
      })
      .catch(error => dispatch(failedServerComAction(comId)));
  };
}

/**
 * Function for deleting a model given the models guid
 */
export function deleteModel(modelGuid) {
  return dispatch => {
    dispatch(deleteModelAction(modelGuid));

    var comId = createServerComId();
    dispatch(startServerComAction(comId));

    return axios
      .post(`${settings.serverUrl}/api/models/delete?guid=${modelGuid}`)
      .then(() => {
        dispatch(successServerComAction(comId));
        requestModels()(dispatch);
      })
      .catch(error => dispatch(failedServerComAction(comId)));
  };
}

/**
 * Function for creating a new a model
 */
export function newModel() {
  return dispatch => {
    var comId = createServerComId();
    dispatch(startServerComAction(comId));

    return axios
      .post(`${settings.serverUrl}/api/models/create`)
      .then(() => {
        dispatch(successServerComAction(comId));
        requestModels()(dispatch);
      })
      .catch(error => dispatch(failedServerComAction(comId)));
  };
}

/**
 * Function for updating a new a model
 */
export function updateModel(guid, id, description) {
  return dispatch => {
    dispatch(updateModelAction(guid, id, description));

    var comId = createServerComId();
    dispatch(startServerComAction(comId));

    return axios
      .post(`${settings.serverUrl}/api/models/update`, {
        guid,
        id,
        description
      })
      .then(() => {
        dispatch(successServerComAction(comId));
        requestModels()(dispatch);
      })
      .catch(error => dispatch(failedServerComAction(comId)));
  };
}
