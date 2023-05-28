// App.js

import React from "react";
import { createStore } from "redux";
import { Provider, useSelector } from "react-redux";
import rootReducer from "./reducers";
import HomePage from "./HomePage";

const App = () => {
  const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  return (
    <Provider store={store}>
      <HomePage />
    </Provider>
  );
};

export default App;
