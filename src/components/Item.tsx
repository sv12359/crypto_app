
type ItemProps = {
    rank: string,
    symbol: string,
    name: string,
    priceUsd: string,
    changePercent24Hr: string,
}

const Item: React.FC<ItemProps> = ({ rank, symbol, name, priceUsd, changePercent24Hr}: ItemProps) => {
    return ( 
        <tr>
            <td>{rank}</td>
            <td>{symbol}</td>
            <td>{name}</td>
            <td>{Number(priceUsd).toFixed(2)}</td>
            <td>{Number(changePercent24Hr).toFixed(2)}</td>
        </tr>
    )
}

export default Item;