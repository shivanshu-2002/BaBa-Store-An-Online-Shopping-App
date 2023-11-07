import { useEffect } from "react";
import { createContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchDataFromApi, updateDataFromApi, removeProduct} from "./api";
export const Context = createContext();

const AppContext = ({ children }) => {
    const [categories, setCategories] = useState();
    const [products, setProducts] = useState();
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [cartSubTotal, setCartSubTotal] = useState(0);

    // Initialize user and token from local storage
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        const tokenFromLocalStorage = localStorage.getItem("token");
        const token = tokenFromLocalStorage ? tokenFromLocalStorage.replace(/"/g, "") : null;
        return token || null;
    });

    // Use the location hook to scroll to the top when the route changes
    const location = useLocation();

    // useEffect for scrolling to the top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const updateCart = (method, product, quantity) => {
        updateDataFromApi("/api/v1/auth/updateCart", token, method, product, quantity).then((res) => {
            setCartItems(res.cartItems) 
        })
    }

    const updateCart2 = ( product) => {
        removeProduct("/api/v1/auth/removeCart", token, product).then((res) => {
            setCartItems(res.cart) 
        })
    }

    const getCartItems = () => {
        fetchDataFromApi("/api/v1/auth/getCart", token).then((res) => {
            setCartCount(res.data.length)
            setCartItems(res.data);
        })
    }

    const getCategories = () => {
        fetchDataFromApi("/api/v1/product/showAllCategories").then((res) => {
            setCategories(res.allCategory);
        });
    };

    const getProducts = () => {
        fetchDataFromApi("/api/v1/product/getSomeProducts").then((res) => {
            setProducts(res.products);
        });
    };

    useEffect(() => {
        getProducts();
        getCategories();
        getCartItems();
    }, []);


    // useEffect for updating cart counts and subtotals
    useEffect(() => {
        let count = 0;
        cartItems?.map((item) => (count += item.quantity));
        setCartCount(count);

        let subTotal = 0;
        cartItems.map(
            (item) =>
                (subTotal += item.price * item.quantity)
        );

        setCartSubTotal(Math.ceil(subTotal));
    }, [cartItems]);


    const handleAddToCart = (product, quantity) => {
        let items = [...cartItems];
        let index = items?.findIndex((p) => p._id === product?._id);
        if (index !== -1) {
            items[index].quantity += quantity;
        } else {
            product.quantity = quantity;
            items = [...items, product];
        }
        updateCart("add", product, quantity);
    };

    const handleRemoveFromCart = (product) => {
        let items = [...cartItems];
        items = items?.filter((p) => p._id !== product?._id);
        setCartItems(items)
        updateCart2(product)
    };

    const handleCartProductQuantity = (type, product) => {
        let items = [...cartItems];
        console.log(items, cartItems)
        let index = items?.findIndex((p) => p._id === product?._id);
        if (type === "inc") {
            console.log(items)
            items[index].quantity += 1;
        } else if (type === "dec") {
            if (items[index].quantity === 1) return;
            items[index].quantity -= 1;
        }
        setCartItems(items);
    };

    return (
        <Context.Provider
            value={{
                products,
                setProducts,
                categories,
                setCategories,
                user,
                setUser, // Function to update user
                token,
                setToken, // Function to update token
                cartItems,
                setCartItems,
                handleAddToCart,
                cartCount,
                handleRemoveFromCart,
                showCart,
                setShowCart,
                handleCartProductQuantity,
                cartSubTotal,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export default AppContext;
