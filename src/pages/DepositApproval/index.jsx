import React from 'react';
import NavLink from '../../components/NavLink'
// import Cookies from 'universal-cookie';
// import { browserHistory } from 'react-router'

import CabinetHeaderNoMenu from '../../components/cabinetComponents/CabinetHeaderNoMenu'
// import Footer from '../../components/Footer'

if (process.env.WEBPACK) {
    require('./styles.scss');
}

class DepositApproval extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            width: 0
        }
        // this.setPassword = this.setPassword.bind(this)
    }

    componentWillMount() {

        let fillWidth = 0;

        this.setState({
            approves:this.props.params.approves,
            approvesNeeded:this.props.params.approvesNeeded,
        },()=>{
            if (this.state.approvesNeeded != 0) {
                fillWidth = Math.floor(parseFloat(this.state.approves) * 100 / this.state.approvesNeeded);
            } else {
                fillWidth = 100;
            }

            this.setState({width: fillWidth});
        })
    }

    render() {
        return (
            <div>

                <CabinetHeaderNoMenu
                    actions={this.props.actions}
                    mainContent={this.props.mainContent}
                    content={this.props.content}
                    textConstants={this.props.textConstants}
                />

                <div className="container">

                    <div className="container">
                        <p className="cm-title">{this.props.textConstants['cabinet.deposit.approval.page']}</p>
                        <hr/>
                        <div className="cm-description">
                            <p>{this.props.textConstants['cabinet.deposit.approval.page.text']}
                            </p>
                        </div>

                        <div className="cm-content__block">
                            <div className="da-amount__block">
                                <span className="da-amount__label">{this.props.textConstants['cabinet.sum']}</span>
                                <div className="da-amount__value-block">
                                    <p>{this.props.params.sum ? this.props.params.sum : 0} </p>
                                </div>
                            </div>
                        </div>

                        <div className="progressConatiner">
                            <div className="progressConatiner__bar">
                                <div className="progressConatiner__fill" style={{width: this.state.width + '%'}}/>
                            </div>
                        </div>

                        <div className="back-to-home-btn__container">
                            <p className="cabinet-header">

                            </p>
                            <NavLink to={'/cabinet'} className="back-to-home-btn">
                                <i className="fa fa-angle-left"
                                   aria-hidden="true"/>&nbsp;{this.props.textConstants['common.back.to.main.page']}
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DepositApproval;