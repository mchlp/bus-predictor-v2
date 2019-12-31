import React, { Component } from 'react';
import Axios from 'axios';

export default class RouteSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            routeList: [],
            branchInfo: null,
            selectedRoute: null,
            selectedBranchIndex: null,
            selectedStop: null
        };
    }

    async componentDidMount() {
        const routeListData = (await Axios.get('/api/routes')).data;
        const routeList = routeListData.body.route.map((route) => {
            return route['$'];
        });
        this.setState({
            routeList
        });
        this.selectRoute({
            target: {
                value: routeList[0].tag
            }
        });
    }

    selectRoute = async (e) => {
        this.setState({
            selectedRoute: e.target.value
        });
        const branchListData = (await Axios.get('/api/branches', { params: { route: e.target.value } })).data;
        const branchInfo = branchListData.body.route[0];
        const stopObj = {};
        branchInfo.stop.map((stop) => {
            stopObj[stop['$'].tag] = stop['$'];
        });
        branchInfo.stopObj = stopObj;
        this.setState({
            branchInfo
        });
        this.selectBranch({
            target: {
                value: 0
            }
        });
    }

    selectBranch = async (e) => {
        this.setState({
            selectedBranchIndex: e.target.value
        }, () => {
            this.selectStop({
                target: {
                    value: this.state.branchInfo.direction[this.state.selectedBranchIndex].stop[0]['$'].tag
                }
            });
        });
    }

    selectStop = async (e) => {
        this.setState({
            selectedStop: e.target.value
        });
        this.props.selectStop(this.state.branchInfo.stopObj[e.target.value].stopId, this.state.branchInfo.stopObj[e.target.value].title);
    }

    render() {
        const hasRouteList = this.state.routeList.length > 0;
        let routeEleList;
        if (hasRouteList) {
            routeEleList = this.state.routeList.map((route) => {
                return (
                    <option key={route.tag} value={route.tag}>{route.title}</option>
                );
            });
        } else {
            routeEleList = [
                <option key='0'>Loading Routes...</option>
            ];
        }

        const hasBranchList = this.state.branchInfo ? true : false;
        let branchEleList;
        if (hasBranchList) {
            branchEleList = this.state.branchInfo.direction.map((branch, index) => {
                return (
                    <option key={branch['$'].tag} value={index}>{branch['$'].title}</option>
                );
            });
        } else {
            if (this.state.selectedRoute) {
                branchEleList = [
                    <option key='0'>Loading Branches...</option>
                ];
            } else {
                branchEleList = [
                    <option key='0'>Select a Route</option>
                ];
            }
        }

        const hasStoplist = this.state.branchInfo && (this.state.selectedBranchIndex !== null);
        let stopEleList;
        if (hasStoplist) {
            stopEleList = this.state.branchInfo.direction[this.state.selectedBranchIndex].stop.map((stopTag) => {
                const stop = this.state.branchInfo.stopObj[stopTag['$'].tag];
                return (
                    <option key={stop.tag} value={stop.tag} selected={this.state.selectedStop === stop.tag}>{stop.title}</option>
                );
            });
        } else {
            if (this.state.selectedBranchIndex) {
                stopEleList = [
                    <option key='0'>Loading Stops...</option>
                ];
            } else {
                stopEleList = [
                    <option key='0'>Select a Branch</option>
                ];
            }
        }

        return (
            <div>
                <form>
                    <div className="form-group">
                        <label htmlFor="route-select">Route</label>
                        <select id='route-select' className="custom-select" disabled={!hasRouteList} required onChange={this.selectRoute}>
                            {routeEleList}
                        </select>

                    </div>
                    <div className="form-group">
                        <label htmlFor="branch-select">Branch</label>
                        <select id='branch-select' className="custom-select" disabled={!hasBranchList} required onChange={this.selectBranch}>
                            {branchEleList}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="stop-select">Stop</label>
                        <select id='stop-select' className="custom-select" disabled={!hasStoplist} required onChange={this.selectStop}>
                            {stopEleList}
                        </select>
                    </div>
                </form>
            </div>
        );
    }
}
