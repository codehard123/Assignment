import React, { useEffect, useState } from "react";
import "./Crypto.css";
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
          if (prevTradeData !== undefined && prevTradeData.length == 0) {
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
      <div className="row">
        <div className="column">
          <table>
            <tr>
              <th>VOLUME</th>
              <th>PRICE</th>
            </tr>

            {updateMarketUSDTINRGlobal.bids !== undefined &&
              updateMarketUSDTINRGlobal.bids.map((item, index) => {
                console.log("index", index);
                acc = (parseFloat(acc) + parseFloat(item[1])).toFixed(2);
                if (index < 10) {
                  return (
                    <tr>
                      <td className="colorGreen">{acc}</td>
                      <td>{item[0]}</td>
                    </tr>
                  );
                } else return <React.Fragment></React.Fragment>;
              })}
          </table>
        </div>
        <div className="column">
          <table>
            <tr>
              <th>SELL PRICE</th>
              <th>VOLUME</th>
            </tr>

            {updateMarketUSDTINRGlobal.asks !== undefined &&
              updateMarketUSDTINRGlobal.asks.map((item, index) => {
                acc2 = (parseFloat(acc2) + parseFloat(item[1])).toFixed(2);
                if (index < 10) {
                  return (
                    <tr>
                      <td className="colorRed">{item[0]}</td>
                      <td>{acc2}</td>
                    </tr>
                  );
                } else {
                  return <React.Fragment></React.Fragment>;
                }
              })}
          </table>
        </div>
      </div>
      <h1>Trade History</h1>
      <div class="row">
        <div class="column">
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
                      <td
                        className={
                          trade.type == "sell" ? "colorRed" : "colorGreen"
                        }
                      >
                        {trade.price}
                      </td>
                      <td>{trade.amount}</td>
                      <td>{trade.date.substring(16, 25)}</td>
                    </tr>
                  );
                })}
          </table>
        </div>
      </div>
    </div>
  );
};
export default Crypto;
/*
{

*/
