import React from "react";
import { useEffect, useState } from "react";

import { cryptoItem, cryptoArray } from "../types/cryptoTypes";


const Table: React.FC = () => {
    const [data, setData] = useState<cryptoItem[]>([]);

    // Gets crtypto data from coincap website.
    useEffect(() => {
      const fetchUrl = 'https://api.coincap.io/v2/assets/?limit=100';

      fetch(fetchUrl, { method: "GET" })
        .then((response) => response.json())
        .then((res) => {
            if (res) {
              console.log(res.data);
              setData(res.data);
            }
            
        }).catch((error) => {
            console.log(error.message);
        })
    }, []);


    // // Gets data from coincap websocket.
    // const pricesWs = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,monero,litecoin')
    // pricesWs.onmessage = function (msg) {
    //     console.log(msg.data)
    // }

    const item: cryptoItem = data[0];
   

    return (
        <div>
            <h1>Table</h1>
            {data.length > 0 && 
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Symbol</th>
                            <th>Name</th>
                            <th>Price (USD)</th>
                            <th>Change 24h</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>{item.rank}</td>
                            <td>{item.symbol}</td>
                            <td>{item.name}</td>
                            <td>{Number(item.priceUsd).toFixed(2)}</td>
                            <td>{Number(item.changePercent24Hr).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            }
        </div>
    )
    }

export default Table;