import React, { Component } from 'react';
import Axios from 'axios';

export default class Predictions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
    }

    updatePredictions = async () => {
        const data = (await Axios.get('/api/predict', { params: { stopId: this.props.stopId } })).data;
        this.setState({
            data: data.body.predictions[0]
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.stopId && this.props.stopId !== prevProps.stopId) {
            this.updatePredictions();
        }
    }

    render() {
        let content;
        if (this.props.stopId) {
            if (this.state.data) {
                if (this.state.data.direction) {
                    content = this.state.data.direction.map((direction) => {
                        console.log(direction);
                        const predictionContent = direction.prediction.map((predictionData) => {
                            const prediction = predictionData['$'];
                            console.log(prediction);
                            return (
                                <div key={prediction.epochTime}>
                                    Arriving in {Math.floor(prediction.seconds / 60)}:{prediction.seconds % 60}
                                </div>
                            );
                        });
                        return (
                            <div key={direction['$'].title}>
                                <h4>{direction['$'].title}</h4>
                                <div>
                                    {predictionContent}
                                </div>
                            </div>
                        );
                    });

                } else {
                    content = (
                        <div>
                            No predictions avaliable for the selected stop.
                        </div>
                    );
                }

            } else {
                content = (
                    <div>
                        <h4>Loading Predictions...</h4>
                    </div>
                );
            }
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
