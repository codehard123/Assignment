import React, { useEffect, useState } from "react";
//import { useDispatch, useSelector } from "react-redux";
//import { socketConnect } from "../Redux/WebSocket-Crypto/ActionTypes";
import Pusher from "pusher-js";
const Crypto = () => {
  var acc = "0";
  var acc2 = "0";

  const [updateMarketUSDTINRGlobal, setUpdateMarketUSDTINRGlobal] = useState(
    {}
  );
  const caller = (time) => {
    console.log("Time", time);
    const date = new Date(parseInt(time));
    return date.toString();
  };
  const [tradesData, setTradesData] = useState([]);

  useEffect(() => {
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

      const channelMarketUSDTINRGlobal = pusher.subscribe(
        "market-usdtinr-global"
      );
      channelMarketUSDTINRGlobal.bind("trades", function (data) {
        setTradesData((prevTradeData) => {
          const date = new Date();
          data.trades[0].date = date.toString();
          if (prevTradeData.length == 0) {
            return [...prevTradeData, ...data.trades];
          }
          if (
            prevTradeData[prevTradeData.length - 1].amount !=
              data.trades[0].amount ||
            prevTradeData[prevTradeData.length - 1].price !=
              data.trades[0].price
          ) {
            const date = new Date();
            data.trades[0].date = date.toString();

            if (prevTradeData.length >= 0 && prevTradeData.length < 10) {
              return [...prevTradeData, ...data.trades];
            } else {
              let newData = prevTradeData;
              newData.shift();
              return [...newData, ...data.trades];
            }
          }
        });
      });

      channelMarketUSDTINRGlobal.bind("update", function (data) {
        //console.log("setUpdateMarketUSDTINRGlobal");
        setUpdateMarketUSDTINRGlobal((updateMarketUSDTINRGlobal) => {
          return { ...updateMarketUSDTINRGlobal, ...data };
        });
      });
    };
  }, []);
  useEffect(() => {
    console.log("TradesData", tradesData);
  }, [tradesData]);
  useEffect(() => {
    //console.log("updateMarketUSDTINRGlobal", updateMarketUSDTINRGlobal);
    acc = 0;
  }, [updateMarketUSDTINRGlobal]);

  return (
    <div>
      <h1>Orders Table</h1>
      <table>
        <tr>
          <th>Volume</th>
          <th>Buy Price</th>
        </tr>

        {updateMarketUSDTINRGlobal.bids !== undefined &&
          updateMarketUSDTINRGlobal.bids.map((item) => {
            acc = (parseFloat(acc) + parseFloat(item[1])).toFixed(2);
            return (
              <tr>
                <td>{acc}</td>
                <td>{item[0]}</td>
              </tr>
            );
          })}
      </table>
      <table>
        <tr>
          <th>Sell Price</th>
          <th>Volume</th>
        </tr>

        {updateMarketUSDTINRGlobal.asks !== undefined &&
          updateMarketUSDTINRGlobal.asks.map((item) => {
            acc2 = (parseFloat(acc2) + parseFloat(item[1])).toFixed(2);
            return (
              <tr>
                <td>{item[0]}</td>
                <td>{acc2}</td>
              </tr>
            );
          })}
      </table>
      <h1>Trade History</h1>
      <table>
        <tr>
          <th>Price</th>
          <th>Volume</th>
          <th>Time</th>
        </tr>

        {tradesData.length > 0 &&
          tradesData
            .slice()
            .reverse()
            .map((trade, index) => {
              return (
                <tr key={index}>
                  <td>{trade.price}</td>
                  <td>{trade.amount}</td>
                  <td>{trade.date.substring(16, 25)}</td>
                </tr>
              );
            })}
      </table>
    </div>
  );
};
export default Crypto;
/*
{

*/
