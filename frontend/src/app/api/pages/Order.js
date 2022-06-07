import React, {useState} from 'react';

const Order = ({orders}) => {

  return <div>
   {orders.map((ordr, idx) => 
            (
            <p key={ordr._id}>
                Comanda {idx}: <br/>
                {ordr.produse.map(prod => (<p key ={prod.productId}><span>ProdId: {prod.productId}</span>  <span> price: {prod.price} </span> <span>Qty: {prod.quantity}</span><br/></p>))}
                Cost total: {ordr.produse.map(elem => elem.price * elem.quantity).reduce(function(a, b) { return a + b; }, 0)}
            </p>
            ))
        }
    
  </div>;
};

export default Order;