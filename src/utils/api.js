import axios from "axios";



export const fetchDataFromApi = async (url, token) => {
    try {
        console.log("token",token)
        const { data } = await axios.get(`http://localhost:4000${url}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Include the JWT token in the "Authorization" header
            },
        });
        return data;
    } catch (err) {
        console.log(err);
        return err;
    }
};

export const removeProduct = async (url, token,product) => {
    try {
        console.log("token",token,product)
        
        const { data } = await axios.post(`http://localhost:4000${url}`,{
            productId:product.productId
        },
         {
            headers: {
                'Authorization': `Bearer ${token}` // Include the JWT token in the "Authorization" header
            },
        });
        return data;
    } catch (err) {
        console.log(err);
        return err;
    }
};

export const updateDataFromApi = async (url, token, method, product, quantity) => {
    try {
        // Convert the quantity to a number if it's not already
        quantity = Number(quantity);
        const obj = {
            productId: product._id,
            productName: String(product.productName),
            quantity,
            price: Number(product.price),
            image: String(product.thumbnail[0]),
            action: String(method),
        };
          console.log(obj)
        const { data } = await axios.post(`http://localhost:4000${url}`, obj, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return data;
    } catch (err) {
        console.log(err);
        return err;
    }
};

export const fetchCategoryFromApi = async (id) => {
    try {
        console.log(id);
        const { data } = await axios.get(`http://localhost:4000/api/v1/product/getCategoryPageDetails`, {
            params: {
                categoryId: id
            }
        });
        return data;
    } catch (err) {
        console.log(err);
        return err;
    }
};

export const fetchProductFromApi = async (id) => {
    try {
        
        const { data } = await axios.get(`http://localhost:4000/api/v1/product/getProductDetails`, {
            params: {
                productId: id
            }
        });
        return data;
    } catch (err) {
        console.log(err);
        return err;
    }
};

export const sendOtp = async (email) => {
    try {
       const {data} = await axios.post(
             'http://localhost:4000/api/v1/auth/sendotp',
            {
                email:email
            }
        );
        return data;
    } catch (err) {
        console.log(err);
        return err;
    }
};
export const signUp = async (formData) => {
    try {
       const {data} = await axios.post(
             'http://localhost:4000/api/v1/auth/signup',
            
                formData
            
        );
        return data;
    } catch (err) {
        console.log(err);
        return err;
    }
};
export const logIn = async (formData) => {
    try {
       const {data} = await axios.post(
             'http://localhost:4000/api/v1/auth/login',
                formData  
        );
        return data;
    } catch (err) {
        console.log(err);
        return err;
    }
};

