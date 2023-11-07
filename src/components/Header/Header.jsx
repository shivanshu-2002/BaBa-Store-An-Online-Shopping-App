import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TbSearch } from "react-icons/tb";
import { CgShoppingCart } from "react-icons/cg";
import { AiOutlineHeart } from "react-icons/ai";
import "./Header.scss";
import Search from "./Search/Search";
import { Context } from "../../utils/context";
import Cart from "../Cart/Cart";


const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [searchModal, setSearchModal] = useState(false);
    const navigate = useNavigate();
    const handleScroll = () => {
        const offset = window.scrollY;
        if (offset > 200) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

   

    const { cartCount, showCart, setShowCart, setToken, setUser, token, setCartItems, user } = useContext(Context);
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    }, []);

   
    const handlelogOut = () => {
        setToken(null);
        setUser(null);
        setCartItems([]);
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/")
    }


    return (
        <>
            <header
                className={`main-header ${scrolled ? "sticky-header" : ""}`}
            >
                <div className="header-content">
                    <ul className="left">
                        <li onClick={() => navigate("/")}>Home</li>
                        <li onClick={() => navigate("/about")}>About</li>
                        <li>Categories</li>
                    </ul>
                    <div className="center" onClick={() => navigate("/")}>
                        BABASTORE
                    </div>

                    <div className="right">

                        {!(token == null) ? (<div style={{display:'flex', alignItems:'center'}}>
                            <div onClick={() => navigate("/profile")} style={{ width: '55px', height: '55px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'red', cursor:'pointer' }} >
                                <img src={user.image} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                            </div>
                            <div className="boom" onClick={handlelogOut}>Logout</div>
                        </div>) : (
                            <div>
                                <span className="boom" onClick={() => navigate("/signup")}>Signup</span>
                                <span className="boom" onClick={() => navigate("/login")}>Login</span>
                            </div>
                        )}
                        <TbSearch onClick={() => setSearchModal(true)} />
                        <AiOutlineHeart />
                        <span
                            className="cart-icon"
                            onClick={() => setShowCart(true)}
                        >
                            <CgShoppingCart />
                            {console.log(cartCount)}
                            {!!cartCount && <span>{cartCount}</span>}
                        </span>
                    </div>
                </div>
            </header>
            {searchModal && <Search setSearchModal={setSearchModal} />}
            {showCart && <Cart />}
        </>
    );
};

export default Header;
