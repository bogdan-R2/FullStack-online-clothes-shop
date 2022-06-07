import logo from './logo.svg';
import './App.css';
import { toast, ToastContainer } from "react-toastify";
import {Routes, Route, Link} from 'react-router-dom';
import Register from './app/api/pages/Register';
import Login from './app/api/pages/Login';
import Homepage from './app/api/pages/Homepage';
import {Functions} from './app/api/agent'
import {useEffect, useState} from 'react';
import Cart from './app/api/pages/Cart'
import Address from './app/api/pages/Address';
import Order from './app/api/pages/Order'

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [address, setAddress] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    function checkUserData() {
      const item = localStorage.getItem('token')
  
      if (item) {
        setToken(item)
      }
    }
  
    window.addEventListener('storage', checkUserData)
  
    return () => {
      window.removeEventListener('storage', checkUserData)
    }
  }, [])

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, [])

  useEffect(() => {
    if(token) {
      Functions.currentUser().then(resp => {
        setUser(resp.data.success)
        getAddresses();
        getOrders();
      }
      );
      Functions.getProducts().then((resp) => {
        getCart(resp.data.success);
        setFilteredProducts(resp.data.success)
      })
    } else {
      Functions.getProducts().then((resp) => {setProducts(resp.data.success); setFilteredProducts(resp.data.success);});
    }
  }, [token]);

  const getCart = (products) => {
    Functions.getCart().then(resp => {
      setCart(resp.data.success);
      const cart = resp.data.success;
      let newProducts = [];
      console.log(products);
      products.forEach(product => {
        const elem = cart.filter(elem => elem.productId == product._id);
        if(elem.length > 0) {
          newProducts.push({...product, quantity: elem[0].quantity});
        } else {
          newProducts.push({...product, quantity: 0})
        }
      })
      let newFilteredProducts = [];
      products.forEach(product => {
        const elem = cart.filter(elem => elem.productId == product._id);
        if(elem.length > 0) {
          newFilteredProducts.push({...product, quantity: elem[0].quantity});
        } else {
          newFilteredProducts.push({...product, quantity: 0})
        }
      })
      setFilteredProducts(newFilteredProducts);
      setProducts(newProducts);
    });
  }

  const getCartNoParams = () => {
    Functions.getCart().then(resp => {
      setCart(resp.data.success);
      const cart = resp.data.success;
      let newProducts = [];
      console.log(products);
      products.forEach(product => {
        const elem = cart.filter(elem => elem.productId == product._id);
        if(elem.length > 0) {
          newProducts.push({...product, quantity: elem[0].quantity});
        } else {
          newProducts.push({...product, quantity: 0})
        }
      });
      let newFilteredProducts = [];
      filteredProducts.forEach(product => {
        const elem = cart.filter(elem => elem.productId == product._id);
        if(elem.length > 0) {
          newFilteredProducts.push({...product, quantity: elem[0].quantity});
        } else {
          newFilteredProducts.push({...product, quantity: 0})
        }
      })
      setFilteredProducts(newFilteredProducts);
      setProducts(newProducts);
    });
  }

  const addToCart = (id) => {
    Functions.addToCart(id).then(_ => {
      getCartNoParams();
    });
  }
  const removeFromCart = (id) => {
    Functions.removeFromCart(id).then(_ => {
      getCartNoParams();
    });
  }

  const getAddresses = () => {
    Functions.getAddresses().then(resp => {
      setAddress(resp.data.success)
    });
  }

  const deleteAddresses = (id) => {
    Functions.deleteAddresses(id).then(resp => {
      getAddresses();
    });
  }

const addAddresses = (adresa, nume) => {
    Functions.addAddresses(adresa, nume).then(resp => {
      getAddresses();
    });
  }

  const getOrders = () => {
    Functions.getOrders().then(resp => {
      setOrders(resp.data.success);
    });
  }

  const addOrders = () => {
    Functions.addOrders().then(() => {
      // getAddresses();
      getCart(products);
      getOrders();
    })
  }

  const getFilteredProducts = (category, size) => {
      Functions.getFilteredProducts(category, size).then(resp => {
        let newFilteredProducts = [];
        resp.data.success.forEach(product => {
          const elem = cart.filter(elem => elem.productId == product._id);
          if(elem.length > 0) {
            newFilteredProducts.push({...product, quantity: elem[0].quantity});
          } else {
            newFilteredProducts.push({...product, quantity: 0})
          }
        })
        setFilteredProducts(newFilteredProducts);})
  }

  return (
    <div className="App">
      <ToastContainer position='bottom-left' />
      {
        user && (<div style={{width: '100%', height:'50px', background: 'red', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
        <Link to="/" style={{marginRight: '20px'}}>Home</Link>
        <Link to="/cart" style={{marginRight: '20px'}}>Cart</Link>
        <Link to="/addresses" style={{marginRight: '20px'}}>Addresses</Link>
        <Link to="/order" style={{marginRight: '20px'}}>Orders</Link>
        <Link to="/login" style={{marginRight: '20px'}}>Log in</Link>
        <Link to="/register" style={{marginRight: '20px'}}>Register</Link>
        <span style={{color: 'white', marginRight: '15px'}}>Hello, {user?.username}</span>
        </div>)
      }
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Homepage user={user} cart={cart} getCart={getCart}
        addToCart={addToCart} removeFromCart={removeFromCart} products={filteredProducts} getFilteredProducts={getFilteredProducts} />}/>
        <Route path="/cart" element={<Cart cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} products={products} addOrder={addOrders}/>} />
        <Route path="/addresses" element={<Address address={address} deleteAddresses={deleteAddresses} addAddresses={addAddresses}/>} />
        <Route path="/order" element={<Order orders={orders} getOrders={getOrders}/>} />
      </Routes>

    </div>
  );
}

export default App;
