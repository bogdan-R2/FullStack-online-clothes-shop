import React, {useEffect, useState} from 'react';
import {Functions} from '../agent'

const Homepage = ({user, cart, getCart, products, addToCart, removeFromCart, getFilteredProducts}) => {
    const [category, setCategory] = useState('');
    const [size, setSize] = useState('');

    return <div>
      <div>
          Filtre <br />
          <input placeholder='Category' onChange={(e) => {setCategory(e.target.value); getFilteredProducts(e.target.value, size)}} value={category}/>
          <input placeholder='Size(M, L, XL)' onChange={(e) => {setSize(e.target.value);getFilteredProducts(category, e.target.value)}} value={size}/>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        {products.map(product => 
            (<div key={product._id} style={{width: '200px', height: '400px', background: '#e0e0e0', display:'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <div>
                    {product.name}
                </div>
                <div>
                    pret: {product.price}
                </div>
                <div>
                    categorie: {product.category}
                </div>
                <div>
                    marime: {product.size}
                </div>
                <img src={product.image} width="100%"/>
                <div>
                    <button onClick={() => removeFromCart(product._id)}>-</button>
                    <span>{product.quantity}</span>
                    <button onClick={() => addToCart(product._id)}>+</button>
                </div>
            </div>))
            }
      </div>
  </div>;
};

export default Homepage;
