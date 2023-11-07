import { useContext, useState ,useEffect } from "react";
import { Context } from "../../utils/context";
import { useParams } from "react-router-dom";
import {fetchProductFromApi} from "../../utils/api.js";
import Corouselimgs from "../Corousel/Corouselimgs.jsx";
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaPinterest,
    FaCartPlus,
} from "react-icons/fa";
import "./SingleProduct.scss";
import Products from "../Products/Products.jsx";

const SingleProduct = () => {
    const [quantity, setQuantity] = useState(1);
    const { id } = useParams();
    const { handleAddToCart } = useContext(Context);
    const [data, setData] = useState(null);
    const [relatedProd , setrelatedProd] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchProductFromApi(id);
                setData(response.productDetails);
                setrelatedProd(response.filtered_related_products)
            } catch (error) {
                console.error("Error fetching category data:", error);
            }
        }
        fetchData();
    }, [id]);
    

    const decrement = () => {
        setQuantity((prevState) => {
            if (prevState === 1) return 1;
            return prevState - 1;
        });
    };
    const increment = () => {
        setQuantity((prevState) => prevState + 1);
    };

    const obj = {
          height:'100%',
          width:'100%'
    }

    // if (!data) return;
    // const product = data?.data?.[0]?.attributes;
     
    return (
        <div className="single-product-main-content">
            <div className="layout">
                <div className="single-product-page">
                    <div className="left">
                        <Corouselimgs className="abc" images = {data?.thumbnail} neeche={true} obj = {obj}/>
                    </div>
                    <div className="right">
                        <span className="name">{data?.productName}</span>
                        <span className="price">&#8377;{data?.price}</span>
                        <span className="desc">{data?.productDescription}</span>

                        <div className="cart-buttons">
                            <div className="quantity-buttons">
                                <span onClick={decrement}>-</span>
                                <span>{quantity}</span>
                                <span onClick={increment}>+</span>
                            </div>
                            <button
                                className="add-to-cart-button"
                                onClick={() => {
                                    handleAddToCart(data, quantity);
                                    setQuantity(1);
                                }}
                            >
                                <FaCartPlus size={20} />
                                <div>ADD TO CART</div>
                            </button>
                        </div>

                        <span className="divider" />
                        <div className="info-item">
                            <span className="text-bold">
                                Category:{" "}
                                <span>
                                    {
                                        data?.category?.name
                                    }
                                </span>
                            </span>
                            <span className="text-bold">
                                Share:
                                <span className="social-icons">
                                    <FaFacebookF size={16} />
                                    <FaTwitter size={16} />
                                    <FaInstagram size={16} />
                                    <FaLinkedinIn size={16} />
                                    <FaPinterest size={16} />
                                </span>
                            </span>
                            <span className="text-bold">
                                Discounts:
                                <span className="social-icons">
                                   {data?.discounts}% On axis Bank Credit Card
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
              
               
                <Products
                        headingText="Related Products"
                        products={relatedProd}
                    />
            </div>
        </div>
    );
};

export default SingleProduct;


