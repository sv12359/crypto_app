
type ItemProps = {
    id: string,
    rank: string,
    symbol: string,
    name: string,
    priceUsd: string,
    changePercent24Hr: string,
}

const Item: React.FC<ItemProps> = ({ id, rank, symbol, name, priceUsd, changePercent24Hr}: ItemProps) => {
    return ( 
        <>
            <td>{rank}</td>
            <td>{symbol}</td>
            <td>{name}</td>
            <td >{Number(priceUsd).toFixed(2)}</td>
            <td>{Number(changePercent24Hr).toFixed(2)}</td>
        </>
    )
}

export default Item;