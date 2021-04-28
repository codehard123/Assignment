import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import { Reducer } from "../../Redux/WebSocket-Crypto/Reducer";
import { composeWithDevTools } from "redux-devtools-extension";
const store = createStore(
  Reducer,
  composeWithDevTools(applyMiddleware(logger, thunk))
);
export { store };
