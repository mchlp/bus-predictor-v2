import React from 'react';
import PageWrapper from '../templates/PageWrapper';
import Selector from '../components/Selector';

const Home = () => (
    <PageWrapper>
        <div className='container my-5'>
            <Selector />
        </div>
    </PageWrapper>
);

export default Home;