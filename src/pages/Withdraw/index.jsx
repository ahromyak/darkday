import React from 'react'
import NavLink from '../../components/NavLink'
import * as Helpers from '../../models'
import {browserHistory} from 'react-router';
import {Helmet} from "react-helmet";

import noUiSlider from 'nouislider'

if (process.env.WEBPACK) {
    require('./styles.scss');
}

class Withdraw extends React.Component {

    formater() {
        return {
            to: (input) => {
                return Helpers._cutNumber(input, 1000000000)
            },
            from: (input) => {
                return Helpers._cutNumber(input, 1000000000)
            },
        }
    }

    resetUiSlider() {
        let slider = document.getElementById('withdrawSlider');
        if (!!slider) {
            slider.noUiSlider.set(0);
        }
    }

    acceptAmount(e) {
        let slider = document.getElementById('withdrawSlider');
        if (this.isNumeric(e.target.value * 1) && e.target.value * 1 <= this.state.balance && e.target.value * 1 <= slider.noUiSlider.options.range.max[0] && e.target.value * 1 >= slider.noUiSlider.options.range.min[0]) {
            slider.noUiSlider.set(e.target.value * 1);
            this.setState({pickerVal: e.target.value}, () => {
                if (this.state.pickerVal == 0 || isNaN(this.state.pickerVal)) {
                    this.reinvest.setAttribute("disabled", "disabled");
                } else {
                    this.reinvest.removeAttribute("disabled");
                }
            });
        }
    }

    isNumeric(val) {
        return typeof(val) === 'number' && !isNaN(val);
    }

    withdrawMoney() {

        this.withdrawBtn.setAttribute("disabled", "disabled");

        this.setState({showLoader: true});//Loader
        let tokenPromise = this.props.actions.chackIfValidToken();
        tokenPromise.then(() => {

            if (this.props.mainContent.isTokenValid.result) {

                if (this.state.pickerVal > 0) {
                    let promise = this.props.actions.withdrawToClient(this.state.pickerVal, this.state.currencyId);
                    promise.then(() => {

                        this.setState({showLoader: false}); //Loader

                        if (typeof this.props.mainContent.withdrawToClientWallet !== 'undefined') {

                            if (typeof this.props.mainContent.withdrawToClientWallet.system !== 'undefined' && this.props.mainContent.withdrawToClientWallet.system == true) {
                                if (this.props.mainContent.withdrawToClientWallet.result == false && this.props.mainContent.withdrawToClientWallet.walletResult != false) {
                                    this.props.actions.memoriseWithdrawSum({
                                        sum: this.state.pickerVal,
                                        currencyId: this.state.currencyId
                                    });
                                    this.props.openSideBar('withdrawCodeMap');
                                } else {
                                    Helpers.showNotify('success', this.props.textConstants['cabinet.sum.withdraw.success']);
                                    this.setState({
                                        pickerVal: 0
                                    });
                                    this.resetUiSlider();
                                }
                            } else if (this.props.mainContent.withdrawToClientWallet.walletResult == false) {
                                this.props.openSideBar();
                                Helpers.showNotify('info', this.props.textConstants[this.props.mainContent.withdrawToClientWallet.message]);
                                this.props.openSideBar('setWallet');
                            } else if (this.props.mainContent.withdrawToClientWallet.result === false
                                &&
                                typeof this.props.mainContent.withdrawToClientWallet.sumIsSmall !== 'undefined'
                                &&
                                this.props.mainContent.withdrawToClientWallet.sumIsSmall === true) {

                                let minSum = Helpers.returnMinSum(this.props.mainContent.cabinetPageData.settingsMinSumToWithdraw, 3);
                                Helpers.showNotify('info', this.props.textConstants[this.props.mainContent.withdrawToClientWallet.message] + ' ' + minSum.minimalSum);

                            } else if (this.props.mainContent.withdrawToClientWallet.result === false) {
                                Helpers.showNotify('info', this.props.textConstants[this.props.mainContent.withdrawToClientWallet.message]);
                            } else if (this.props.mainContent.withdrawToClientWallet.result === true) {
                                Helpers.showNotify('success', this.props.textConstants['cabinet.sum.withdraw.success']);
                                this.setState({
                                    pickerVal: 0
                                });
                                this.resetUiSlider();
                                browserHistory.push('/cabinet')
                            }
                        }
                        this.withdrawBtn.removeAttribute("disabled");

                    });

                } else {
                    Helpers.showNotify('danger', this.props.textConstants['cabinet.withdraw.sum.cannot.be.null']);
                    this.setState({showLoader: false});
                }
            }
        });
    }

    reinvestMoney() {

        if (this.state.pickerVal > 0) {
            browserHistory.push('/reinvest?reinvest=' + this.state.pickerVal);
            this.reinvest.setAttribute("disabled", "disabled");
        }
    }

    countBalance() {
        if (this.props.mainContent.cabinetPageData.balances && this.props.mainContent.cabinetPageData.balances.length) {
            let sum = 0;
            this.props.mainContent.cabinetPageData.balances.map((el) => {
                if (el.currencyId == 3) { //Only bitcoin balance is counted
                    sum = sum + parseFloat(el.value);
                }
            })
            return sum;
        } else {
            return 0;
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            pickerVal: 0,
            balance: 0,
            currencyId: 3,
            showLoader: false,
            showContent: false,
        }
        this.acceptAmount = this.acceptAmount.bind(this)
        this.withdrawMoney = this.withdrawMoney.bind(this)
        this.reinvestMoney = this.reinvestMoney.bind(this)
        this.countBalance = this.countBalance.bind(this)
        this.resetUiSlider = this.resetUiSlider.bind(this)
    }

    componentWillMount() {

    }

    componentDidMount() {
        if (this.props.mainContent.cabinetPageData.balances) {

            let balanceAmount = this.countBalance();
            let minSum = Helpers.returnMinSum(this.props.mainContent.cabinetPageData.settingsMinSumToWithdraw, 3);

            if (typeof minSum !== 'undefined' && balanceAmount >= parseFloat(minSum.minimalSum)) {
                this.setState({showContent: true});

                let balances = this.props.mainContent.cabinetPageData.balances.slice();
                let sum = 0;

                balances = balances.map((el) => {
                    if (el.currencyId == this.state.currencyId) {
                        sum = sum + parseFloat(el.value.toFixed(6));
                    }
                    return el;
                });

                this.setState({balance: parseFloat(sum)}, () => {
                    let slider = document.getElementById('withdrawSlider');

                    if (sum <= 0.000009 && !isNaN(sum)) {
                        slider.setAttribute('disabled', true);
                    } else {
                        slider.removeAttribute('disabled');
                    }

                    let range_all_sliders = {
                        'min': [0],
                        'max': [this.state.balance]
                    };

                    noUiSlider.create(slider, {
                        start: 0,
                        connect: [true, false],
                        range: range_all_sliders,
                        step: 0.0000001,
                        format: this.formater(),
                        pips: {
                            mode: 'values',
                            // values: [0, Helpers._roundNumbers(Math.ceil(this.state.balance / 16), 3), Helpers._roundNumbers(Math.ceil(this.state.balance / 8), 3), Helpers._roundNumbers(Math.ceil(this.state.balance / 4), 3), Helpers._roundNumbers(Math.ceil(this.state.balance / 2), 3), this.state.balance],
                            values: [0, Helpers._roundNumbers(Math.ceil(this.state.balance / 2), 3), this.state.balance],
                            density: 100,
                            stepped: true,
                            format: this.formater()
                        }
                    });

                    slider.noUiSlider.on('update', (values, handle) => {

                        this.setState({pickerVal: values[handle]}, () => {
                            if (this.state.pickerVal == 0 || isNaN(this.state.pickerVal)) {
                                this.reinvest.setAttribute("disabled", "disabled");
                                this.withdrawBtn.setAttribute("disabled", "disabled");
                            } else {
                                this.reinvest.removeAttribute("disabled");
                                this.withdrawBtn.removeAttribute("disabled");
                            }
                        });
                    });
                });

                if (sum == 0 || isNaN(sum)) {
                    this.reinvest.setAttribute("disabled", "disabled");
                    this.withdrawBtn.setAttribute("disabled", "disabled");
                } else {
                    if (typeof this.reinvest != 'undefined') {
                        this.reinvest.removeAttribute("disabled");
                    }
                    if (typeof this.withdrawBtn != 'undefined') {
                        this.withdrawBtn.removeAttribute("disabled");
                    }
                }
            }
        }
    }

    componentWillReceiveProps(nextProp) {

        if (this.props.mainContent.withdrawToClientWallet !== nextProp.mainContent.withdrawToClientWallet) {
            if (nextProp.mainContent.withdrawToClientWallet.result == true) {
                this.setState({
                    pickerVal: 0
                });
                this.resetUiSlider();
                browserHistory.push('/cabinet');
            }
        }
    }

    componentWillUnmout() {
        if (document.getElementById('withdrawSlider')) {
            let slider = document.getElementById('withdrawSlider');
            slider.noUiSlider.destroy()
        }
        this.setState({
            pickerVal: 0
        })
    }

    render() {

        let fullUrl = '/';

        if (process.env.WEBPACK) {
            fullUrl = window.location.href;
        } else {
            fullUrl = process.env.webSiteUrl
        }

        return (
            <div>
                <Helmet>
                    <meta charSet="utf-8"/>
                    <title>{this.props.mainContent.content.withdraw.metaTitle}</title>
                    <meta name="description" content={this.props.mainContent.content.withdraw.metaDescription}/>
                    <meta name="keywords" content={this.props.mainContent.content.withdraw.metaKeywords}/>
                    <meta property="og:url" content={fullUrl}/>
                    <meta property="og:type" content="article"/>
                    <meta property="og:title" content={this.props.mainContent.content.withdraw.metaTitle}/>
                    <meta property="og:description" content={this.props.mainContent.content.withdraw.metaDescription}/>
                    <meta property="og:image" content={this.props.mainContent.content.withdraw.metaPicture}/>
                </Helmet>
                {this.state.showContent ?
                    <div className="container cabinet-content ">

                        <div className="row ">
                            <div className="col-xs-12">
                                <p className="cabinet-header">
                                    {this.props.textConstants['cabinet.vivesti.sredstva']}
                                    <NavLink to={'/cabinet'} className="back-to-home">
                                        <i className="fa fa-angle-left"
                                           aria-hidden="true"/>&nbsp; {this.props.textConstants['common.back.to.main.page']}
                                    </NavLink>
                                </p>
                            </div>
                        </div>

                        <hr/>

                        <div className="">
                            <div className="">
                                <div className="sum-picker__container wp-container">

                                    <div className="wp-label">
                                        <p className="withdraw-subheader">{this.props.textConstants['cabinet.viberete.sumu']}</p>
                                    </div>

                                    <div className="wp-input">
                                        <div className="wp-sum-picker__wrap">
                                            <input
                                                type="text"
                                                onChange={this.acceptAmount}
                                                className="sum-picker__value"
                                                value={this.state.pickerVal}
                                                onKeyPress={this.isNumeric}
                                            />
                                        </div>
                                    </div>

                                    <div className="wp-icon">
                                        <img src="../assets/images/bitcoin-icon.png"/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-12">
                                <div className="withdrawSlider" id="withdrawSlider"/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-12">
                                <div className="" id="pips-steps"/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-12 col-md-4">
                                <button className="btn blue-big-btn"
                                        onClick={this.reinvestMoney}
                                        ref={(reinvest) => {
                                            this.reinvest = reinvest
                                        }}>
                                    {this.props.textConstants['cabinet.reinvestorovat']}
                                </button>
                            </div>
                            <div className="col-xs-12 col-md-4">
                                <button className="btn grey-big-btn"
                                        ref={(withdrawBtn) => {
                                            this.withdrawBtn = withdrawBtn
                                        }}
                                        onClick={this.withdrawMoney}
                                >
                                    {this.props.textConstants['cabinet.vivesti']}
                                </button>
                            </div>
                        </div>
                    </div>
                    : <div className="empty_bar"><p>{this.props.textConstants['cabinet.havent.money']}</p></div>}
                <div className={"whitebg " + (this.state.showLoader ? '' : 'hidden')}>
                    <div className={"fixed-loader " + (this.state.showLoader ? '' : 'hidden')}/>
                </div>
            </div>
        );
    }
}

export default Withdraw;
