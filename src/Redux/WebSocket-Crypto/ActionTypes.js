import Pusher from "pusher-js";
const ESTABLISH_SOCKET_CONNECTION = () => {
  return {
    type: "ESTABLISH_SOCKET_CONNECTION",
  };
};
const CONNECTION_SUCCESS = (data) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: data,
  };
};
const CONNECTION_FAILURE = (err) => {
  return {
    type: "CONNECTION_FAILURE",
    payload: err,
  };
};
const socketConnect = () => {
  return function (dispatch) {
    dispatch(ESTABLISH_SOCKET_CONNECTION());
    const server = new WebSocket(
      "wss://ws-ap2.pusher.com/app/47bd0a9591a05c2a66db?protocol=7&client=js&version=4.4.0&flash=false"
    );

    server.onopen = function () {
      console.log("Client - Server Socket Connection Established");
    };
    server.onmessage = function (event) {
      const pusher = new Pusher("47bd0a9591a05c2a66db", {
        cluster: "ap2",
      });
      const channel = pusher.subscribe("market-global");
      channel.bind("tickers", function (data) {
        dispatch(CONNECTION_SUCCESS(data));
        //dispatch(CONNECTION_SUCCESS(data.trades[0].price));
      });
    };
  };
};

export { socketConnect };
