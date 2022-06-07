import React from 'react';

const Cart = ({cart, products, addToCart, removeFromCart, addOrder}) => {

  return <div>
    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>

        {products.filter(q => cart.filter(c => c.productId == q._id).length > 0).map(product => 
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
        <button onClick={() => addOrder()}>Place Order</button>
  </div>;
};

export default Cart;
