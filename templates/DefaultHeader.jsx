import Head from 'next/head';
import React from 'react';

const DefaultHeader = () => (
    <div>
        <Head>
            <title>Bus Predictor v2</title>
            <link rel='icon' href='/favicon.ico' />
            <script src='./jquery-3.4.1.slim.min.js' />
            <script src='./bootstrap.bundle.min.js' />
            <link rel='stylesheet' type='text/css' href='./bootstrap.min.css' />
            <link rel='stylesheet' type='text/css' href='./styles.css' />
        </Head>
    </div>
);

export default DefaultHeader;