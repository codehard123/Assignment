import { Provider } from "react-redux";
import { store } from "./Redux/Store/store";
import Crypto from "./components/Crypto";
function App() {
  return (
    <Provider store={store}>
      <Crypto />
    </Provider>
  );
}

export default App;
