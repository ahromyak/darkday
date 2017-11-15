import React from 'react';
import DepositHeader from '../../components/DepositHeader'
import Cookies from 'universal-cookie'
import {browserHistory} from 'react-router'
import * as Helpers from '../../models'
import {Helmet} from "react-helmet";
import InvestTabsCol from '../../components/InvestTabsCol'

class PickedDeposit extends React.Component {

    _validateEmail(email) {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    setEmail(e) {
        if (this._validateEmail(e.target.value)) {
            this.setState({
                step1: true,
                email: e.target.value,
                emptyEmail:false
            })
        } else {
            this.setState({
                step1: false,
                email: null,
                emptyEmail:true
            })
        }
    }

    depositCreateResponceHandler(){
        if (this.props.mainContent.createDepositResponce.result == true) {
            const cookies = new Cookies();
            if (this.props.mainContent.createDepositResponce.result && this.props.mainContent.createDepositResponce.token != null) {
                cookies.remove('APIToken', { path: '/' });
                cookies.remove('userLogin', { path: '/' });
                cookies.remove('signalRId', { path: '/' });
                cookies.set('APIToken', this.props.mainContent.createDepositResponce.token.token, {path: '/',maxAge : this.props.mainContent.createDepositResponce.token.expirationTimeSpan});
                cookies.set('userLogin', this.props.mainContent.createDepositResponce.token.login, {path: '/'});
                cookies.set('signalRId', this.props.mainContent.createDepositResponce.token.signalRId, {path: '/'});
                this.props.actions.authSetToken(this.props.mainContent.createDepositResponce.token.token);
                this.props.actions.authSetSession(cookies.get('ELSessionId'));
                this.props.actions.setQrCode(this.props.mainContent.createDepositResponce.hash, this.props.mainContent.createDepositResponce.qrCode, this.state.pickerVal, this.props.mainContent.createDepositResponce.waitTime);
                localStorage.setItem('QrCodeHash', JSON.stringify(this.props.mainContent.createDepositResponce.hash));
                localStorage.setItem('QrCode', JSON.stringify(this.props.mainContent.createDepositResponce.qrCode));
                localStorage.setItem('waitTime', JSON.stringify(this.props.mainContent.createDepositResponce.waitTime));
                localStorage.setItem('QrCodeSum', JSON.stringify(this.state.pickerVal));


                localStorage.setItem('expirationTimeSpan', this.props.mainContent.createDepositResponce.token.expirationTimeSpan);
                localStorage.setItem('refreshToken', this.props.mainContent.createDepositResponce.token.refreshToken);
                localStorage.setItem('ExtendedTokenLife', this.props.mainContent.createDepositResponce.token.extendedTokenLife);
                localStorage.setItem('currentTimeStamp', Math.floor(Date.now() / 1000));

                browserHistory.push('/qrcodevalidation');

            } else {

                localStorage.setItem('QrCodeHash', JSON.stringify(this.props.mainContent.createDepositResponce.hash));
                localStorage.setItem('QrCode', JSON.stringify(this.props.mainContent.createDepositResponce.qrCode));
                localStorage.setItem('waitTime', JSON.stringify(this.props.mainContent.createDepositResponce.waitTime));
                localStorage.setItem('QrCodeSum', JSON.stringify(this.state.pickerVal));
                this.props.actions.setQrCode(this.props.mainContent.createDepositResponce.hash, this.props.mainContent.createDepositResponce.qrCode, this.state.pickerVal, this.props.mainContent.createDepositResponce.waitTime);

                browserHistory.push('/qrcodevalidation');
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

        let promise;

        this.setState({
            showLoader:true
        });

        this.submit.setAttribute("disabled", "disabled");

        promise = this.props.actions.createDeposit(this.state.email, this.state.pickerVal, this.props.content.dynamicData.plans[this.state.indexPlan].id, 3, 1, window.location.origin);

        promise.then(() => {
            this.setState({
                showLoader:false
            });
            this.depositCreateResponceHandler();
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            pickerVal: this.props.mainContent.pickedDepositPlanIndex ? this.props.mainContent.pickedDepositPlanIndex.depositPlanSum.from : 0,
            pillKeyIndex: this.props.mainContent.pickedDepositPlanIndex ? this.props.mainContent.pickedDepositPlanIndex.depositPlanSum.index : 0,
            indexPlan: this.props.mainContent.pickedDepositPlanIndex ? this.props.mainContent.pickedDepositPlanIndex.depositPlanIndex : -1,
            index: this.props.mainContent.pickedDepositPlanIndex ? this.props.mainContent.pickedDepositPlanIndex.depositPlanIndex : 0, //For right table purpose only
            currencyIndex: 1, //From wallet not balance
            userIsLoggedIn: false,
            email: null,
            depositPlanLabels: {'blue':'deposit-blue', 'pink':'deposit-purple', 'orange':'deposit-orange'},
            showLoader: false,
            showSubmitButton:true,
            emptyEmail:false,
        }
        this.setEmail = this.setEmail.bind(this)
        this.createDeposit = this.createDeposit.bind(this)
        this.depositCreateResponceHandler = this.depositCreateResponceHandler.bind(this)
    }

    componentWillMount() {

        //fix this in future
        let loggedIn;
        if (process.env.WEBPACK) {
            const cookies = new Cookies();
            if (typeof cookies.get('APIToken') != 'undefined') {
                loggedIn = true;
            } else {
                loggedIn = false;
            }
        } else {
            loggedIn = false;
        }

        this.setState({
            userIsLoggedIn: loggedIn,
        })
    }

    componentDidMount() {

        if(this.state.indexPlan == -1){
            browserHistory.push('/deposit')
        }

        if (this.props.mainContent.pickedDepositPlanIndex) {
            this.setState({
                indexPlan: this.props.mainContent.pickedDepositPlanIndex.depositPlanIndex,
                index: this.props.mainContent.pickedDepositPlanIndex.depositPlanIndex,
            })
        }
    }

    componentWillReceiveProps(nextProp) {

        if (this.props.mainContent.userData === null || typeof this.props.mainContent.userData === 'undefined') {
            if (this.props.mainContent.userData !== nextProp.mainContent.userData) {
                if (typeof nextProp.mainContent.userData.token !== 'undefined') {
                    Helpers.showNotify('info', this.props.textConstants['cabinet.SuccAutorize']);
                    this.setState({
                        userIsLoggedIn: true,
                    });
                    this.submit.removeAttribute("disabled");
                }
            }
        }
    }

    render() {

        let isDisabled = true;
        if(this.state.userIsLoggedIn){
            isDisabled = false
        }else{
            isDisabled = !this._validateEmail(this.state.email);
        }

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
                    <title>{this.props.mainContent.content.earnPage.metaTitle}</title>
                    <meta name="description" content={this.props.mainContent.content.earnPage.metaDescription}/>
                    <meta name="keywords" content={this.props.mainContent.content.earnPage.metaKeywords}/>
                    <meta property="og:url" content={fullUrl}/>
                    <meta property="og:type" content="article"/>
                    <meta property="og:title" content={this.props.mainContent.content.earnPage.metaTitle}/>
                    <meta property="og:description" content={this.props.mainContent.content.earnPage.metaDescription}/>
                    <meta property="og:image" content={this.props.mainContent.content.earnPage.metaPicture}/>
                </Helmet>

                <DepositHeader mainContent={this.props.mainContent} actions={this.props.actions}
                               textConstants={this.props.textConstants}/>

                {this.state.indexPlan != -1 ?
                    <div className="cabinet-content">
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
                                                <div className="deposit-step">1</div>
                                                <div
                                                    className="deposit-title">{this.props.textConstants['deposit.enter.email.phone']}
                                                </div>
                                                <div>&nbsp;</div>
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

                                    <div className={"sum-picker__button " + (this.state.showSubmitButton ? '' : 'hidden')}>
                                        <button ref={(submit) => {
                                            this.submit = submit
                                        }} className={"forDisable " + (isDisabled ? 'sepia_disabled' : '' )}
                                                disabled={isDisabled} onClick={this.createDeposit}>
                                            {this.props.textConstants['deposit.create.deposit']}
                                        </button>
                                    </div>
                                </div>

                                <div className="deposit-right-block">
                                    <div className="cabinet-invest-tabs cabinet-invest-tabs-row">
                                        {this.props.content.dynamicData.plans && this.props.content.dynamicData.plans.map((plan, key) => {
                                            return <InvestTabsCol key={key}
                                                                  visible={this.state.index == key}
                                                                  plan={plan}
                                                                  depositPlanLabels={this.state.depositPlanLabels}
                                                                  depositlabel={this.state.depositPlanLabels[this.state.indexPlan]}
                                                                  textConstants={this.props.textConstants}/>
                                        })}
                                        <div className="invest-tab" id="delta">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    ''}

                <div className={"whitebg " + (this.state.showLoader ? '' : 'hidden')}><div className={"fixed-loader " + (this.state.showLoader ? '' : 'hidden')}/></div>
            </div>
        );
    }
}

export default PickedDeposit;
