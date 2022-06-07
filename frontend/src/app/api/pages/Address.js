import React, {useState} from 'react';

const Address = ({address, addAddresses, deleteAddresses}) => {

  const [nume, setNume] = useState('');
  const [adresa, setAdresa] = useState('');
  return <div>
    <div >

        {address.map(addr => 
            (
            <p>
                {
                    addr.nume},{
                    addr.adresa
                }
                <button onClick={() => deleteAddresses(addr._id)}>x</button>
            </p>
            ))
        }
      </div>
      <input value={nume} onChange={(e) => setNume(e.target.value)} placeholder='nume'/>
      <input value={adresa} onChange={(e) => setAdresa(e.target.value)} placeholder='adresa' />
      <button onClick={() => {addAddresses(nume, adresa); setNume(''); setAdresa('')}}>Add Address</button>

  </div>;
};

export default Address;