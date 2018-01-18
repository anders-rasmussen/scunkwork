import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";

import application from "./application";
import { models } from "./models";
import { currentModel } from "./currentModel";

/**
 * Reducer for entire application
 */
const rootReducer = combineReducers({
  application,
  models,
  currentModel
});

let store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export default store;
