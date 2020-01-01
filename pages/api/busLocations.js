import Axios from 'axios';
import xmlParser from 'xml2js';

const agency = 'ttc';

export default async (req, res) => {
    if (req.method === 'GET') {
        const data = (await Axios.get('http://webservices.nextbus.com/service/publicXMLFeed', {
            params: {
                command: 'vehicleLocations',
                a: agency,
                r: req.query.route,
                t: 0
            }
        })).data;
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(await xmlParser.parseStringPromise(data)));
    } else {
        res.statusCode = 405;
        res.end();
    }
};