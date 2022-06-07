import axios from 'axios'
import { toast } from "react-toastify";

axios.defaults.baseURL = "http://localhost:3001";

axios.interceptors.request.use(
    (config) => {
        const token = window.localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        toast.error(error.response);
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(undefined, (error) => {


    if (!error.response) {
        toast.error('Network error');
    }

    toast.error(error.response);
    throw error.response;
});

const request = {
    get: async (url, body = {}) => await axios.get(url, body),
    post: async (url, body = {}) => await axios.post(url, body),
    del: async (url) => await axios.delete(url)
}

export const Functions =  {
    login: async (user) => await request.post('/auth/login', user),
    register: async (user) => await request.post('/auth/register', user),
    currentUser: async () => await request.get('/auth/getcurrentuser'),
    getProducts: async () => await request.get('/products'),
    addToCart: async(productId) => await request.post('/cart/addToCart', {productId}),
    removeFromCart: async(productId) => await request.post('/cart/removeFromCart', {productId}),
    getCart: async() => await request.get('/cart'),
    getAddresses: async() => await request.get('/addresses'),
    getOrders: async() => await request.get('/order'),
    addOrders: async() => await request.post('/order/add'),
    addAddresses: async(adresa, nume) => await request.post('/addresses/add', {adresa, nume}),
    deleteAddresses: async(id) => await request.del(`/addresses/remove/${id}`),
    getFilteredProducts: async(category, size) => await request.post('/products/filteredProducts', {category, size})
}