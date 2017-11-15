import React from 'react';
import DepositHeader from '../../components/DepositHeader'
import DepositsList from '../../components/DepositsList'
import DepositPills from '../../components/DepositPills'
import DepositCurrencyWallet from '../../components/DepositCurrencyWallet'
import DepositCurrencyBalance from '../../components/DepositCurrencyBalance'
import AllCurrencyTypesPaymentSources from '../../components/AllCurrencyTypesPaymentSources'
import Cookies from 'universal-cookie'
import {browserHistory} from 'react-router'
import * as Helpers from '../../models'
import {Helmet} from "react-helmet";

import InvestTabsCol from '../../components/InvestTabsCol'

if (process.env.WEBPACK) {
    require('./styles.scss');
}

class Deposit extends React.Component {

    countHandler(event) {
        if (event == 'd') {
            if (this.state.pillKeyIndex > 0) {
                this.setState(
                    {
                        pillKeyIndex: (this.state.pillKeyIndex - 1),
                        pickerVal: this.props.content.dynamicData.plans[this.state.index].matrix[this.state.pillKeyIndex - 1].from,
                    })
            }
        } else {
            if (this.state.pillKeyIndex < (this.props.content.dynamicData.plans[this.state.index].matrix.length - 1)) {
                this.setState(
                    {
                        pillKeyIndex: (this.state.pillKeyIndex + 1),
                        pickerVal: this.props.content.dynamicData.plans[this.state.index].matrix[this.state.pillKeyIndex + 1].from,
                    })
            }
        }
    }

    pickPill(index) {
        this.setState(
            {
                pillKeyIndex: index,
                pickerVal: this.props.content.dynamicData.plans[this.state.index].matrix[index].from,
            })
    }

    inputValHandler(e) {
        this.isNumeric(e.target.value) ? this.setState({pickerVal: e.target.value}) : e.preventDefault();
    }

    isNumeric(val) {
        return typeof(val) === 'number' && !isNaN(val);
    }

    pickDepositCurrency(paymentSource, currencyId) {

        !this.state.depositCurrencyPicked && this.setState({
            step3: true,
            depositCurrencyPicked: true,
            currencyId: currencyId + 1,
            currencyTypePicked: paymentSource,
            currencyIndex: paymentSource == 'wallet' ? 1 : 0
        })
    }

    pickDepositPlan(index, depositlabel) {

        !this.state.depositPlanPicked && this.setState({
            indexPlan: index,
            index: index,
            depositPlanPicked: true,
            planPicked: true,
            depositlabel: depositlabel,
            pickerVal:this.props.content.dynamicData.plans[index].matrix[0].from,
            pillKeyIndex:0,
            step2: true
        }, () => {
            let planMatrix = JSON.parse(JSON.stringify(this.props.content.dynamicData.plans[this.state.indexPlan].matrix));
            let minValueInPlane = Math.min.apply(Math, planMatrix.map(function (o) {
                return o.from;
            }));
            this.setState({
                minValueInPlane: minValueInPlane
            });
        })
    }

    _validateEmail(email) {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    _hasVipProp(obj) {
        return obj.cssClass == 'vip';
    }

    setEmail(e) {
        if (this._validateEmail(e.target.value)) {
            this.setState({
                step1: true,
                email: e.target.value,
                emptyEmail: false
            })
        } else {
            this.setState({
                email: null,
                emptyEmail: true
            })
        }
    }

    depositCreateResponceHandler() {
        if (this.props.mainContent.createDepositResponce.result == true) {
            const cookies = new Cookies();
            if (this.props.mainContent.createDepositResponce.result && this.props.mainContent.createDepositResponce.token != null) {
                cookies.remove('APIToken', {path: '/'});
                cookies.remove('userLogin', {path: '/'});
                cookies.remove('signalRId', {path: '/'});
                cookies.set('APIToken', this.props.mainContent.createDepositResponce.token.token, {
                    path: '/',
                    maxAge: this.props.mainContent.createDepositResponce.token.expirationTimeSpan
                });
                cookies.set('userLogin', this.props.mainContent.createDepositResponce.token.login, {path: '/'});
                cookies.set('signalRId', this.props.mainContent.createDepositResponce.token.signalRId, {path: '/'});

                this.props.actions.authSetToken(this.props.mainContent.createDepositResponce.token.token);
                this.props.actions.authSetSession(cookies.get('ELSessionId'));
                this.props.actions.setQrCode(this.props.mainContent.createDepositResponce.hash, this.props.mainContent.createDepositResponce.qrCode, this.state.pickerVal, this.props.mainContent.createDepositResponce.waitTime);

                localStorage.setItem('QrCodeHash', this.props.mainContent.createDepositResponce.hash);
                localStorage.setItem('QrCode', JSON.stringify(this.props.mainContent.createDepositResponce.qrCode));
                localStorage.setItem('waitTime', JSON.stringify(this.props.mainContent.createDepositResponce.waitTime));
                localStorage.setItem('QrCodeSum', JSON.stringify(this.state.pickerVal));
                localStorage.setItem('expirationTimeSpan', this.props.mainContent.createDepositResponce.token.expirationTimeSpan);
                localStorage.setItem('refreshToken', this.props.mainContent.createDepositResponce.token.refreshToken);
                localStorage.setItem('ExtendedTokenLife', this.props.mainContent.createDepositResponce.token.extendedTokenLife);
                localStorage.setItem('currentTimeStamp', Math.floor(Date.now() / 1000));

                if (this.state.currencyIndex == 1) {
                    browserHistory.push('/qrcodevalidation');
                } else {
                    browserHistory.push('/cabinet');
                }

            } else {

                localStorage.setItem('QrCodeHash', this.props.mainContent.createDepositResponce.hash);
                localStorage.setItem('QrCode', JSON.stringify(this.props.mainContent.createDepositResponce.qrCode));
                localStorage.setItem('waitTime', JSON.stringify(this.props.mainContent.createDepositResponce.waitTime));
                localStorage.setItem('QrCodeSum', JSON.stringify(this.state.pickerVal));
                this.props.actions.setQrCode(this.props.mainContent.createDepositResponce.hash, this.props.mainContent.createDepositResponce.qrCode, this.state.pickerVal, this.props.mainContent.createDepositResponce.waitTime);

                if (this.state.currencyIndex == 1) {
                    browserHistory.push('/qrcodevalidation');
                } else {
                    browserHistory.push('/cabinet');
                }
            }

        } else {
            if (typeof this.props.mainContent.createDepositResponce != 'undefined' && this.props.mainContent.createDepositResponce.result == false) {

                Helpers.showNotify('danger', this.props.textConstants[this.props.mainContent.createDepositResponce.message]);
            } else {
                Helpers.showNotify('danger', this.props.textConstants['cabinet.oops.something.went.wrong']);
            }
        }
    }

    createDeposit() {

        this.setState({
            showLoader: true
        });

        let allowCreateDeposit = true;

        if (this.props.mainContent.userBalance && this.props.mainContent.userBalance.length) {
            let sum = 0;
            this.props.mainContent.userBalance.map((el) => {
                sum = sum + el.value;
                return el
            });

            //If user choose balance and there is no money!
            if (this.state.pickerVal > sum && this.state.currencyIndex === 0) {
                allowCreateDeposit = false
                Helpers.showNotify('danger', this.props.textConstants['notify.insuficent.funds'] + ' ' + this.state.pickerVal);
            }
        }

        this.submit.setAttribute("disabled", "disabled");

        setTimeout(() => {
            if (!!this.submit) {
                this.submit.removeAttribute('disabled');
            }
        }, 4000);

        if (allowCreateDeposit) {
            let promise;
            promise = this.props.actions.createDeposit(this.state.email, this.state.pickerVal, this.props.content.dynamicData.plans[this.state.indexPlan].id, 3, this.state.currencyIndex, window.location.origin);
            promise.then(() => {
                if (!!this.depositPage) {
                    this.setState({
                        showLoader: false
                    }, () => {
                        this.depositCreateResponceHandler();
                    })
                }
            })

        } else {
            if (!!this.depositPage) {
                this.setState({
                    showLoader: false
                })
            }
        }
    }

    restoreStep(step) {
        switch (step) {
            case "step1":
                this.setState({
                    indexPlan: -1,
                    index: 0,
                    depositPlanPicked: false,
                    depositlabel: 'deposit-blue',
                    depositCurrencyPicked: false,
                    planPicked: false,
                    currencyTypePicked: 'none',
                    currencyIndex: -1
                })
                break;
            case "step2":
                this.setState({
                    step2: true,
                    depositCurrencyPicked: false,
                    currencyTypePicked: 'none',
                    currencyIndex: -1,
                })
                break;
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            pickerVal: 0,
            pillKeyIndex: 0, //Default values
            indexPlan: -1, //Default values
            index: 0, //Default values
            step1: false,
            step2: false,
            step3: false,
            userIsLoggedIn: false,
            stepCounts: {},
            currencyTypePicked: 'none',
            currencyIndex: -1,
            depositCurrencyPicked: false,
            depositPlanPicked: false,
            email: null,
            errorInForm: false,
            errorMessage: '',
            popUpVisible: false,
            showLoader: false,
            emptyEmail: false,
            depositlabel: 'deposit-blue',
            minValueInPlane: 0,
            planPicked: true,
            currency: [],
            currencyId: 3,
            plansAreEmpty: false,
            depositPlanLabels: {'blue': 'deposit-blue', 'pink': 'deposit-purple', 'orange': 'deposit-orange'},
        };
        this.inputValHandler = this.inputValHandler.bind(this)
        this.countHandler = this.countHandler.bind(this)
        this.isNumeric = this.isNumeric.bind(this)
        this.pickDepositCurrency = this.pickDepositCurrency.bind(this)
        this.pickDepositPlan = this.pickDepositPlan.bind(this)
        this.setEmail = this.setEmail.bind(this)
        this.createDeposit = this.createDeposit.bind(this)
        this.pickPill = this.pickPill.bind(this)
        this.restoreStep = this.restoreStep.bind(this)
        this.depositCreateResponceHandler = this.depositCreateResponceHandler.bind(this)
        this._validateEmail = this._validateEmail.bind(this)
    }

    componentWillMount() {

        //fix this in future
        let loggedIn = false;
        let cookies;

        if(process.env.WEBPACK){
            cookies = new Cookies();
            if (typeof cookies.get('APIToken') != 'undefined') {
                loggedIn = true;
            }
        }

        if (this.props.content.dynamicData.plans.length) {
            this.setState({
                pickerVal: this.props.content.dynamicData.plans[this.state.index].matrix[0].from,
                userIsLoggedIn: loggedIn,
                stepCounts: loggedIn ?
                    {
                        'email': 0,
                        'plan': 1,
                        'currency': 2,
                        'amount': 3
                    } :
                    {
                        'email': 1,
                        'plan': 2,
                        'currency': 3,
                        'amount': 4
                    },
                step1: loggedIn,
            })
        } else {
            this.setState({plansAreEmpty: true});
            Helpers.showNotify('info', this.props.textConstants['System.CantCreateNewDepositNow']);
        }

        let depIndPlan = this.props.mainContent.pickedDepositPlanIndex;

        if(typeof depIndPlan !== 'undefined' && depIndPlan !== null){
            let label = this.props.mainContent.content.dynamicData.plans[depIndPlan.depositPlanIndex].color;
            this.setState({step1:true});
            let setPlan = new Promise((reslove)=>{
                reslove(this.pickDepositPlan(depIndPlan.depositPlanIndex,this.state.depositPlanLabels[label]))
            });
            setPlan.then(()=>{
                this.pickDepositCurrency('wallet',3);
                this.pickPill(depIndPlan.depositPlanSum.index);
            });
            // this.pickDepositPlan(depIndPlan.depositPlanIndex,this.state.depositPlanLabels[label]);

        }
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProp){

        let userData = this.props.mainContent.userData
        if (userData === null || typeof userData === 'undefined' || userData.result === false) {
            if (this.props.mainContent.userData !== nextProp.mainContent.userData) {
                if (typeof nextProp.mainContent.userData.token !== 'undefined') {

                    Helpers.showNotify('info', this.props.textConstants['cabinet.SuccAutorize']);

                    this.setState({
                        userIsLoggedIn: true,
                        stepCounts:{
                            'email': 0,
                            'plan': 1,
                            'currency': 2,
                            'amount': 3
                        },
                        step1: true,
                    })
                }
            }
        }
    }

    render() {

        let fullUrl = '/';

        if (process.env.WEBPACK) {
            fullUrl = window.location.href;
        } else {
            fullUrl = process.env.webSiteUrl
        }

        let isDisabledByLoginStatus = true;
        if (this.state.userIsLoggedIn) {
            isDisabledByLoginStatus = false;
        } else {
            isDisabledByLoginStatus = !this._validateEmail(this.state.email);
        }

        let isDisabled = this.state.currencyIndex == -1 || isDisabledByLoginStatus || this.state.indexPlan == -1;

        return (
            <div ref={(depositPage) => {
                this.depositPage = depositPage
            }}>

                <Helmet>
                    <meta charSet="utf-8"/>
                    <title>{this.props.mainContent.content.earnPage.metaTitle}</title>
                    <meta name="description" content={this.props.mainContent.content.earnPage.metaDescription}/>
                    <meta name="keywords" content={this.props.mainContent.content.earnPage.metaKeywords}/>
                    <meta property="og:url" content={fullUrl}/>
                    <meta property="og:type" content="article"/>
                    <meta property="og:title" content={this.props.mainContent.content.earnPage.metaTitle}/>
                    <meta property="og:description" content={this.props.mainContent.content.earnPage.metaDescription}/>
                    <meta property="og:image" content={this.props.mainContent.content.earnPage.metaPicture}/>
                </Helmet>

                <DepositHeader mainContent={this.props.mainContent}
                               actions={this.props.actions}
                               textConstants={this.props.textConstants}/>

                <div className={"cabinet-content " + (this.state.plansAreEmpty ? 'hidden' : '')}>
                    <div className="container">
                        <div className="">
                            <div>
                                <h2 className="text-left">{this.props.textConstants['deposit.title']}</h2>
                            </div>
                        </div>

                        <div className="deposit__flex-container">

                            <div className="deposit-left-block">
                                {!this.state.userIsLoggedIn && (
                                    <div className={"depositBlock "}>
                                        <div className="disabled__block"/>
                                        <div className="deposit-head">
                                            <div className="deposit-step">{this.state.stepCounts['email']}</div>
                                            <div className="deposit-title">
                                                {this.props.textConstants['deposit.enter.email.phone']}
                                            </div>
                                            <div></div>
                                        </div>
                                        <div className="depositBlock-left">
                                            <div className="">
                                                <input
                                                    type="text"
                                                    name="email"
                                                    autoComplete="on"
                                                    onChange={this.setEmail}
                                                    className="deposit__phone"
                                                />
                                                <p className={"form-warning " + (this.state.emptyEmail ? '' : 'hidden')}>{this.props.textConstants['cabinet.unempty.email']}</p>
                                            </div>
                                            <p className="deposit__explain">{this.props.textConstants['deposit.have.sign.in']},&nbsp;
                                                <a className="cursor" onClick={() => {
                                                    this.props.openSideBar('signIn');
                                                }}>{this.props.textConstants['deposit.authorize']}</a>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className={"depositBlock  " + (!this.state.step1 ? 'disabled' : '')}>
                                    <div className="disabled__block"/>
                                    <div className="deposit-head">
                                        <div className="deposit-step">{this.state.stepCounts['plan']}</div>
                                        <div className="deposit-title">
                                            {this.props.textConstants['deposit.step.a']}
                                        </div>
                                        <button onClick={() => {
                                            this.restoreStep('step1')
                                        }}
                                                className="deposit-back">{this.props.textConstants['common.button.label.back']}
                                        </button>
                                    </div>

                                    <div className="depositBlock-left depositBlock__plans-list">

                                        {this.props.content.dynamicData.plans && this.props.content.dynamicData.plans.length ? this.props.content.dynamicData.plans.map((el, key) => {
                                            return <DepositsList keyL={key} key={key}
                                                                 mainContent={this.props.mainContent}
                                                                 textConstants={this.props.textConstants}
                                                                 pickDepositPlan={this.pickDepositPlan}
                                                                 indexState={this.state.indexPlan}
                                                                 el={el}
                                                                 picked={this.state.indexPlan == key}
                                                                 label={this.state.depositPlanLabels[el.color]}/>
                                        }) : () => {
                                        }}
                                    </div>
                                </div>

                                <div className={"depositBlock  " + (!this.state.step2 ? 'disabled' : '')}>
                                    <div className="disabled__block"/>
                                    <div className="deposit-head">
                                        <div className="deposit-step">{this.state.stepCounts['currency']}</div>
                                        <div className="deposit-title">
                                            {this.props.textConstants['deposit.pick.currency']}
                                        </div>
                                        <button onClick={() => {
                                            this.restoreStep('step2')
                                        }}
                                                className="deposit-back">{this.props.textConstants['common.button.label.back']}
                                        </button>
                                    </div>

                                    {this.props.mainContent.content.currency.map((el, key) => {
                                        return <AllCurrencyTypesPaymentSources
                                            key={key}
                                            el={el}
                                            actions={this.props.actions}
                                            mainContent={this.props.mainContent}
                                            currencyTypePicked={this.state.currencyTypePicked}
                                            textConstants={this.props.textConstants}
                                            minValueInPlane={this.state.minValueInPlane}
                                            // paymentSourcePicked={this.state.paymentSourcePicked}
                                            userIsLoggedIn={this.state.userIsLoggedIn}
                                            pickDepositCurrency={this.pickDepositCurrency}
                                        />
                                    })}
                                </div>

                                <div className={"depositBlock  " + (!this.state.step3 ? 'disabled' : '')}>
                                    <div className="disabled__block"/>
                                    <div className="deposit-head">
                                        <div className="deposit-step">{this.state.stepCounts['amount']}</div>
                                        <div className="deposit-title">
                                            {this.props.textConstants['deposit.pick.deposit.amount']}
                                        </div>
                                        <div></div>
                                    </div>
                                    <div className="depositBlock-left depositBlock__pills-list">
                                        <div className="sum-picker__container">
                                            <div className="sum-picker__wrap">
                                                <div className="sum-picker__minus"
                                                     onClick={() => {
                                                         this.countHandler('d')
                                                     }}/>
                                                <div
                                                    type="text"
                                                    className="sum-picker__value"
                                                >{this.state.pickerVal}</div>
                                                <div className="sum-picker__plus"
                                                     onClick={() => {
                                                         this.countHandler('i')
                                                     }}/>
                                            </div>
                                        </div>

                                        <div className="">
                                            <div className="sum-picker__pills-container">
                                                {this.props.content.dynamicData.plans.length
                                                &&
                                                this.props.content.dynamicData.plans[this.state.index].matrix
                                                &&
                                                this.props.content.dynamicData.plans[this.state.index].matrix.map((el, key) => {
                                                    if (el.cssClass != 'vip') {
                                                        return (
                                                            <DepositPills pickPill={this.pickPill}
                                                                          keyIndex={this.state.pillKeyIndex}
                                                                          keyL={key}
                                                                          pill={el} key={key} label={el.from}/>
                                                        )
                                                    }
                                                })}
                                            </div>

                                            {this.props.content.dynamicData.plans.length && this.props.content.dynamicData.plans[this.state.index].matrix.some(this._hasVipProp)
                                            &&
                                            <div className="sum-picker__pills-container-bordered">
                                                <span className="sum-picker__label">
                                                {this.props.textConstants['deposit.vip']}
                                                </span>
                                                {this.props.content.dynamicData.plans.length
                                                &&
                                                this.props.content.dynamicData.plans[this.state.index].matrix
                                                &&
                                                this.props.content.dynamicData.plans[this.state.index].matrix.map((el, key) => {
                                                    if (el.cssClass == 'vip') {
                                                        return (
                                                            <DepositPills pickPill={this.pickPill}
                                                                          keyIndex={this.state.pillKeyIndex}
                                                                          keyL={key}
                                                                          pill={el}
                                                                          key={key}
                                                                          label={el.from}/>
                                                        )
                                                    }
                                                })}
                                            </div>
                                            }
                                        </div>

                                        <div className="sum-picker__button">
                                            <button ref={(submit) => {
                                                this.submit = submit
                                            }} className={"forDisable " + (isDisabled ? 'sepia_disabled' : '' )}
                                                    disabled={isDisabled} onClick={this.createDeposit}>
                                                {this.props.textConstants['deposit.create.deposit']}
                                            </button>
                                            <div>{this.state.errorInForm &&
                                            <p className="red">{this.state.errorMessage}</p>}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="deposit-right-block">
                                <div className="cabinet-invest-tabs cabinet-invest-tabs-row">
                                    {this.props.content.dynamicData.plans && this.props.content.dynamicData.plans.map((plan, key) => {
                                        return <InvestTabsCol key={key}
                                                              visible={this.state.index == key}
                                                              plan={plan}
                                                              depositlabel={this.state.depositlabel}
                                                              depositPlanLabels={this.state.depositPlanLabels}
                                                              textConstants={this.props.textConstants}/>
                                    })}
                                    <div className="invest-tab" id="delta">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"whitebg " + (this.state.showLoader ? '' : 'hidden')}>
                    <div className={"fixed-loader " + (this.state.showLoader ? '' : 'hidden')}/>
                </div>
            </div>
        );
    }
}

export default Deposit;
