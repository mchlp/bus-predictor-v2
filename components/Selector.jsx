import React, { Component } from 'react';
import RouteSelector from './RouteSelector';
import StopSelector from './StopSelector';
import Predictions from './Predictions';
import Map from './Map';
import Router from 'next/router';

export default class Selector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: 'byRoute',
            selectedStop: props.stopId,
            inBrowser: false
        };
    }

    componentDidMount() {
        this.setState({
            inBrowser: true
        });
    }

    changeSelectType = (e) => {
        this.setState({
            selected: e.target.id
        });
    }

    selectStop = (stopId) => {
        Router.push({
            pathname: '/',
            query: { stopId }
        });
        this.setState({
            selectedStop: stopId,
        });
    }

    render() {
        return (
            <div className='card'>
                <div className='card-body'>
                    <div className='btn-group btn-group-toggle btn-block' data-toggle='buttons'>
                        <label className='btn btn-secondary active'>
                            <input type='radio' name='options' id='byRoute' defaultChecked onClick={this.changeSelectType} /> By Route
                        </label>
                        <label className='btn btn-secondary'>
                            <input type='radio' name='options' id='byStopID' onClick={this.changeSelectType} /> By Stop ID
                        </label>
                    </div>
                </div>
                <div className='card mx-3 mb-3'>
                    <div className='card-body'>
                        {
                            this.state.selected === 'byRoute' ?
                                <RouteSelector selectStop={this.selectStop} />
                                :
                                <StopSelector selectStop={this.selectStop} />
                        }
                    </div>
                </div>
                <div className='card mx-3 mb-3'>
                    <div className='card-body'>
                        <Predictions stopId={this.state.selectedStop} />
                    </div>
                </div>
                <div className='card mx-3 mb-3'>
                    <div className='card-body'>
                        <Map stopId={this.state.selectedStop} />
                    </div>
                </div>
            </div>
        );
    }
}
