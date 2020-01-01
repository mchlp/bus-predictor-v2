import React, { Component } from 'react';
import Axios from 'axios';

/* global L */

const DEFAULT_CENTRE = [43.653908, -79.384329];
const DEFAULT_ZOOM = 15;
const UPDATE_INTERVAL_MILLIS = 20000;

export default class Map extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            routeList: [],
        };
        this.markerList = [];

    }

    componentDidMount() {
        this.map = L.map('map').setView(DEFAULT_CENTRE, DEFAULT_ZOOM);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            accessToken: 'pk.eyJ1IjoibWljaGFlbHB1IiwiYSI6ImNrNHVveWt2NjRjeHIza2xiNGt1c2F5OXkifQ.zpvAqpD5V7t5IqC9lfdeQg'
        }).addTo(this.map);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.stopId !== this.props.stopId) {
            if (this.props.stopId) {
                this.updateMap();
            }
        }

        this.updateInterval = setInterval(this.updateRouteVehicles, UPDATE_INTERVAL_MILLIS);
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval);
    }

    updateRouteVehicles = async () => {
        if (this.state.routeList.length) {
            for (const marker of this.markerList) {
                marker.remove();
            }
            this.markerList = [];
            for (const route of this.state.routeList) {
                const northIcon = L.icon({
                    iconUrl: '/img/north.png',
                    iconSize: [30, 30]
                });

                const southIcon = L.icon({
                    iconUrl: '/img/south.png',
                    iconSize: [30, 30]
                });

                const eastIcon = L.icon({
                    iconUrl: '/img/east.png',
                    iconSize: [30, 30]
                });

                const westIcon = L.icon({
                    iconUrl: '/img/west.png',
                    iconSize: [30, 30]
                });

                const busData = (await Axios.get('/api/busLocations', { params: { route } })).data.body.vehicle;
                if (busData) {
                    for (const bus of busData) {
                        const busText = 'Bus #' + bus['$'].id + ' - ' + bus['$'].routeTag + ' - ' + bus['$'].dirTag + ' - ' + bus['$'].speedKmHr + ' km/h - Updated ' + bus['$'].secsSinceReport + ' sec ago';
                        const busCoord = [parseFloat(bus['$'].lat), parseFloat(bus['$'].lon)];
                        const busHeading = parseInt(bus['$'].heading);
                        let busIcon;
                        if (busHeading >= 315 || busHeading < 45) {
                            busIcon = northIcon;
                        } else if (busHeading >= 45 && busHeading < 135) {
                            busIcon = eastIcon;
                        } else if (busHeading >= 135 && busHeading < 225) {
                            busIcon = southIcon;
                        } else {
                            busIcon = westIcon;
                        }
                        this.markerList.push(L.marker(busCoord, { icon: busIcon, title: busText }).addTo(this.map));
                    }
                }
            }
        }
    }

    updateMap = async () => {
        this.setState({
            loading: true
        });

        const stopIcon = L.icon({
            iconUrl: '/img/bus-station.png',
            iconSize: [30, 30]
        });

        let stopCoord = null;

        const predData = (await Axios.get('/api/predict', { params: { stopId: this.props.stopId } })).data;
        const routeList = [];
        predData.body.predictions.map((prediction) => {
            routeList.push(prediction['$'].routeTag);
        });
        this.setState({
            routeList
        }, async () => {
            await Promise.all(routeList.map(async (route) => {
                const routeListData = (await Axios.get('/api/branches', { params: { route } })).data.body.route;
                await Promise.all(routeListData.map(async (routeData) => {
                    for (const stop of routeData.stop) {
                        const curStopCoord = [parseFloat(stop['$'].lat), parseFloat(stop['$'].lon)];
                        if (stop['$'].stopId == this.props.stopId) {
                            if (!stopCoord) {
                                stopCoord = curStopCoord;
                                L.marker(stopCoord, { title: stop['$'].title }).addTo(this.map);
                            }
                        } else {
                            L.marker(curStopCoord, { icon: stopIcon, title: stop['$'].title }).addTo(this.map);
                        }
                    }
                    for (const routeLine of routeData.path) {
                        const routeLinePointList = [];
                        for (const routePoint of routeLine.point) {
                            routeLinePointList.push([parseFloat(routePoint['$'].lat), parseFloat(routePoint['$'].lon)]);
                        }
                        L.polyline(routeLinePointList, { color: '#' + routeData['$'].color }).addTo(this.map);
                    }
                }));
            }));
            await this.updateRouteVehicles();
            this.map.setView(stopCoord ? stopCoord : DEFAULT_CENTRE, DEFAULT_ZOOM);
            this.setState({
                loading: false
            });
        });
    }

    render() {
        return (
            <div>
                {this.state.loading ? <div className='m-2'>Loading Map...</div> : null}
                <div id='map' style={{ height: '600px' }} />
            </div >
        );
    }
}
