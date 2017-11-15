import React from 'react';
// import Cookies from 'universal-cookie';
import {browserHistory} from 'react-router'

import CabinetHeaderNoMenu from '../../components/cabinetComponents/CabinetHeaderNoMenu'
// import * as Helpers from '../../models'
// import Footer from '../../components/Footer'

if (process.env.WEBPACK) {
    require('./styles.scss');
}

class ChangeEmailConfirm extends React.Component {

    backToMainPage(){
        browserHistory.push('/')
    }

    constructor(props) {
        super(props)
        this.state = {
            responceMessage:''
        }
        this.backToMainPage = this.backToMainPage.bind(this)
    }

    componentWillMount() {
        if (this.props.location.query.code && this.props.location.query.email) {
            let code = this.props.location.query.code;
            let email = this.props.location.query.email;

            let promise = this.props.actions.sendConfirmEmailRequest(code, email);
            promise.then(()=>{

                this.setState({
                    responceMessage:this.props.mainContent.emailConfirmResponceFromApi.message,
                    validAccess:true
                })
            })
        }

        this.setState({validAccess: true})
    }

    render() {

        return (
            <div>

                <CabinetHeaderNoMenu
                    actions={this.props.actions}
                    mainContent={this.props.mainContent}
                    content={this.props.content}
                    textConstants={this.props.textConstants}
                    openSideBar={this.props.openSideBar}
                    cabinetPageData={this.props.mainContent.cabinetPageData}
                />

                <div className="container">
                    <div className={'row ' + (this.state.validAccess ? '' : 'hidden')}>
                        <p className="cm-title">{this.props.textConstants['cabinet.email.confirmationTitle']}</p>
                        <p>{this.props.textConstants[this.state.responceMessage]}</p>
                        <hr/>

                        <div className="">
                            <button onClick={this.backToMainPage}
                                    className="btn btn-blue setting-submit gp-proceed-reg">
                                {this.props.textConstants['common.back.to.main.page']}
                            </button>
                        </div>
                    </div>

                    <div className={"loading " + (this.state.validAccess ? 'hidden' : '')}/>
                </div>
            </div>
        );
    }
}

export default ChangeEmailConfirm;