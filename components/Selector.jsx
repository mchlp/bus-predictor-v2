import React, { Component } from 'react';
import RouteSelector from './RouteSelector';
import StopSelector from './StopSelector';
import Predictions from './Predictions';

export default class Selector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: 'byRoute',
            selectedStop: null,
            selectedStopName: null
        };
    }

    changeSelectType = (e) => {
        this.setState({
            selected: e.target.id
        });
    }

    selectStop = (stopId, stopName) => {
        this.setState({
            selectedStop: stopId,
            selectedStopName: stopName
        });
    }

    render() {
        return (
            <div className='card'>
                <div className='card-body'>
                    <div className="btn-group btn-group-toggle btn-block" data-toggle="buttons">
                        <label className="btn btn-secondary active">
                            <input type="radio" name="options" id="byRoute" defaultChecked onClick={this.changeSelectType} /> By Route
                        </label>
                        <label className="btn btn-secondary">
                            <input type="radio" name="options" id="byStopID" onClick={this.changeSelectType} /> By Stop ID
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
                        <Predictions stopId={this.state.selectedStop} stopName={this.state.selectedStopName} />
                    </div>
                </div>
            </div>
        );
    }
}
