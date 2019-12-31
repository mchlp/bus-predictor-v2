import React, { Component } from 'react';

export default class StopSelector extends Component {

    selectStop = async (e) => {
        e.preventDefault();
        this.props.selectStop(document.getElementById('stop-select').value);
    }

    render() {
        return (
            <div>
                <form onSubmit={this.selectStop}>
                    <div className='form-group'>
                        <label htmlFor='stop-select'>Stop ID</label>
                        <input type='number' className='form-control' id='stop-select' />
                    </div>
                    <button className='btn btn-primary' type='submit'>Go</button>
                </form>
            </div>
        );
    }
}
