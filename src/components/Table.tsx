/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import Item from "./Item.tsx"

const ITEMS_TO_LOAD = 100;
const ITEMS_TO_UPDATE = 5;

export type cryptoItem = {
    id: string,
    rank: string,
    symbol: string,
    name: string,
    supply: string,
    maxSupply: string,
    marketCapUsd: string,
    volumeUsd24Hr: string,
    priceUsd: string,
    changePercent24Hr: string,
    vwap24Hr: string,
}

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
    column: Column,
    sortType: SortType,
    searchValue: string,
}



class SortFunctions {
    sortFunctionsDictionary: { [key: number]:  (a: cryptoItem, b: cryptoItem) => number } = {};
    
    constructor () {
        this.sortFunctionsDictionary[Column.rank] = (a: cryptoItem, b: cryptoItem) => { return Number(a.rank) - Number(b.rank)};
        this.sortFunctionsDictionary[Column.symbol] = (a: cryptoItem, b: cryptoItem) => { return a.symbol.localeCompare(b.symbol)};
        this.sortFunctionsDictionary[Column.name] = (a: cryptoItem, b: cryptoItem) => { return a.name.localeCompare(b.name)};
        this.sortFunctionsDictionary[Column.priceUsd] = (a: cryptoItem, b: cryptoItem) => { return Number(a.priceUsd) - Number(b.priceUsd)};
        this.sortFunctionsDictionary[Column.changePercent24Hr] = (a: cryptoItem, b: cryptoItem) => { return Number(a.changePercent24Hr) - Number(b.changePercent24Hr)};
    }

}

const Table: React.FC = () => {
    const [data, setData] = useState<cryptoItem[]>([]);
    const [displayedData, setDisplayedData] = useState<cryptoItem[]>([]);
    
    function sortItems(newData: cryptoItem[],column: Column, sortType: SortType) {
        const sortFunction = new SortFunctions().sortFunctionsDictionary[column];
        newData.sort(sortFunction);
        if (sortType === SortType.descending) {
            newData.reverse();
        }
    }

    function filterItems(searchValue: string) {
        return data.filter((item) => item.name.toLocaleLowerCase().includes(searchValue));
    }

    function displayData(formData: TableForm) {
        const newData = filterItems(formData.searchValue.trim().toLocaleLowerCase());
        sortItems(newData, Number(formData.column), Number(formData.sortType))
        setDisplayedData(newData);
    }

    const onSubmit: SubmitHandler<TableForm> = (formData: TableForm, event) => {
        event?.preventDefault();
        displayData(formData);
    }

    // Gets crypto data from coincap website.
    useEffect(() => {
      const fetchUrl = 'https://api.coincap.io/v2/assets/?limit=' + ITEMS_TO_LOAD;

      fetch(fetchUrl, { method: "GET" })
        .then((response) => response.json())
        .then((res) => {
            if (res) {
              sortItems(res.data, Column.rank, SortType.ascending);
              setData(res.data);
              setDisplayedData(res.data);
            }
            
        }).catch((error) => {
            console.log(error.message);
        })
    }, []);

    
    const { register, handleSubmit } = useForm<TableForm>({
        defaultValues: {
            column: Column.rank,
            sortType: SortType.ascending,
            searchValue: "",
        },
    });

    //Updates price.
    let names = "";

    for (let i = 0; i < ITEMS_TO_UPDATE; ++i) {
        if (i <= data.length - 1) {
            names += data[i].id;
        }

        if (i + 1 < ITEMS_TO_UPDATE) {
            names += ","
        }
    }
    const url = 'wss://ws.coincap.io/prices?assets=' + names;
    // Gets data from coincap websocket.
    useEffect(() => {
        const pricesWs = new WebSocket(url);
        pricesWs.onmessage = function (msg) {
            
            for (const item of displayedData) {
                const classSetter = classSetterDict[item.id][0];
                const classValue = classSetterDict[item.id][1];
                if (classValue === "row-highlight-green" || classValue === "row-highlight-red") {
                    setTimeout(() => {
                        classSetter("row-highlight-off");
                    }, 500);
                }
                
            }
            for (const item of displayedData) {
                const newPriceValue = JSON.parse(msg.data)[item.id];
                if (newPriceValue !== undefined) {
                    const classSetter = classSetterDict[item.id][0];
                    const priceSetter = priceSetterDict[item.id][0];
                    const priceValue = priceSetterDict[item.id][1];

                    if (Number(newPriceValue) > Number(priceValue)) {
                        classSetter("row-highlight-green");
                    } else if (Number(newPriceValue) < Number(priceValue)) {
                        classSetter("row-highlight-red");
                    }
                    priceSetter(newPriceValue);
                }
            }
        }
    });



    

    const classSetterDict: { [key: string]: [(highlightClass: string) => void, string]} = {};
    const priceSetterDict: { [key: string]: [(highlightClass: string) => void, string]} = {};


    return (
        <div className="table-container">
            {data.length > 0 && 

                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-inputs">
                            <div className="form-column">
                                <label className="form-label" htmlFor="columns">Sort by column:</label>

                                <select className="select-input" id="columns" {...register("column")} defaultValue={"rank"}>
                                    <option value={0}>Rank</option>
                                    <option value={1}>Symbol</option>
                                    <option value={2}>Name</option>
                                    <option value={3}>Price (USD)</option>
                                    <option value={4}>Change 24h</option>
                                </select>

                                <label className="radio-label" htmlFor="ascending">
                                    <input className="radio-input"
                                        {...register("sortType")}
                                        type="radio"
                                        value="0"
                                        id="ascending"
                                        defaultChecked={true}
                                    />
                                    <h2 className="radio-name">ascending</h2>
                                </label>

                                <label className="radio-label" htmlFor="descending">
                                    <input className="radio-input"
                                        {...register("sortType")}
                                        type="radio"
                                        value="1"
                                        id="descending"
                                        defaultChecked={false}
                                    />
                                    <h2 className="radio-name">descending</h2>
                                </label>
                            </div>

                            <div className="form-column">
                                <div className="text-input-container">
                                    <label className="form-label" htmlFor="searchValue">Search by name:</label>
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
                                {displayedData.map((item) => (
                                    <Item key={item.id}
                                        id={item.id}
                                        rank={item.rank} 
                                        symbol={item.symbol} 
                                        name={item.name} 
                                        priceUsd={item.priceUsd} 
                                        changePercent24Hr={item.changePercent24Hr}
                                        classSetterDict={classSetterDict}
                                        priceSetterDict={priceSetterDict}
                                    />
                                ))}
                            </tbody>
                        </table>
                </div>
            }

        </div>
    )
    }

export default Table;