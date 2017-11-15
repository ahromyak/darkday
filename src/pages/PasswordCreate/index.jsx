import React from 'react';
import Cookies from 'universal-cookie';
import {browserHistory} from 'react-router'
import {Helmet} from "react-helmet";

import CabinetHeaderNoMenu from '../../components/cabinetComponents/CabinetHeaderNoMenu'
import * as Helpers from '../../models'
// import Footer from '../../components/Footer'

if (process.env.WEBPACK) {
    require('./styles.scss');
}

class PasswordCreate extends React.Component {

    _validatePass(pass) {
        let re = /^(?=.*[a-z])(^.{5,}$)/;
        return re.test(pass);
    }

    checkLang(val) {
        let lang = this.props.textConstants['index.language.eng'];
        if (!/^[a-zA-Z]*$/g.test(val)) {
            lang = this.props.textConstants['index.language.Noteng']
        }
        return lang
    }

    setPassword(evt) {
        let validate = this._validatePass(evt.target.value);

        this.setState(
            {
                password: evt.target.value,
                passError: !validate,
                passwordMatch: this.state.repeatPassword === evt.target.value,
                langUp: this.checkLang(evt.target.value),
                toggleShowLangUp: evt.target.value.length > 0,
            }
        )
    }

    setRepeatPassword(evt) {
        this.setState(
            {
                repeatPassword: evt.target.value,
                passwordMatch: this.state.password === evt.target.value,
                notEmpty: evt.target.value.length,
                langDown: this.checkLang(evt.target.value),
                toggleShowLangDown: evt.target.value.length > 0,
            }
        )
    }

    generatePassword() {
        const cookies = new Cookies();
        let promise = this.props.actions.setNewPassword(this.state.password, this.state.repeatPassword, this.props.location.query.code, this.props.location.query.userid, window.location.origin, cookies.get('APIToken'))
        promise.then(() => {
            if (this.props.mainContent.passwordChanged) {
                if (this.props.mainContent.passwordChanged.status == 400) {
                    Helpers.showNotify('danger', this.props.mainContent.passwordChanged.message);
                } else if (this.props.mainContent.passwordChanged && this.props.mainContent.passwordChanged.token && this.props.mainContent.passwordChanged.token.token) {
                    cookies.remove('APIToken', {path: '/'});
                    cookies.remove('signalRId', {path: '/'});
                    cookies.set('APIToken', this.props.mainContent.passwordChanged.token.token, {
                        path: '/',
                        maxAge: this.props.mainContent.passwordChanged.token.expirationTimeSpan
                    });
                    cookies.set('signalRId', this.props.mainContent.passwordChanged.token.signalRId, {path: '/'});

                    this.props.actions.authSetToken(this.props.mainContent.passwordChanged.token.token);

                    localStorage.setItem('expirationTimeSpan', this.props.mainContent.passwordChanged.token.expirationTimeSpan);
                    localStorage.setItem('refreshToken', this.props.mainContent.passwordChanged.token.refreshToken);
                    localStorage.setItem('ExtendedTokenLife', this.props.mainContent.passwordChanged.token.extendedTokenLife);
                    localStorage.setItem('currentTimeStamp', Math.floor(Date.now() / 1000));

                    if (this.props.mainContent.passwordChanged.resetPassword != true) {
                        browserHistory.push('/codemap');
                    } else {
                        browserHistory.push('/cabinet');
                    }
                } else {
                    Helpers.showNotify('danger', this.props.mainContent.passwordChanged.message);
                }
            } else {
                Helpers.showNotify('danger', this.props.textConstants['cabinet.oops.something.went.wrong']);
            }
        })
    }

    togglePassAttr() {
        this.setState({
            passType: this.state.passType == 'text' ? 'password' : 'text',
            togglePass: !this.state.togglePass
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            password: '',
            repeatPassword: '',
            passwordMatch: false,
            toggleShowLangUp: false,
            toggleShowLangDown: false,
            langUp: '',
            langDown: '',
            passError: true,
            validAccess: false,
            notEmpty: false,
            errorHandler: true,
            passType: 'password',
            togglePass: false
        }
        this.setPassword = this.setPassword.bind(this)
        this.setRepeatPassword = this.setRepeatPassword.bind(this)
        this.generatePassword = this.generatePassword.bind(this)
        this.togglePassAttr = this.togglePassAttr.bind(this)
    }

    componentWillMount() {
        if (this.props.location.query.code) {
            let forgotPass = !!this.props.location.query.forgot;

            this.setState(
                {
                    validAccess: true,
                    forgotPass: forgotPass
                }
            )
        }
    }

    render() {
        const {password, repeatPassword, passwordMatch} = this.state;
        let isDisabled = this._validatePass(password) && passwordMatch && (repeatPassword.length > 1);

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
                    <title>{this.props.mainContent.content.createPasswordPage.metaTitle}</title>
                    <meta name="description"
                          content={this.props.mainContent.content.createPasswordPage.metaDescription}/>
                    <meta name="keywords" content={this.props.mainContent.content.createPasswordPage.metaKeywords}/>
                    <meta property="og:url" content={fullUrl}/>
                    <meta property="og:type" content="article"/>
                    <meta property="og:title" content={this.props.mainContent.content.createPasswordPage.metaTitle}/>
                    <meta property="og:description"
                          content={this.props.mainContent.content.createPasswordPage.metaDescription}/>
                    <meta property="og:image" content={this.props.mainContent.content.createPasswordPage.metaPicture}/>
                </Helmet>

                <CabinetHeaderNoMenu
                    actions={this.props.actions}
                    mainContent={this.props.mainContent}
                    content={this.props.content}
                    textConstants={this.props.textConstants}
                    openSideBar={this.props.openSideBar}
                    cabinetPageData={this.props.mainContent.cabinetPageData}
                />

                {this.state.validAccess ?
                    <div className="container">
                        <div className="row">
                            <p className="cm-title">
                                {!this.state.forgotPass ?
                                    this.props.textConstants['cabinet.creating.account.pass']
                                    :
                                    this.props.textConstants['cabinet.AccountPasswordRecovery']}
                                {/*{this.props.textConstants['cabinet.creating.account.pass']}*/}
                            </p>

                            {!this.state.forgotPass ?
                                <p>{this.props.textConstants['cabinet.creating.acount.pass.text']}</p>
                                :
                                ''}
                        </div>
                        <hr/>
                        <div className="row">

                            <p>{this.props.textConstants['index.page.users.terms']}</p>
                            <div className="col-xs-12 ">
                                <div className={"gp-password-inp " + (this.state.passError ? 'error' : 'success')}>
                                    <div className="">
                                        <div className="">
                                            <label>{this.props.textConstants['cabinet.create.password']}</label>
                                            <div className="inputPass__wrap">
                                                <div className="inputPass__container">
                                                    <input type={this.state.passType}
                                                           className="inputPass"
                                                           value={this.state.password}
                                                           onChange={this.setPassword}
                                                    />
                                                    <span
                                                        className={"showPass " + (this.state.togglePass ? 'black' : '')}
                                                        onClick={this.togglePassAttr}><i className="fa fa-eye"/></span>
                                                    <span
                                                        className={"showLang " + (this.state.toggleShowLangUp ? '' : 'hidden')}>
                                                        {this.state.langUp}
                                                    </span>
                                                </div>

                                                <div className="error_blocks">
                                                    <p className={"errorBox " + (this.state.passError ? 'hidden' : '')}>
                                                        {this.props.textConstants['cabinet.password.is.good']}</p>
                                                    <p className={"errorBox " + (this.state.passError ? '' : 'hidden')}>
                                                        {this.props.textConstants['cabinet.password.is.bad']}</p>
                                                </div>
                                            </div>

                                            <div className="inputPass__container">
                                                <p className={"gp-password__desc " + (this.state.passError ? 'hidden' : '')}>
                                                    {this.props.textConstants['cabinet.password.is.good']}
                                                </p>
                                                <p className={"gp-password__desc " + (this.state.passError ? '' : 'hidden')}>
                                                    {this.props.textConstants['cabinet.password.is.bad']}
                                                </p>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <div className={"gp-password-inp " + (this.state.passwordMatch ? 'success' : 'error')}>
                                    <div className="">
                                        <div className="">
                                            <label>{this.props.textConstants['cabinet.repeat.created.password']}</label>
                                            <div className="inputPass__wrap">
                                                <div className="inputPass__container">
                                                    <input type={this.state.passType}
                                                           className="inputPass"
                                                           value={this.state.repeatPassword}
                                                           onChange={this.setRepeatPassword}
                                                    />
                                                    <span
                                                        className={"showPass " + (this.state.togglePass ? 'black' : '')}
                                                        onClick={this.togglePassAttr}><i className="fa fa-eye"/></span>
                                                    <span
                                                        className={"showLang " + (this.state.toggleShowLangDown ? '' : 'hidden')}>
                                                        {this.state.langDown}
                                                    </span>
                                                </div>
                                                <div className="error_blocks">
                                                    {this.state.notEmpty ? <div>
                                                        <p className={"errorBox " + ((this.state.passwordMatch) ? '' : 'hidden')}>
                                                            {this.props.textConstants['cabinet.passwords.match']} </p>
                                                        <p className={"errorBox " + ((this.state.passwordMatch) ? 'hidden' : '')}>
                                                            {this.props.textConstants['cabinet.pass.dont.match']}</p>
                                                    </div> : ''}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <button disabled={!isDisabled}
                                    onClick={this.generatePassword}
                                    className="btn btn-blue setting-submit gp-proceed-reg">
                                {!this.state.forgotPass ?
                                    <p>{this.props.textConstants['cabinet.proceed.registration']}</p>
                                    :
                                    <p>{this.props.textConstants['common.back.to.main.page']}</p>}

                            </button>
                        </div>
                    </div>
                    :
                    ''
                }

            </div>
        );
    }
}

export default PasswordCreate;