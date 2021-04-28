const initialState = {
  loading: null,
  socketData: [],
  err: "",
  index: -1,
};
const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ESTABLISH_SOCKET_CONNECTION":
      return {
        ...state,
        loading: true,
      };
    case "CONNECTION_SUCCESS":
      return {
        ...state,
        loading: false,
        err: "",
        socketData: [...state.socketData, action.payload],
        index: state.index + 1,
      };
    case "CONNECTION_FAILURE":
      return {
        ...state,
        loading: false,
        err: action.payload,
      };
    default:
      return state;
  }
};
export { Reducer };
