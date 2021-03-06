import React, { Component } from 'react';
import Axios from 'axios';

const UPDATE_INTERVAL_MILLIS = 5000;

export default class Predictions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            error: null,
            lastUpdate: null,
            nextUpdatePercentElapsed: null,
            updating: false,
        };
    }

    componentDidMount() {
        this.updateInterval = setInterval(this.checkUpdate, 1000);
    }

    checkUpdate = async () => {
        let update = (Date.now() - this.state.lastUpdate) >= UPDATE_INTERVAL_MILLIS;
        if (update) {
            clearInterval(this.updateInterval);
            await this.updatePredictions();
            this.updateInterval = setInterval(this.checkUpdate, 1000);
        } else {
            this.setState((prevState) => ({
                nextUpdatePercentElapsed: 1 - ((Date.now() - prevState.lastUpdate) / UPDATE_INTERVAL_MILLIS)
            }));
        }
    }

    updatePredictions = async () => {
        this.setState({
            updating: true,
            nextUpdatePercentElapsed: 1
        });
        const data = (await Axios.get('/api/predict', { params: { stopId: this.props.stopId } })).data;
        const now = Date.now();
        if (data.body.Error) {
            await this.setState({
                error: data.body.Error,
                data: null,
                lastUpdate: now,
                updating: false
            });
        } else {
            await this.setState({
                error: null,
                data: data.body.predictions,
                lastUpdate: now,
                updating: false
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.stopId && this.props.stopId !== prevProps.stopId) {
            this.updatePredictions();
        }
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval);
    }

    render() {
        let content;
        if (this.props.stopId) {
            let contentBody;
            if (this.state.error) {
                contentBody = (
                    <div>
                        The Stop ID entered is not valid.
                    </div>
                );
            } else if (this.state.data) {
                let validPredictionCount = this.state.data.length;
                contentBody = this.state.data.map((prediction) => {
                    if (prediction.direction) {
                        validPredictionCount++;
                        return prediction.direction.map((direction) => {
                            const predictionContent = direction.prediction.map((predictionData) => {
                                const prediction = predictionData['$'];
                                return (
                                    <tr key={prediction.epochTime}>
                                        <th scope='row'>{prediction.branch}</th>
                                        <td>{prediction.vehicle}</td>
                                        <td>{Math.floor(prediction.seconds / 60)} min {prediction.seconds % 60} sec</td>
                                        <td>{(new Date(parseInt(prediction.epochTime))).toLocaleTimeString('en-CA')}</td>
                                    </tr>
                                );
                            });
                            return (
                                <div key={direction['$'].title}>
                                    <h3>{direction['$'].title}</h3>
                                    <div className='mt-3'>
                                        <table className='table table-striped table-hover'>
                                            <thead className='thead-dark'>
                                                <tr>
                                                    <th scope='col'>Branch</th>
                                                    <th scope='col'>Bus Number</th>
                                                    <th scope='col'>Time to ETA</th>
                                                    <th scope='col'>ETA</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {predictionContent}
                                            </tbody>
                                        </table>
                                    </div >
                                    <hr />
                                </div >
                            );
                        });
                    } else {
                        return (
                            <div key={prediction['$'].dirTitleBecauseNoPredictions}>
                                <h3>{prediction['$'].dirTitleBecauseNoPredictions}</h3>
                                <div className='my-3'>
                                    No predictions avaliable for this route at this stop at this time.
                                </div >
                                <hr />
                            </div >
                        );
                    }
                });
                if (validPredictionCount === 0) {
                    contentBody = (
                        <div>
                            No predictions avaliable for the selected stop.
                        </div>
                    );
                }
            } else {
                contentBody = (
                    <div>
                        <h4>Loading Predictions...</h4>
                    </div>
                );
            }
            let progressString = this.state.updating ? 'Updating...' : (Math.max(0, this.state.nextUpdatePercentElapsed * UPDATE_INTERVAL_MILLIS / 1000)).toFixed(0) + ' sec until next update';
            content = (
                <div>
                    <h1>{this.state.error ? null : (this.state.data ? this.state.data[0]['$'].stopTitle : 'Loading stop...')}</h1>
                    <p>Stop Number: {this.props.stopId}</p>
                    <div className='progress mb-3' style={{ height: '25px' }}>
                        <div className={'progress-bar ' + (this.state.updating ? 'bg-info' : 'bg-success')} role='progressbar' style={{ width: (Math.min(100, this.state.nextUpdatePercentElapsed * 100)) + '%' }}>{progressString}</div>
                    </div>
                    <hr />
                    {contentBody}
                </div>
            );
        } else {
            content = (
                <div>
                    <h4>No stop selected.</h4>
                </div>
            );
        }
        return (
            <div>
                {content}
            </div>
        );
    }
}
