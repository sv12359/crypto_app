import { useState } from "react";

type ItemProps = {
    id: string,
    rank: string,
    symbol: string,
    name: string,
    priceUsd: string,
    changePercent24Hr: string,
    classSetterDict: { [key: string]: [(highlightClass: string) => void, string]},
    priceSetterDict: { [key: string]: [(highlightClass: string) => void, string]},

}

const Item: React.FC<ItemProps> = ({id, rank, symbol, name, priceUsd, changePercent24Hr, classSetterDict, priceSetterDict}: ItemProps) => {
    const [ highlightClass, setHighlightClass] = useState("row-highlight-off");
    classSetterDict[id] = [setHighlightClass, highlightClass];

    const [price, setPrice] = useState(priceUsd);
    priceSetterDict[id] = [setPrice, price];
    return ( 
        <tr className={highlightClass}>
            <td>{rank}</td>
            <td>{symbol}</td>
            <td>{name}</td>
            <td >{Number(price).toFixed(2)}</td>
            <td>{Number(changePercent24Hr).toFixed(2)}</td>
        </tr>
    )
}

export default Item;