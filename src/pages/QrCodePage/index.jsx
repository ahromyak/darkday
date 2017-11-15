import React from 'react';
import * as Helpers from '../../models'

import CabinetHeaderNoMenu from '../../components/cabinetComponents/CabinetHeaderNoMenu'
import {browserHistory} from 'react-router'

if (process.env.WEBPACK) {
    require('./styles.scss');
}

class QrCodePage extends React.Component {

    getServerTime() {
        if (!this.props.mainContent.serverTime.timeSpan || this.state.startPoint == null) {
            let promise = this.props.actions.getServerTime();
            promise.then(() => {
                // this.props.mainContent.serverTime.timeSpan * 1;
                let startPoint = Math.floor((this.state.waitTime * 1) - this.props.mainContent.serverTime.timeSpan * 1);
                this.setState({startPoint: startPoint});
                this.clockFunc(startPoint);
            })
        } else {
            this.state.startPoint = this.state.startPoint - 1;
            //redirect to cabinet if countdown ended
            if (this.state.startPoint <= 1) {
                browserHistory.push('/cabinet');
            } else {
                this.clockFunc(this.state.startPoint);
            }
        }
    }

    clockFunc(delta) {
        // get total seconds between the times
        let str = '';
        this.state.waitTime = this.state.waitTime * 1;

        // if(((this.state.waitTime*1)*1000 - Date.now()) > 0){
        if (delta > 0) {
            // calculate (and subtract) whole hours
            let hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;

            // calculate (and subtract) whole minutes
            let minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;

            // what's left is seconds
            let seconds = Math.floor(delta % 60);

            if (hours < 10) {
                hours = '0' + hours;
            }

            if (minutes < 10) {
                minutes = '0' + minutes;
            }

            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            str = str + ' ' + hours + ':' + minutes + ':' + seconds;


        } else {
            str = '00:00:00';
        }
        this.setState({countDown: str})
    }

    paySuccess() {
        browserHistory.push('/');
    }

    _copyToClipboard() {

        this.setState({linkCopied: true});

        setTimeout(() => {
            this.setState({linkCopied: false});
        }, 1500);

        window.getSelection().removeAllRanges();
        let to_copy = document.getElementById('hash_copy');

        if (document.createRange) {
            let r = document.createRange();
            r.setStartBefore(to_copy);
            r.setEndAfter(to_copy);
            r.selectNode(to_copy);
            let sel = window.getSelection();
            sel.addRange(r);
            document.execCommand('Copy');
        }

        Helpers.showNotify('success', this.props.textConstants['cabinet.copie.save'])
    }

    constructor(props) {
        super(props)
        this.state = {
            amount: 0,
            wallet: '',
            qrCodeImg: false,
            qrCodeUrl: '',
            qrCodeHash: '',
            QrCodeSum: '',
            countDown: '00:00:00',
            linkCopied: false,
            startPoint: null,
        }
        this.paySuccess = this.paySuccess.bind(this);
        this.clockFunc = this.clockFunc.bind(this);
        this.getServerTime = this.getServerTime.bind(this);
        this._copyToClipboard = this._copyToClipboard.bind(this);
    }

    componentWillMount() {

        if (this.props.mainContent.userQrCode) {

            this.setState({
                qrCodeUrl: this.props.mainContent.userQrCode.qrCode,
                qrCodeHash: JSON.parse(this.props.mainContent.userQrCode.hash),
                QrCodeSum: this.props.mainContent.userQrCode.sumVal,
                waitTime: this.props.mainContent.userQrCode.waitTime,
            }, () => {
                this.clockCounter = setInterval(() => {
                    this.getServerTime();
                }, 1000);
            })
        } else {
            if (process.env.WEBPACK) {
                if (localStorage.getItem('QrCode')) {

                    this.setState({
                        qrCodeUrl: JSON.parse(localStorage.getItem('QrCode')),
                        qrCodeHash: JSON.parse(localStorage.getItem('QrCodeHash')),
                        QrCodeSum: JSON.parse(localStorage.getItem('QrCodeSum')),
                        waitTime: JSON.parse(localStorage.getItem('waitTime')),
                    }, () => {
                        this.clockCounter = setInterval(() => {
                            this.getServerTime();
                        }, 1000);
                    })
                }
            }
        }
    }

    componentWillUnmount() {
        clearInterval(this.clockCounter);
    }

    render() {
        return (
            <div>
                <CabinetHeaderNoMenu
                    actions={this.props.actions}
                    mainContent={this.props.mainContent}
                    content={this.props.mainContent.content}
                    textConstants={this.props.textConstants}
                />

                <div className="container">
                    <p className="qr-title">{this.props.textConstants['cabinet.crate.deposit']}</p>
                    <hr/>
                    <div className="cm-description">
                        <p className="cm-sub-title qr-sub-title">{this.props.textConstants['cabinet.creat']}</p>
                    </div>
                    <div className="countDown">

                        <div className="countDownDiv">{this.props.textConstants['cabinet.deposit.countdown']}</div>
                        <span className="countDownSpan">
                            {this.state.countDown}
                        </span>
                    </div>
                    <div className="row qr__wrap">
                        <div className="col-xs-12 col-md-4 qr__pic">
                            <img className="" src={this.state.qrCodeUrl}/>
                        </div>
                        <div className="col-xs-12 col-md-7 qr-btn-group">
                            <div className="sum-picker__container qr-container">

                                <div className="qr-label">
                                    <p className="withdraw-subheader">{this.props.textConstants['cabinet.sum']}</p>
                                </div>

                                <div className="qr-input">
                                    <div className="qr-sum-picker__wrap">
                                        <div className="qr-sum-picker__value qr-number text-center">
                                            {this.state.QrCodeSum}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="sum-picker__container qr-container">

                                <div className="qr-label">
                                    <p className="withdraw-subheader">{this.props.textConstants['cabinet.create.deposit.adress']}</p>
                                </div>

                                <div className="qr-input">
                                    <div className="qr-sum-picker__wrap">
                                        <div
                                            className={"qr-sum-picker__value qr-letters qr-copy-wrap text-left i-container " + (this.state.linkCopied ? 'success' : '')}>
                                            <span id="hash_copy">
                                                {typeof this.state.qrCodeHash != 'object' ? this.state.qrCodeHash : ''}
                                                </span>
                                            <div className="button-container i-greyCopy text-center "
                                                 onClick={this._copyToClipboard}>
                                                <i className="fa fa-files-o i-default"/>
                                                <i className="fa fa-check i-active"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default QrCodePage;