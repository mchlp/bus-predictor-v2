import React from 'react';
import PageWrapper from '../templates/PageWrapper';
import Selector from '../components/Selector';

const Home = ({ query }) => {
    return (
        <PageWrapper>
            <div className='container my-5'>
                <Selector stopId={query ? query.stopId : null} />
            </div>
        </PageWrapper>
    );
};

Home.getInitialProps = ({ query }) => {
    return { query };
};

export default Home;
