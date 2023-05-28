// reducers/index.js

import { combineReducers } from "redux";
import championReducer from "../actions/championReducer";

const rootReducer = combineReducers({
  champions: championReducer,
});

export default rootReducer;
