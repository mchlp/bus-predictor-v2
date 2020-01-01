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
            <link rel='stylesheet' href='https://unpkg.com/leaflet@1.6.0/dist/leaflet.css'
                integrity='sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=='
                crossOrigin='' />
            <script src='https://unpkg.com/leaflet@1.6.0/dist/leaflet.js'
                integrity='sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=='
                crossOrigin=''></script>
        </Head>
    </div>
);

export default DefaultHeader;