import React from 'react';

const Navbar = () => (
    <div>
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
            <a className='navbar-brand' href='/'>Bus Predictor v2</a>
            <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarText' aria-controls='navbarText' aria-expanded='false' aria-label='Toggle navigation'>
                <span className='navbar-toggler-icon'></span>
            </button>
        </nav>
    </div>
);

export default Navbar;