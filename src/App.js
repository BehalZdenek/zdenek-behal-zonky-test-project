import React, { Component } from 'react';
import agent from './agent';
import { Header } from './Components';

class App extends Component {
    state = {
        ratings: [
            { letterRating: 'AAAAAA', numberRating: '2,99%' },
            { letterRating: 'AAAAA', numberRating: '3,99%' },
            { letterRating: 'AAAA', numberRating: '4,99%' },
            { letterRating: 'AAA', numberRating: '5,99%' },
            { letterRating: 'AAE', numberRating: '6,99%' },
            { letterRating: 'AA', numberRating: '8,49%' },
            { letterRating: 'AE', numberRating: '9,49%' },
            { letterRating: 'A', numberRating: '10,99%' },
            { letterRating: 'B', numberRating: '13,49%' },
            { letterRating: 'C', numberRating: '15,49%' },
            { letterRating: 'D', numberRating: '19,99%' }
        ],
        valuesField: [],
        selectedRating: '',
        letterRating: '',
        isLoading: false
    };
    componentDidMount() {
        this.callApiWithLoans();
    }
    callApiWithLoans = () => {
        let valuesField = [];
        this.loadingStart();
        agent.Loan.getLoans()
            .then(res => {
                this.loadingEnd();
                res.map(item => {
                    return valuesField.push({ amount: item.amount, rating: item.rating });
                });
            })
            .catch(err => {
                this.loadingEnd();
                window.alert('Chyba při načítání dat z API');
                console.error('marketPlace GET error', err);
            });
        this.setState({
            valuesField: valuesField
        });
    };
    drawRatings = () => {
        const { ratings, selectedRating } = this.state;
        if (ratings) {
            return ratings.map(item => {
                return (
                    <button
                        className={`rating-button ${item.numberRating === selectedRating ? 'active' : ''}`}
                        value={item.letterRating}
                        onClick={() => {
                            this.selectRating(item.letterRating, item.numberRating);
                        }}
                        key={item.letterRating}
                    >
                        {item.numberRating}
                    </button>
                );
            });
        }
    };
    countDiameter = selectedRating => {
        const { valuesField } = this.state;
        let filtered = valuesField.filter(function(item) {
            if (item.rating === selectedRating) {
                return { amount: parseInt(item.value), rating: item.rating };
            } else {
                return null;
            }
        });
        let reduceValue = filtered.reduce(function(total, currentValue) {
            return total + currentValue.amount;
        }, 0);
        let diameter = reduceValue / filtered.length;
        this.setState({
            diameter: Math.round(diameter)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
        });
    };
    selectRating = (letterRating, numberRating) => {
        this.setState({
            letterRating: letterRating,
            selectedRating: numberRating
        });
        this.countDiameter(letterRating);
    };
    loadingStart = () => {
        this.setState({ isLoading: true });
    };
    loadingEnd = () => {
        this.setState({ isLoading: false });
    };
    render() {
        const { selectedRating, diameter, isLoading } = this.state;
        return (
            <div className="page">
                <Header />
                {isLoading ? (
                    <div className="loading-screen">
                        <div className="lds-ring">
                            <div />
                            <div />
                            <div />
                            <div />
                        </div>
                        Načítání
                    </div>
                ) : null}
                <div className="container">
                    <div className="container-header">
                        <h1>Výpočet průměrných půjček podle ratingu</h1>
                        <p>Vyberte rating (tlačítka s procenty), pro který si přejete zobrazit průměrnou výši půjček</p>
                    </div>
                    <div className="big-content-wrap">
                        <div className="ratings-wrapper">
                            <div className="ratings-label">Rating:</div>
                            <div className="ratings-content">{this.drawRatings()}</div>
                        </div>
                        <div className="average-value-wrapper">
                            <div className="average-value-label">Průměrná výše půjček</div>
                            {selectedRating.length > 0 ? (
                                <div className="average-value-content">
                                    <p className="selected-value-text">
                                        Vybraná hodnota: <b>{selectedRating}</b>
                                    </p>
                                    {parseInt(diameter) ? (
                                        <p className="counted-value">
                                            Vypočítaný průměr: <br /> <b>{diameter} Kč</b>
                                        </p>
                                    ) : (
                                        <p className="counted-value">Vybraný rating nemá žádné záznamy, podle kterých by se dal vypočítat průměr.</p>
                                    )}

                                    <div className="divider" />
                                    <div className="av-v-btn-wrap">
                                        <button
                                            onClick={() => {
                                                this.setState({ selectedRating: '', letterRating: '' });
                                            }}
                                        >
                                            Zrušit výběr
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="average-value-content noValue">
                                    <p className="average-value-noValueText">Pro zobrazení výsledku vyberte v menu vlevo hodnotu.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
