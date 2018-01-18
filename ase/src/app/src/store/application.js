import { Themes, View, ServerComStatus } from "./constants";

/** Actions that can be raised to control application */
const Application = {
  TOGGLE_THEME: "TOGGLE_THEME",
  SET_VIEW: "SET_VIEW",
  SERVER_COM: "SERVER_COM"
};

/** Initial store for application part */
const initialStore = {
  theme: Themes.LIGHT_THEME,
  currentView: View.MODELS,
  // Mapping of tokens, each reprenting an ongoing server communicatoin
  serverCom: []
};

/**
 * Reducer for application part of state
 */
export default function application(state = initialStore, action) {
  switch (action.type) {
    case Application.TOGGLE_THEME:
      return {
        ...state,
        theme:
          state.theme === Themes.LIGHT_THEME
            ? Themes.DARK_THEME
            : Themes.LIGHT_THEME
      };
    case Application.SET_VIEW:
      return {
        ...state,
        currentView: action.view
      };
    case Application.SERVER_COM:
      var serverCom = state.serverCom.filter(c => c.id !== action.id);

      if (action.status !== ServerComStatus.SUCCESS) {
        serverCom.push({
          id: action.id,
          status: action.status,
          error: action.error
        });
      }
      return {
        ...state,
        serverCom
      };
    default:
      return state;
  }
}

export const toggleThemeAction = {
  type: Application.TOGGLE_THEME
};

export const setViewAction = view => ({
  type: Application.SET_VIEW,
  view
});

// Indicate that new server communication is starting
export const startServerComAction = id => ({
  type: Application.SERVER_COM,
  id,
  status: ServerComStatus.COMMUNICATING
});

// Indicate that specific server communication is successfull
export const successServerComAction = id => ({
  type: Application.SERVER_COM,
  id,
  status: ServerComStatus.SUCCESS
});

// Indicate that specific server communication failed
export const failedServerComAction = (id, error) => ({
  type: Application.SERVER_COM,
  id,
  status: ServerComStatus.ERROR,
  error
});

export function createServerComId() {
  function _p8(s) {
    var p = (Math.random().toString(16) + "000000000").substr(2, 8);
    return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
  }
  return _p8() + _p8(true) + _p8(true) + _p8();
}
