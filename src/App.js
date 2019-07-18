import React, { Component } from 'react';
import agent from './agent';

class App extends Component {
    componentDidMount() {
        agent.Loan.getLoans()
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.error('marketPlace GET error', err);
            });
    }
    render() {
        return (
            <div id="root">
                <h1>Wellcome</h1>
            </div>
        );
    }
}

export default App;
