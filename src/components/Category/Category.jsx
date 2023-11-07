import { useParams } from "react-router-dom";
import Products from "../Products/Products";
import { fetchCategoryFromApi } from '../../utils/api'
import "./Category.scss";

import { useEffect, useState } from "react";

const Category = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchCategoryFromApi(id);
                setData(response?.data?.selectedCategory);
            } catch (error) {
                console.error("Error fetching category data:", error);
            }
        }
        fetchData();
    }, [id]);

       console.log(data)
    return (
        <div className="category-main-content">
            <div className="layout">
                <div className="category-title">
                    {
                        data?.name
                    }
                </div>
                <div>
                    {data?.description}
                </div>
                <Products innerPage={true} products={data?.product} />
            </div>
        </div>
    );
};

export default Category;
