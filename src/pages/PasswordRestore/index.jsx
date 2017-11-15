// import React from 'react';
// import Cookies from 'universal-cookie';
// import {browserHistory} from 'react-router'
//
// import CabinetHeaderNoMenu from '../../components/cabinetComponents/CabinetHeaderNoMenu'
// import * as Helpers from '../../models'
// // import Footer from '../../components/Footer'
//
// // if (process.env.WEBPACK) {
// //     require('./styles.scss');
// // }
//
// class PasswordRestore extends React.Component {
//
//     _validatePass(pass) {
//         let re = /^(?=.*[A-Z])(?=.*[a-z])(^.{5,}$)/;
//         return re.test(pass);
//     }
//
//     setPassword(evt) {
//         let validate = this._validatePass(evt.target.value)
//         this.setState(
//             {
//                 password: evt.target.value,
//                 passError: !validate,
//                 passwordMatch: this.state.password === evt.target.value,
//             }
//         )
//     }
//
//     setRepeatPassword(evt) {
//         this.setState({
//             repeatPassword: evt.target.value,
//             passwordMatch: this.state.password === evt.target.value,
//             notEmpty: evt.target.value.length,
//         })
//     }
//
//     generatePassword() {
//         const cookies = new Cookies();
//         let promise = this.props.actions.setNewPassword(this.state.password, this.state.repeatPassword, this.props.location.query.code, this.props.location.query.userid, window.location.origin, cookies.get('APIToken'))
//         promise.then(() => {
//             if (this.props.mainContent.passwordChanged) {
//                 if(this.props.mainContent.passwordChanged.status == 400){
//                     Helpers.showNotify('danger',this.props.mainContent.passwordChanged.message);
//                 }else if(this.props.mainContent.passwordChanged && this.props.mainContent.passwordChanged.value && this.props.mainContent.passwordChanged.value.token){
//
//                     cookies.set('APIToken', this.props.mainContent.passwordChanged.value.token, {path: '/'});
//                     // if (typeof cookies.get('APIToken') == 'undefined') {
//                     //    cookies.set('APIToken', this.props.mainContent.passwordChanged.value.token, {path: '/'});
//                     // }
//                     // cookies.set('APIToken', this.props.mainContent.passwordChanged.value.token, {path: '/'});
//                     browserHistory.push('/codemap');
//                 }else{
//                     Helpers.showNotify('danger',this.props.mainContent.passwordChanged.message);
//                 }
//             } else {
//                 Helpers.showNotify('danger','Something wrond');
//                 // this.setState({errorHandler: this.props.mainContent.passwordChanged.result})
//             }
//         })
//     }
//
//     togglePassAttr(){
//         this.setState({
//             passType:this.state.passType == 'text' ? 'password' :'text',
//             togglePass:!this.state.togglePass
//         })
//     }
//
//     constructor(props) {
//         super(props)
//         this.state = {
//             password: '',
//             repeatPassword: '',
//             passwordMatch: false,
//             passError: true,
//             validAccess: false,
//             notEmpty: false,
//             errorHandler: true,
//             passType: 'password',
//             togglePass:false
//         }
//         this.setPassword = this.setPassword.bind(this)
//         this.setRepeatPassword = this.setRepeatPassword.bind(this)
//         this.generatePassword = this.generatePassword.bind(this)
//         this.togglePassAttr = this.togglePassAttr.bind(this)
//     }
//
//     componentWillMount() {
//         if (this.props.location.query.code) {
//             this.setState({validAccess: true})
//         }
//     }
//
//     render() {
//         const {password, repeatPassword, passwordMatch} = this.state;
//         let isDisabled = this._validatePass(password) && passwordMatch && (repeatPassword.length > 1);
//         return (
//             <div>
//
//                 <CabinetHeaderNoMenu
//                     actions={this.props.actions}
//                     mainContent={this.props.mainContent}
//                     content={this.props.content}
//                     textConstants={this.props.textConstants}
//                     openSideBar={this.props.openSideBar}
//                     cabinetPageData={this.props.mainContent.cabinetPageData}
//                 />
//                 {this.state.validAccess ?
//                     <div className="container">
//                         <p className="cm-title">{this.props.textConstants['cabinet.creating.account.pass']}</p>
//                         <p>{this.props.textConstants['cabinet.creating.acount.pass.text']}</p>
//                         <hr/>
//                         <div className="row">
//                             <p>{this.props.textConstants['index.page.users.terms']}</p>
//                             <div className="col-xs-12 ">
//                                 <div className={"gp-password-inp " + (this.state.passError ? 'error' : 'success')}>
//                                     <div className="">
//
//                                         <div className="">
//                                             <label>{this.props.textConstants['cabinet.create.password']}</label>
//                                             <div className="inputPass__wrap">
//                                                 <div className="inputPass__container">
//                                                     <input type={this.state.passType}
//                                                            className="inputPass"
//                                                            value={this.state.password}
//                                                            onChange={this.setPassword}
//                                                     />
//                                                     <span className={"showPass " + (this.state.togglePass ? 'black' : '')} onClick={this.togglePassAttr}><i className="fa fa-eye"/></span>
//                                                 </div>
//
//                                                 <div className="error_blocks">
//                                                     <p className={"errorBox " + (this.state.passError ? 'hidden' : '')}>
//                                                         {this.props.textConstants['cabinet.password.is.good']}</p>
//                                                     <p className={"errorBox " + (this.state.passError ? '' : 'hidden')}>
//                                                         {this.props.textConstants['cabinet.password.is.bad']}</p>
//                                                 </div>
//                                             </div>
//
//                                             <div className="inputPass__container">
//                                                 <p className={"gp-password__desc " + (this.state.passError ? 'hidden' : '')}>
//                                                     {this.props.textConstants['cabinet.password.is.good']}
//                                                 </p>
//                                                 <p className={"gp-password__desc " + (this.state.passError ? '' : 'hidden')}>
//                                                     {this.props.textConstants['cabinet.password.is.bad']}
//                                                 </p>
//                                             </div>
//
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="row">
//                             <div className="col-xs-12">
//                                 <div className={"gp-password-inp " + (this.state.passwordMatch ? 'success' : 'error')}>
//                                     <div className="">
//                                         <div className="">
//                                             <label>{this.props.textConstants['cabinet.repeat.created.password']}</label>
//                                             <div className="inputPass__wrap">
//                                                 <div className="inputPass__container">
//                                                     <input type={this.state.passType}
//                                                            className="inputPass"
//                                                            value={this.state.repeatPassword}
//                                                            onChange={this.setRepeatPassword}
//                                                     />
//                                                     <span className={"showPass " + (this.state.togglePass ? 'black' : '')} onClick={this.togglePassAttr}><i className="fa fa-eye"/></span>
//                                                 </div>
//                                                 <div className="error_blocks">
//                                                     {this.state.notEmpty ? <div>
//                                                         <p className={"errorBox " + ((this.state.passwordMatch) ? '' : 'hidden')}>
//                                                             {this.props.textConstants['cabinet.passwords.match']} </p>
//                                                         <p className={"errorBox " + ((this.state.passwordMatch) ? 'hidden' : '')}>
//                                                             {this.props.textConstants['cabinet.pass.dont.match']}</p>
//                                                     </div> : ''}
//
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="">
//                             <button disabled={!isDisabled}
//                                     onClick={this.generatePassword}
//                                     className="btn btn-blue setting-submit gp-proceed-reg">
//                                 {this.props.textConstants['cabinet.proceed.registration']}
//                             </button>
//                         </div>
//                         {/*<div className={"error_block_wrap " + (this.state.errorHandler ? 'hidden' : '')}>*/}
//                         {/*<p>*/}
//                         {/*{this.props.textConstants['cabinet.oops.something.went.wrong']}*/}
//                         {/*</p>*/}
//                         {/*</div>*/}
//                     </div>
//                     :
//                     ''
//                 }
//
//             </div>
//         );
//     }
// }
//
// export default PasswordRestore;