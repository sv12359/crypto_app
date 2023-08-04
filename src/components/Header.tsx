import image from "../assets/images/crypto_icon.png"

const Header: React.FC = () => {
    return (
        <header>
            <img className="crypto-image" src={image} alt="Crypto image"></img>
            <h1>Crypto App</h1>
        </header>
    )
}

export default Header;