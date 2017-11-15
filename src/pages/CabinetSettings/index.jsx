import React from 'react';
import {Link} from 'react-router'
import MaskedInput from 'react-maskedinput'
import * as Helpers from '../../models'
import {Helmet} from "react-helmet";

import TelephoneInput from '../../components/TelephoneInput'
import CabinetSettingsSocials from '../../components/cabinetComponents/CabinetSettingsSocials'
import CabinetSettingsWallets from '../../components/cabinetComponents/CabinetSettingsWallets'
import CabinetSettingsIpList from '../../components/cabinetComponents/CabinetSettingsIpList'
import PhoneSMSValidator from '../../components/cabinetComponents/PhoneSMSValidator'
import ResendCodeMapComponent from '../../components/cabinetComponents/ResendCodeMapComponent'

const phoneLength = 17;

class CabinetSettings extends React.Component {

    _shouldChangePass() {
        if (this.state.password.length > 1 && this.state.passwordMatch && Helpers._validatePass(this.state.password)) {
            return true
        } else if (this.state.password.length == 0 && this.state.repeatPassword == 0 && this.state.oldPassword == 0) {
            return true
        } else {
            return false
        }
    }

    _validateBTCWallet(address, callback) {
        if (address.length > 10) {
            let promise = this.props.actions.validateBitcoinWallet(address);
            promise.then(() => {
                callback(this.props.mainContent.bitcoinWalletValidatorResponce.result)
            })
        } else {
            callback(false)
        }
    }

    editChanges() {

        this.setState({showLoader: true});

        if (this.state.editMode) {

            let passObg = {
                oldPass: this.state.oldPassword,
                pass: this.state.password,
                confirmPass: this.state.repeatPassword,
            };

            let socialsLinks = this.state.socialsLinks.map((el) => {
                return {id: el.id, url: el.url}
            });

            let promise = this.props.actions.saveCabinetSettings(
                this.state.email,
                this.state.phone,
                this.state.selectedCountry,
                socialsLinks,
                this.state.login,
                this.state.allowedIpsArray,
                this.state.currencyWallets,
                this.state.logOutAfter,
                this.phone_commit.checked,
                this.parallel_session.checked,
                passObg,
                this.bind_to_ip.checked,
                this.confirmByCodeMapRef.checked,
            );

            promise.then(() => {
                this.setState({showLoader: false});
                if (!!this.props.mainContent.successSubmit.status && this.props.mainContent.successSubmit.status == 401) {

                    Helpers.showNotify('danger', this.props.textConstants['cabinet.token.invalid']);
                    this.props.actions.restoreToDefaultCabinetData();
                    this.setState({
                        editMode: false
                    });

                } else {

                    if(typeof this.props.mainContent.successSubmit.result != 'undefined'
                        && this.props.mainContent.successSubmit.result){
                        Helpers.showNotify('success', this.props.textConstants['cabinet.settings.saved']);

                        if(this.newEmailChanged()){
                            Helpers.showNotify('info', this.props.textConstants['cabinet.confirm.nwe.address']);
                        }

                        let promise = this.props.actions.getCabinetData();
                        promise.then(() => {

                            if (this.props.mainContent.cabinetPageData
                                &&
                                typeof this.props.mainContent.cabinetPageData.status != 'undefined') {
                                this.props.actions.restoreToDefaultCabinetData();
                            }

                            this.setState({
                                editMode: false
                            })
                        })
                    }else{
                        if(typeof this.props.mainContent.successSubmit.message !== 'undefined'){
                            Helpers.showNotify('info', this.props.textConstants[this.props.mainContent.successSubmit.message]);
                        }
                    }
                }
            })
        } else {

            let promise = this.props.actions.editCabinetSettings(null, null);
            promise.then(() => {
                this.setState({showLoader: false});
                if (typeof this.props.mainContent.cabinetSettingsEditRequest != 'undefined'
                    && this.props.mainContent.cabinetSettingsEditRequest.system
                ) {
                    this.props.openSideBar('codeMap');
                }
            })
        }
    }

    newEmailChanged(){
        return (this.props.mainContent.cabinetPageData.email != this.state.email)
    }

    setEmail(e) {

        if (this.state.editMode) {
            let valueEmail = e.target.value;
            if (valueEmail != this.props.mainContent.cabinetPageData.email && Helpers._validateEmail(valueEmail)) {
                let responce = this.props.actions.validateEmail(valueEmail);
                responce.then(() => {
                    if (this.props.mainContent.emailValidatorResponce) {
                        this.setState(
                            {
                                showEmailInstruction:true,
                                emailIsValid: this.props.mainContent.emailValidatorResponce.result
                            }
                        )
                    }
                })

            } else {
                this.setState({
                    emailIsValid: (valueEmail == this.props.mainContent.cabinetPageData.email),
                    showEmailInstruction:false
                })
            }
            this.setState({email: valueEmail})
        }
    }

    trim(value) {
        return value.replace(/ /g, "");
    }

    setLogin(e) {

        if (this.props.mainContent.cabinetPageData.canChangeLoginDate == 'false') {
            let loginValue = this.trim(e.target.value);
            if (loginValue.length > 3) {
                if (loginValue != this.props.mainContent.cabinetPageData.login) {
                    let promise = this.props.actions.validateLogin(loginValue);
                    promise.then(() => {
                        this.setState({
                            loginIsValid: this.props.mainContent.loginValidatorResponce.result,
                            loginIsValidMessage: this.props.mainContent.loginValidatorResponce.message,
                        })
                    })
                } else {
                    this.setState({
                        loginIsValid: true,
                    })
                }
            } else {
                this.setState({
                    loginIsValid: false,
                    loginIsValidMessage: 'cabinet.login.can.not.be.short',
                })
            }
            this.setState({login: loginValue});
        } else {
            Helpers.showNotify('info', this.props.textConstants['cabinet.cannott.chandge.login.now']);
        }
    }

    setPhone(telNumber, selectedCountry) {
        if (telNumber.length > phoneLength) {
            telNumber = telNumber.substring(0, phoneLength);
        }
        this.setState({
            phone: telNumber,
            phoneShowError: telNumber.length < (phoneLength - 2),
            selectedCountry: selectedCountry,
        })
    }

    setOldPass(e) {
        if (this.state.editMode) {
            this.setState({oldPassword: e.target.value})
        }
    }

    setNewPass(e) {
        if (this.state.editMode) {
            let match = true;
            if(e.target.value.length && this.state.repeatPassword.length){
                match = (e.target.value === this.state.repeatPassword);
            }
            this.setState({
                password: e.target.value,
                passwordMatch: match,
                passwordsAreValid: Helpers._validatePass(e.target.value)})
        }
    }

    setRepeatPass(e) {
        if (this.state.editMode) {
            this.setState({
                repeatPassword: e.target.value,
                passwordMatch: this.state.password === e.target.value,
                notEmpty: e.target.value.length,
            })
        }
    }

    setLogoutAfter(e) {
        if (this.state.editMode) {
            this.setState({logOutAfter: e.target.value})
        }
    }

    editSocialProfile(e, id, error) {
        if (this.state.editMode) {
            this.state.socialsLinks.forEach((obj) => {
                if (obj.id === id) {
                    obj.url = e.target.value;
                }
            })

            let errorsArray = JSON.parse(JSON.stringify(this.state.socialLinksError));

            if(error || e.target.value.length == 0){
                delete errorsArray[id];
            }else{
                errorsArray[id] = error;
            }
            this.setState({socialLinksError:errorsArray});
        }
    }

    toggleIpisList() {
        this.setState({
            showInputsList: !this.state.showInputsList
        })
    }

    walletBtcValidation(result) {
        this.setState({validBTCWallets: result})
    }

    setWallet(e, idIndex, currencyCode) {
        let chosenIds = this.state.currencyWallets.slice();

        let value = e.target.value;
        if (chosenIds.filter(e => e.currencyId == idIndex).length > 0) {
            chosenIds.forEach((obj) => {
                if (obj.currencyId === idIndex) {

                    if (currencyCode == 'btc') {
                        if (value.length > 0) {

                            this._validateBTCWallet(value, this.walletBtcValidation)

                        } else {
                            this.setState({validBTCWallets: true})
                        }
                    }
                    obj.number = value;
                }
            })
        } else {

            if (currencyCode == 'btc') {
                if (value.length > 0) {
                    this._validateBTCWallet(value, this.walletBtcValidation)
                } else {
                    this.setState({validBTCWallets: true})
                }
            }

            chosenIds.push({currencyId: idIndex, number: value})
        }

        this.setState({
            currencyWallets: chosenIds
        })
    }

    handleIpMask(e) {
        let mask;
        switch (e.target.value) {
            case 'a':
                mask = '111.111.111.111'
                break;
            case 'b':
                mask = '111'
                break;
            case 'c':
                mask = '111.111'
                break;
            case 'd':
                mask = '111.111.111'
                break;
            case 'f':
                mask = '111.111.111.111'
                break;
        }

        this.setState({
            ipMask: e.target.value,
            inputMask: mask,
            middleIpVal: '',
        });
    }

    setMaskedIp(e) {
        this.setState({middleIpVal: e.target.value});
    }

    addToIpList() {

        if (this.state.middleIpVal.length) {
            let maskedIp;
            let shouldPushToList = this.state.middleIpVal.indexOf('_') == -1;
            switch (this.state.ipMask) {
                case 'a':
                    maskedIp = this.state.middleIpVal
                    break;
                case 'b':
                    maskedIp = 'X.X.X.' + this.state.middleIpVal
                    break;
                case 'c':
                    maskedIp = 'X.X.' + this.state.middleIpVal
                    break;
                case 'd':
                    maskedIp = 'X.' + this.state.middleIpVal
                    break;
                case 'f':
                    maskedIp = this.state.middleIpVal
                    break;
            }

            if (shouldPushToList) {

                let allowedIpsArray = JSON.parse(JSON.stringify(this.state.allowedIpsArray));

                if (allowedIpsArray.filter(e => e.value == maskedIp).length <= 0) {
                    allowedIpsArray.push({value: maskedIp, status: true});
                }

                this.setState({
                    allowedIpsArray: allowedIpsArray,
                    middleIpVal: '',
                })
            }
        }
    }

    showCodeMap() {
        return false;
    }

    removeFromIpList(index, value) {
        if (this.state.editMode) {
            let allowedIpsArray = JSON.parse(JSON.stringify(this.state.allowedIpsArray));

            allowedIpsArray = allowedIpsArray.filter(function (obj) {
                return obj.value != value;
            });

            this.setState({
                allowedIpsArray: allowedIpsArray,
            })
        }
    }

    setActiveStatus(index, value) {
        if (this.state.editMode) {
            let allowedIpsArray = JSON.parse(JSON.stringify(this.state.allowedIpsArray));

            allowedIpsArray = allowedIpsArray.filter(function (obj) {
                if (obj.value == value) {
                    obj.status = !obj.status;
                }
                return true;
            });

            this.setState({
                allowedIpsArray: allowedIpsArray,
            })
        }
    }

    askForCode() {
        let phoneConfirmPromise = this.props.actions.sendPhoneForConfirmation(this.state.phone);
        phoneConfirmPromise.then(() => {
            this.setState({showLoader: false})
            if (this.props.mainContent.shouldValidatePhone.result) {
                this.setState({openSmsValidator: true});
            } else {
                Helpers.showNotify('info',
                    this.props.textConstants[this.props.mainContent.shouldValidatePhone.message]);
            }
        })
    }

    closeSmsValidatorPopUp(){
        this.setState({
            openSmsValidator: false,
            telConfirmed:false
        });
    }

    validatePhone(boolFlag = 'open', wasConfirmed = false) {

        if(this.props.mainContent.cabinetPageData.phone === this.state.phone){
            this.setState({
                telConfirmed: true,
            });
            Helpers.showNotify('info',
                this.props.textConstants['Cabinet.Phone.ThisPhoneIsConfirmed']);
        }

        let telConfirmed = true;

        if (this.props.mainContent.cabinetPageData.phone != this.state.phone && this.state.phone.length >= (phoneLength - 2)) {
            if (boolFlag == 'close') {

                if (this.props.mainContent.cabinetPageData.phone != this.state.phone && !wasConfirmed) {
                    telConfirmed = false;
                }

                this.setState({
                    openSmsValidator: false,
                    telConfirmed: telConfirmed,
                });

            } else {

                this.setState({showLoader: true});
                this.askForCode();
            }
        }
    }

    resendEmail() {

        if (!this.state.disableReactivateEmail) {
            this.setState({disableReactivateEmail: true});
            let responce = this.props.actions.resendEmailConfirmation();
            responce.then(() => {
                if (this.props.mainContent.resendEmailActiovation && this.props.mainContent.resendEmailActiovation.message) {
                    Helpers.showNotify('success', this.props.textConstants[this.props.mainContent.resendEmailActiovation.message]);
                    this.props.openSideBar();
                } else {
                    Helpers.showNotify('danger', this.props.textConstants['cabinet.oops.something.went.wrong']);
                }

            });
            setTimeout(() => {
                if(!!this.cabinetSettings){
                    this.setState({disableReactivateEmail: false});
                }
            }, 4000);
        }
    }

    checkIfPhoneEntered() {

        if(this.props.mainContent.cabinetPageData.phone == null){
            if(this.state.phone == null){
                this.phone_commit.checked = false;
            }else if(this.state.phone != null && this.state.phone.length > 5 && !this.state.telConfirmed){
                this.phone_commit.checked = false;
            }else if(this.state.phone != null && this.state.phone.length <= 5 && this.state.telConfirmed){
                this.phone_commit.checked = false;
            }
        }else{
            if(!this.state.telConfirmed){
                this.phone_commit.checked = false;
            }
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            editMode: false,
            openSmsValidator: false,
            socialLinksError: {},
            loginIsValid: true,
            loginIsValidMessage: '',
            telConfirmed: true,
            password: '',
            disableReactivateEmail: false,
            showEmailInstruction: false,
            repeatPassword: '',
            oldPassword: '',
            passwordMatch: true,
            phone: '',
            phoneShowError: this.props.mainContent.cabinetPageData && this.props.mainContent.cabinetPageData.phone ? this.props.mainContent.cabinetPageData.phone.length < 17 : true,
            login: '',
            email: '',
            selectedCountry: '',
            socialsLinks: [],
            showInputsList: false,
            showLoader: false,
            ipMask: 'a',
            validBTCWallets: true,
            middleIpVal: '',
            emailIsValid: true,
            passwordsAreValid: true,
            allowedIpsArray: [],
            inputMask: '111.111.111.111',
            cabinetPageData: this.props.mainContent.cabinetPageData,
            bindToIp: this.props.mainContent.cabinetPageData.bindSessionToIp,
            codemapshown: typeof this.props.mainContent.cabinetPageData.codemapshown != 'undefined' ? this.props.mainContent.cabinetPageData.codemapshown : false,
            currencyWallets: this.props.mainContent.cabinetPageData.walletsView ? this.props.mainContent.cabinetPageData.walletsView : [],
            logOutAfter: typeof this.props.mainContent.cabinetPageData.logoutAfter != 'undefined' ? this.props.mainContent.cabinetPageData.logoutAfter : 0,
            confirmByCodeMap: this.props.mainContent.cabinetPageData.confirmByCodeMap,
        }
        this.editChanges = this.editChanges.bind(this)
        this.setEmail = this.setEmail.bind(this)
        this.setPhone = this.setPhone.bind(this)
        this.setLogin = this.setLogin.bind(this)
        this.setLogoutAfter = this.setLogoutAfter.bind(this)
        this.setRepeatPass = this.setRepeatPass.bind(this)
        this.setNewPass = this.setNewPass.bind(this)
        this.setOldPass = this.setOldPass.bind(this)
        this.editSocialProfile = this.editSocialProfile.bind(this)
        this.toggleIpisList = this.toggleIpisList.bind(this)
        this.handleIpMask = this.handleIpMask.bind(this)
        this.setWallet = this.setWallet.bind(this)
        this.setMaskedIp = this.setMaskedIp.bind(this)
        this.addToIpList = this.addToIpList.bind(this)
        this.removeFromIpList = this.removeFromIpList.bind(this)
        this.setActiveStatus = this.setActiveStatus.bind(this)
        this.showCodeMap = this.showCodeMap.bind(this)
        this.resendEmail = this.resendEmail.bind(this)
        this.validatePhone = this.validatePhone.bind(this)
        this.askForCode = this.askForCode.bind(this)
        this.checkIfPhoneEntered = this.checkIfPhoneEntered.bind(this)
        this._validateBTCWallet = this._validateBTCWallet.bind(this)
        this.walletBtcValidation = this.walletBtcValidation.bind(this)
        this.newEmailChanged = this.newEmailChanged.bind(this)
        this.closeSmsValidatorPopUp = this.closeSmsValidatorPopUp.bind(this)
    }

    componentWillMount() {
        this.setState({
            allowedIpsArray: this.props.mainContent.cabinetPageData.ipsView || [],
            editMode: false
        })
    }

    componentWillReceiveProps(nextProp) {

        if (nextProp.mainContent.cabinetPageData && nextProp.mainContent.cabinetPageData.result == true) {

            if (this.props.mainContent.cabinetPageData != nextProp.mainContent.cabinetPageData) {

                this.setState({
                    editMode: true,
                    email: nextProp.mainContent.cabinetPageData.email,
                    phone: nextProp.mainContent.cabinetPageData.phone,
                    bindToIp: nextProp.mainContent.cabinetPageData.bindSessionToIp,
                    login: nextProp.mainContent.cabinetPageData.login,
                    socialsLinks: nextProp.mainContent.cabinetPageData.socialLinks,
                    currencyWallets: nextProp.mainContent.cabinetPageData.walletsView ? nextProp.mainContent.cabinetPageData.walletsView : [],
                })
            }

            if (this.props.mainContent.shouldValidatePhoneCodeResponce != nextProp.mainContent.shouldValidatePhoneCodeResponce) {
                if(nextProp.mainContent.shouldValidatePhoneCodeResponce.result === true){
                    this.setState({telConfirmed:true});
                }
            }
        }
    }

    componentWillUnmount() {

        this.setState({
            editMode: false
        });
        if (this.state.editMode) {
            this.props.actions.restoreToDefaultCabinetData();
        }
    }

    render() {

        let {phone, email, socialLinksError, validBTCWallets, telConfirmed, loginIsValid, emailIsValid} = this.state;
        let isDisabled = Helpers.isEmptyObj(socialLinksError) && !!phone && Helpers._validateEmail(email) && loginIsValid && emailIsValid && this._shouldChangePass() && validBTCWallets && telConfirmed;

        let fullUrl = '/';

        if (process.env.WEBPACK) {
            fullUrl = window.location.href;
        } else {
            fullUrl = process.env.webSiteUrl
        }

        return (
            <div ref={(cabinetSettings)=>{this.cabinetSettings = cabinetSettings}}>

                <Helmet>
                    <meta charSet="utf-8"/>
                    <title>{this.props.mainContent.content.cabinetPage.metaTitle}</title>
                    <meta name="description" content={this.props.mainContent.content.cabinetPage.metaDescription}/>
                    <meta name="keywords" content={this.props.mainContent.content.cabinetPage.metaKeywords}/>
                    <meta property="og:url" content={fullUrl}/>
                    <meta property="og:type" content="article"/>
                    <meta property="og:title" content={this.props.mainContent.content.cabinetPage.metaTitle}/>
                    <meta property="og:description" content={this.props.mainContent.content.cabinetPage.metaDescription}/>
                    <meta property="og:image" content={this.props.mainContent.content.cabinetPage.metaPicture}/>
                </Helmet>

                <div className="cabinet-content" id="cabinet-settings">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12">
                                <p className="cabinet-header">{this.props.textConstants['cabinet.personal.info']}
                                    <Link to={'/cabinet'} className="back-to-home">
                                        <i className="fa fa-angle-left" aria-hidden="true"/>
                                        &nbsp;{this.props.textConstants['common.back.to.main.page']}
                                    </Link>
                                </p>
                                <div className="settings-tab">
                                    <div className="row form-group">
                                        <div className="col-xs-12 col-sm-4 col-md-4">
                                            <label htmlFor="login"
                                                   className="setting-label">{this.props.textConstants['cabinet.your.login']}</label>

                                            {!this.state.editMode ?
                                                <div className="form-control setting-input disabled"
                                                     onClick={this.editChanges}>
                                                    {this.props.mainContent.cabinetPageData.login}
                                                </div>
                                                :

                                                <div
                                                    className={'validation ' + (this.state.loginIsValid ? '' : 'error')}>
                                                    <input id="email"
                                                           type="text"
                                                           className={"form-control setting-input "}
                                                           placeholder={this.props.mainContent.cabinetPageData.login}
                                                           value={this.state.login}
                                                           onChange={this.setLogin}
                                                           disabled={!this.state.editMode}
                                                    />
                                                    <span className="input-helper">
                                                        {this.props.textConstants[this.state.loginIsValidMessage]}
                                                     </span>
                                                </div>
                                            }

                                        </div>
                                        <div className="col-xs-12 col-sm-4 col-md-4 rel-pos">

                                            {this.props.mainContent.cabinetPageData.emailConfirmed ?
                                                ''
                                                :
                                                <span
                                                    className={"settings-link " + (this.state.disableReactivateEmail ? 'greyColor' : '')}
                                                    onClick={() => {
                                                        this.resendEmail();
                                                    }}>
                                                {this.props.textConstants['cabinet.send.new.email']}
                                                </span>
                                            }

                                            <label htmlFor="email" className="setting-label">
                                                {this.props.textConstants['cabinet.your.email']}
                                            </label>

                                            {!this.state.editMode ?
                                                <div className={"form-control setting-input disabled"}
                                                     onClick={this.editChanges}>
                                                    {this.props.mainContent.cabinetPageData.email}
                                                </div>
                                                :
                                                <div
                                                    className={'validation ' + (this.state.emailIsValid ? '' : 'error')}>
                                                    <input id="email"
                                                           type="text"
                                                           className={"form-control setting-input  " + (this.state.emailIsValid ? '' : 'has-error')}
                                                           placeholder={this.props.mainContent.cabinetPageData.email}
                                                           value={this.state.email}
                                                           onChange={this.setEmail}
                                                           disabled={!this.state.editMode}
                                                    />
                                                    <span className="input-message error">
                                                        {this.props.textConstants['cabinet.email.is.invalid']}
                                                     </span>
                                                </div>
                                            }

                                            <span className={'input-description ' + (this.state.showEmailInstruction ? '' : 'hidden')}>
                                                  {this.props.textConstants['cabinet.confirm.nwe.address']}
                                            </span>
                                        </div>
                                        <div className="col-xs-12 col-sm-4 col-md-4">
                                            <label className="setting-label">
                                                {this.props.textConstants['cabinet.enter.your.phone']}
                                            </label>

                                            {!this.state.editMode ?
                                                <div className={"form-control setting-input disabled"}
                                                     onClick={this.editChanges}>
                                                    {this.props.mainContent.cabinetPageData.phone}
                                                </div>
                                                :
                                                <div
                                                    className={' ' + (this.state.phoneShowError ? ' validation error ' : '')}>

                                                    <TelephoneInput classes={'signUp'}
                                                                    onBlur={this.validatePhone}
                                                                    value={this.state.phone}
                                                                    setPhoneNumber={this.setPhone}/>
                                                    <span className="input-message error">
                                                        {this.props.textConstants['cabinet.settings.phone.is.required']}
                                                    </span>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-12">
                                <p className="cabinet-header">{this.props.textConstants['cabinet.change.pass']}</p>
                                <div className="settings-tab">
                                    <div className="row form-group">

                                        <div className="col-xs-12 col-sm-4 col-md-4">
                                            <label htmlFor="old_password"
                                                   className="setting-label">{this.props.textConstants['cabinet.old.pass']}</label>

                                            {!this.state.editMode ?
                                                <div className="form-control setting-input disabled"
                                                     onClick={this.editChanges}/>
                                                :
                                                <div>
                                                    <input id="old_password"
                                                           type="password"
                                                           className="form-control setting-input"
                                                           placeholder=""
                                                           onChange={this.setOldPass}
                                                           disabled={!this.state.editMode}
                                                    />
                                                </div>
                                            }
                                        </div>

                                        <div className="col-xs-12 col-sm-4 col-md-4">
                                            <label htmlFor="new_password"
                                                   className="setting-label">{this.props.textConstants['cabinet.new.pass']}</label>
                                            {!this.state.editMode ?
                                                <div className="form-control setting-input disabled"
                                                     onClick={this.editChanges}/>
                                                :
                                                <div
                                                    className={'validation ' + (this.state.passwordsAreValid ? '' : 'error')}>
                                                    <input id="new_password"
                                                           type="password"
                                                           className={"form-control setting-input " + (this.state.passwordsAreValid ? '' : 'has-error')}
                                                           placeholder=""
                                                           onChange={this.setNewPass}
                                                           disabled={!this.state.editMode}
                                                    />
                                                    <span className="input-message error">
                                                        {this.props.textConstants['cabinet.pass.is.incorect']}
                                                    </span>
                                                </div>
                                            }
                                        </div>

                                        <div className="col-xs-12 col-sm-4 col-md-4">
                                            <label htmlFor="repeat_password"
                                                   className="setting-label">{this.props.textConstants['cabinet.repeat.pass']}</label>
                                            {!this.state.editMode ?
                                                <div className="form-control setting-input disabled"
                                                     onClick={this.editChanges}/>
                                                :
                                                <div
                                                    className={'validation ' + (this.state.passwordMatch ? '' : 'error')}>
                                                    <input id="repeat_password"
                                                           type="password"
                                                           className={"form-control setting-input " + (this.state.passwordMatch ? '' : 'has-error')}
                                                           placeholder=""
                                                           onChange={this.setRepeatPass}
                                                           disabled={!this.state.editMode}
                                                    />
                                                    <span className="input-message error">
                                                        {this.props.textConstants['cabinet.pass.dont.match']}
                                                        </span>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-12">
                                <p className="cabinet-header">{this.props.textConstants['cabinet.security']}</p>
                                <div className="settings-tab">
                                    <div className="row form-group">
                                        <div className="col-xs-12 col-sm-6 col-md-3">
                                            <label htmlFor="control_ip"
                                                   className="setting-label">{this.props.textConstants['cabineet.controll.ip']}</label>

                                            {!this.state.editMode ?
                                                <div className={"select form-control setting-input disabled"}
                                                     onClick={() => {
                                                         !this.state.editMode ? this.editChanges() : ''
                                                     }}/>
                                                :
                                                <select name="control_ip"
                                                        id="control_ip"
                                                        className={"select form-control setting-input " + (this.state.editMode ? '' : 'disabled')}
                                                        onChange={this.handleIpMask}
                                                        disabled={!this.state.editMode}>
                                                    <option
                                                        value={'a'}> {this.props.textConstants['cabinet.default']}</option>
                                                    <option value={'b'}>x.0.0.0</option>
                                                    <option value={'c'}>x.x.0.0</option>
                                                    <option value={'d'}>x.x.x.0</option>
                                                    <option value={'f'}>x.x.x.x</option>
                                                </select>
                                            }

                                        </div>

                                        <div className="col-xs-12 col-sm-6 col-md-3 ">
                                            <label htmlFor="control_ip"
                                                   className="setting-label">{this.props.textConstants['cabineet.controll.ip']}</label>
                                            <div className="input-mask" onClick={() => {
                                                !this.state.editMode ? this.editChanges() : ''
                                            }}>
                                                <MaskedInput
                                                    disabled={!this.state.editMode}
                                                    value={this.state.middleIpVal}
                                                    className={"form-control setting-input " + (this.state.editMode ? '' : 'disabled')}
                                                    mask={this.state.inputMask}
                                                    name="card" size="20" onChange={this.setMaskedIp}/>
                                                <label onClick={this.addToIpList} className="plus-sign"/>
                                            </div>
                                        </div>

                                        <div className="col-xs-12 col-sm-6 col-md-2">
                                            <label
                                                className="setting-label">{this.props.textConstants['cabinet.bind.ip.adress']}</label>
                                            <div className="material-switch rel-pos">
                                                {!this.state.editMode ?
                                                    <div className="forClick" onClick={() => {
                                                        !this.state.editMode ? this.editChanges() : ''
                                                    }}/>
                                                    :
                                                    ''
                                                }
                                                <input id="bind_to_ip"
                                                       name="bind_to_ip"
                                                       type="checkbox"

                                                       ref={(bind_to_ip) => {
                                                           this.bind_to_ip = bind_to_ip
                                                       }}
                                                       onClick={() => {
                                                           !this.state.editMode ? this.editChanges() : ''
                                                       }}
                                                       defaultChecked={this.state.bindToIp}
                                                       disabled={!this.state.editMode}
                                                />
                                                <label htmlFor="bind_to_ip" className="label-primary"/>
                                            </div>
                                        </div>

                                        <div className="col-xs-12 col-sm-6 col-md-2">
                                            <label
                                                className="setting-label">{this.props.textConstants['cabinet.disallow.parallel.sessions']}</label>
                                            <div className="material-switch rel-pos">
                                                {!this.state.editMode ?
                                                    <div className="forClick" onClick={() => {
                                                        !this.state.editMode ? this.editChanges() : ''
                                                    }}/>
                                                    :
                                                    ''
                                                }
                                                <input id="parallel_session"
                                                       name="parallel_session"
                                                       type="checkbox"
                                                       onClick={() => {
                                                           !this.state.editMode ? this.editChanges() : ''
                                                       }}
                                                       ref={(parallel_session) => {
                                                           this.parallel_session = parallel_session
                                                       }}
                                                       disabled={!this.state.editMode}
                                                       defaultChecked={this.props.mainContent.cabinetPageData.disallowParallelSessions}
                                                />

                                                <label htmlFor="parallel_session" className="label-primary"/>
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-sm-6 col-md-2">
                                            <label className="setting-label">
                                                {this.props.textConstants['cabinet.logout.after']}
                                            </label>

                                            {!this.state.editMode ?
                                                <div className="select form-control setting-input disabled"
                                                     onClick={() => {
                                                         !this.state.editMode ? this.editChanges() : ''
                                                     }}
                                                >{typeof this.state.logOutAfter != 'undefined' ? this.state.logOutAfter + ' ' : ''}{this.props.textConstants['cabinet.min']}</div>
                                                :
                                                <select name="logout_after" id="logout_after"
                                                        disabled={!this.state.editMode}
                                                        onChange={this.setLogoutAfter}
                                                        defaultValue={this.state.logOutAfter}
                                                        className="select form-control setting-input">
                                                    <option value="0">
                                                        0 {this.props.textConstants['cabinet.min']} </option>
                                                    <option value="15">
                                                        15 {this.props.textConstants['cabinet.min']}</option>
                                                    <option value="30">
                                                        30 {this.props.textConstants['cabinet.min']}</option>
                                                    <option value="60">
                                                        60 {this.props.textConstants['cabinet.min']}</option>
                                                    <option value="120">
                                                        120 {this.props.textConstants['cabinet.min']}</option>
                                                </select>
                                            }
                                        </div>
                                    </div>

                                    <div className={"row form-group " + (this.state.editMode ? '' : 'hidden')}>
                                        <div
                                            className={"ip-security " + (this.state.showInputsList ? 'active' : '')}>
                                            <a href="javascript:void(0);"
                                               className="ip-security-header"
                                               onClick={this.toggleIpisList}
                                            ><i className="fa fa-bars"/>&nbsp;{this.props.textConstants['cabinet.available.ip']}
                                            </a>
                                            <div className="ip-block">

                                                {this.state.allowedIpsArray.length ? this.state.allowedIpsArray.map((el, key) => {
                                                    return <CabinetSettingsIpList key={key}
                                                                                  active={true}
                                                                                  ipItem={el}
                                                                                  keyIndex={key}
                                                                                  removeFromIpList={this.removeFromIpList}
                                                                                  setActiveStatus={this.setActiveStatus}
                                                    />
                                                }) : ''}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row form-group">
                                        <div className="max-security">

                                            <div className="col-xs-12 col-sm-12 col-md-3">
                                                <div className="shield-security">
                                                    {this.props.textConstants['cabinet.create.maximum.security']}
                                                </div>
                                            </div>

                                            <div className="col-xs-12 col-sm-5 col-md-3">
                                                <label className="setting-label security_label_height">
                                                    {this.props.textConstants['cabinet.phone.verify']}
                                                </label>
                                                <div className="material-switch rel-pos">

                                                    {!this.state.editMode ?
                                                        <div className="forClick" onClick={() => {
                                                            !this.state.editMode ? this.editChanges() : ''
                                                        }}/>
                                                        :
                                                        ''
                                                    }

                                                    <input id="phone_commit"
                                                           name="phone_commit"
                                                           type="checkbox"
                                                           ref={(phone_commit) => {
                                                               this.phone_commit = phone_commit
                                                           }}
                                                           onChange={this.checkIfPhoneEntered}
                                                           disabled={!this.state.editMode}
                                                           defaultChecked={this.props.mainContent.cabinetPageData.confirmByPhone}/>

                                                    <label htmlFor="phone_commit" className="label-primary"/>
                                                </div>
                                                <span
                                                    className={"security_label " + (this.props.mainContent.cabinetPageData.confirmByPhone ? 'green' : 'red')}>
                                                        {this.props.mainContent.cabinetPageData.confirmByPhone ? this.props.textConstants['cabinet.tel.confirmed'] : this.props.textConstants['cabinet.set.phone']}
                                                </span>
                                            </div>

                                            <div className="col-xs-12 col-sm-7 col-md-3">

                                                <label className="setting-label security_label_height">
                                                    {this.props.textConstants['Cabinet.chandging.codeCart']}
                                                </label>

                                                <div className="material-switch rel-pos">

                                                    {!this.state.editMode ?
                                                        <div className="forClick" onClick={() => {
                                                            !this.state.editMode ? this.editChanges() : ''
                                                        }}/>
                                                        :
                                                        ''
                                                    }

                                                    <input id="code_card"
                                                           name="code_card"
                                                           type="checkbox"
                                                           onClick={() => {
                                                               !this.state.editMode ? this.editChanges() : ''
                                                           }}
                                                           ref={(code_card) => {
                                                               this.code_card = code_card
                                                           }}
                                                           checked={this.state.codemapshown}
                                                           onChange={this.showCodeMap}
                                                           disabled={!this.state.editMode}
                                                    />

                                                    <label htmlFor="code_card" className="label-primary"/>
                                                </div>

                                                <ResendCodeMapComponent
                                                    editMode={this.state.editMode}
                                                    editChanges={this.editChanges}
                                                    actions={this.props.actions}
                                                    mainContent={this.props.mainContent}
                                                    textConstants={this.props.textConstants}
                                                    openSideBar={this.props.openSideBar}
                                                />
                                            </div>

                                            <div className="col-xs-12 col-sm-6 col-md-3">
                                                <label className="setting-label security_label_height">
                                                    {this.props.textConstants['cabinet.codemap.verify']}
                                                </label>
                                                <div className="material-switch rel-pos">

                                                    {!this.state.editMode ?
                                                        <div className="forClick" onClick={() => {
                                                            !this.state.editMode ? this.editChanges() : ''
                                                        }}/>
                                                        :
                                                        ''
                                                    }

                                                    <input id="code_card_1"
                                                           name="code_card"
                                                           type="checkbox"
                                                           onClick={() => {
                                                               !this.state.editMode ? this.editChanges() : ''
                                                           }}
                                                           ref={(confirmByCodeMapRef) => {
                                                               this.confirmByCodeMapRef = confirmByCodeMapRef
                                                           }}
                                                           defaultChecked={this.state.confirmByCodeMap}
                                                           disabled={!this.state.editMode}
                                                    />

                                                    <label htmlFor="code_card_1" className="label-primary"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {this.props.mainContent.cabinetPageData
                            &&
                            this.props.mainContent.cabinetPageData.walletsView
                                ?
                                this.props.mainContent.cabinetPageData.walletsView.map((el, key) => {
                                    return <CabinetSettingsWallets key={key}
                                                                   wallet={el}
                                                                   editMode={this.state.editMode}
                                                                   disabled={!this.state.editMode}
                                                                   validBTCWallets={this.state.validBTCWallets}
                                                                   keyIndex={key}
                                                                   editChanges={this.editChanges}
                                                                   currencyWallets={this.state.currencyWallets}
                                                                   setWallet={this.setWallet}
                                    />
                                }) : ''}
                        </div>

                        <div className="row">
                            <div className="col-xs-12">
                                <p className="cabinet-header">{this.props.textConstants['cabinet.soc.media']}</p>
                                <div className="settings-tab">
                                    <div className="row form-group">

                                        {this.props.mainContent.cabinetPageData
                                        &&
                                        this.props.mainContent.cabinetPageData.socialLinks
                                        &&
                                        this.props.mainContent.cabinetPageData.socialLinks.length
                                            ?
                                            this.props.mainContent.cabinetPageData.socialLinks.map((el, key) => {
                                                return <CabinetSettingsSocials editChanges={this.editChanges}
                                                                               editMode={this.state.editMode}
                                                                               textConstants={this.props.textConstants}
                                                                               editSocialProfile={this.editSocialProfile}
                                                                               socialsLinks={this.state.socialsLinks}
                                                                               socials={el} key={key} keyIndex={key}/>
                                            }) : ''}

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-12">
                                <p className="text-center">
                                    {this.state.editMode ?
                                        <button type="submit"
                                                className="btn btn-blue setting-submit"
                                                onClick={this.editChanges}
                                                disabled={!isDisabled}
                                        >{this.props.textConstants['cabinet.save']}</button>
                                        :
                                        <button type="submit"
                                                className="btn btn-blue setting-submit"
                                                onClick={this.editChanges}
                                        >{this.props.textConstants['cabinet.edit']}</button>}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <PhoneSMSValidator
                    validatePhone={this.validatePhone}
                    askForCode={this.askForCode}
                    openSmsValidator={this.state.openSmsValidator}
                    textConstants={this.props.mainContent.textConstants}
                    actions={this.props.actions}
                    closeSmsValidatorPopUp={this.closeSmsValidatorPopUp}
                    mainContent={this.props.mainContent}
                />
                <div className={"whitebg " + (this.state.showLoader ? '' : 'hidden')}>
                    <div className={"fixed-loader " + (this.state.showLoader ? '' : 'hidden')}/>
                </div>
            </div>
        );
    }
}

export default CabinetSettings;