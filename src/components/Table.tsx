/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { cryptoItem, cryptoArray } from "../types/cryptoTypes";
import Item from "./Item.tsx"

enum Column {
    rank,
    symbol,
    name,
    priceUsd,
    changePercent24Hr,
}

enum SortType {
    ascending,
    descending
}

type TableForm = {
    sortBy: Column,
    sortType: SortType,
    searchValue: string,
}

const Table: React.FC = () => {
    const [data, setData] = useState<cryptoItem[]>([]);

    // Gets crypto data from coincap website.
    useEffect(() => {
      const fetchUrl = 'https://api.coincap.io/v2/assets/?limit=100';

      fetch(fetchUrl, { method: "GET" })
        .then((response) => response.json())
        .then((res) => {
            if (res) {
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


    const { register, handleSubmit } = useForm<TableForm>({
        defaultValues: {
            sortBy: Column.rank,
            sortType: SortType.ascending,
            searchValue: "",
        },
    });

    const onSubmit: SubmitHandler<TableForm> = (formData: TableForm, event) => {
        event?.preventDefault();
        console.log("Form submited: " + JSON.stringify(formData));
        // console.log(Column.symbol === Number(formData.sortBy));
    }

    return (
        <div className="table-container">
            {data.length > 0 && 

                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-inputs">
                            <div className="form-column">
                                <label htmlFor="columns">Sort by column:</label>

                                <select id="columns" {...register("sortBy")} defaultValue={"rank"}>
                                    <option value={0}>Rank</option>
                                    <option value={1}>Symbol</option>
                                    <option value={2}>Name</option>
                                    <option value={3}>Price (USD)</option>
                                    <option value={4}>Change 24h</option>
                                </select>

                                <label htmlFor="ascending">
                                    <input
                                        {...register("sortType")}
                                        type="radio"
                                        value="0"
                                        id="ascending"
                                        checked={true}
                                    />
                                    ascending
                                </label>

                                <label htmlFor="descending">
                                    <input
                                        {...register("sortType")}
                                        type="radio"
                                        value="1"
                                        id="descending"
                                    />
                                    descending
                                </label>
                            </div>

                            <div className="form-column">
                                <div className="search-input">
                                    <label htmlFor="searchValue">Search by name:</label>
                                    <input id="searchValue" className="text-input" {...register("searchValue")}></input>
                                </div>
                                <button type="submit">Apply</button>
                            </div>
                            
                        </div>
                    </form>
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
                                    <tr key={item.id}>
                                    <Item
                                        id={item.id}
                                        rank={item.rank} 
                                        symbol={item.symbol} 
                                        name={item.name} 
                                        priceUsd={item.priceUsd} 
                                        changePercent24Hr={item.changePercent24Hr}
                                    />
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                </div>
            }

        </div>
    )
    }

export default Table;