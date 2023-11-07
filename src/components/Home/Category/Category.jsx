import { useNavigate } from "react-router-dom";
import "./Category.scss";

const Category = ({ categories }) => {
    const navigate = useNavigate();
    return (
        <div className="shop-by-category">
            <div className="sec-heading">Popular Categories</div>
            <div className="categories">
                {categories?.slice(0, 4).map((item) => (
                    <div
                        key={item._id}
                        className="category"
                        onClick={() => navigate(`/category/${item._id}`)}>
                       
                        <img src = {item.image} alt={item.name}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Category;
