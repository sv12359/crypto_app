import React from "react";
import { useEffect, useState } from "react";

import { cryptoItem, cryptoArray } from "../types/cryptoTypes";
import Item from "./Item.tsx"


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
                        {data.map((item) => (
                            <Item 
                                rank={item.rank} 
                                symbol={item.symbol} 
                                name={item.name} 
                                priceUsd={item.priceUsd} 
                                changePercent24Hr={item.changePercent24Hr}
                            />
                        ))}
                    </tbody>
                </table>
            }
        </div>
    )
    }

export default Table;