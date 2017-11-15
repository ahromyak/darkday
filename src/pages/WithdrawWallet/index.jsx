import React from 'react'
import {Link} from 'react-router'
// import {Helmet} from "react-helmet";

// import SidebarMenu from '../../components/SidebarMenu'
// import SidebarSignIn from '../../components/SidebarSignIn'
// import SidebarSignUp from '../../components/SidebarSignUp'
// import SidebarRestore from '../../components/SidebarRestore'
// import SidebarSocial from '../../components/SidebarSocial'
// import SidebarPaySys from '../../components/SidebarPaySys'


if (process.env.WEBPACK) {
    require('./styles.scss');
}

class WithdrawWallet extends React.Component {


    acceptAmount(e) {
    }

    isNumeric(val) {
        return typeof(val) === 'number' && !isNaN(val);
    }

    withdrawMoney() {
        this.withdrawBtn.setAttribute("disabled", "disabled");
    }

    insertValue(e) {

       // console.log(e.target.value);
    }

    insertWallet(e) {
        //console.log(e.target.value);
    }

    constructor(props) {
        super(props)
        this.state = {
            pickerVal: 0,
            pickerWallet: 'dsfdDSfdsfSDF'
        }
        // this.countHandler = this.countHandler.bind(this)
        this.insertValue = this.insertValue.bind(this)
        this.withdrawMoney = this.withdrawMoney.bind(this)
        this.insertWallet = this.insertWallet.bind(this)
    }

    componentDidMount() {
    }

    componentWillUnmout() {
    }

    render() {
        return (
            <div>
                <div className="container cabinet-content ">

                    <div className="row ">
                        <div className="col-xs-12">
                            <p className="cabinet-header">Вывeсти средства
                                {/*<a className="back-to-home" href="cabinet.html"> Back to main page</a>*/}
                                <Link to={'/cabinet'} className="back-to-home">{this.props.textConstants['common.back.to.main.page']}</Link>
                            </p>
                        </div>
                    </div>

                    <hr/>

                    <div className="row ">
                        <div className="col-sm-12 col-md-7">
                            <p className="ww-descr">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto culpa cumque
                                dolore doloremque et facilis harum illo impedit in, laboriosam minima modi, nulla
                                obcaecati officiis quae qui vel vitae.
                            </p>
                        </div>
                    </div>

                    <div className="">
                        <div className="ww-input__container">
                            <div className="sum-picker__container wp-container">

                                <div className="ww-label">
                                    <p className="withdraw-subheader">Сумма:</p>
                                </div>

                                <div className="wp-input">
                                    <div className="ww-sum-picker__wrap">
                                        <input type="text"
                                               className="ww-sum-picker__value ww-number"
                                               onChange={this.insertValue}
                                               value={this.state.pickerVal}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ww-input__container">
                            <div className="sum-picker__container wp-container">

                                <div className="ww-label">
                                    <p className="withdraw-subheader">Введите адресс:</p>
                                </div>

                                <div className="wp-input">
                                    <div className="ww-sum-picker__wrap">
                                        <input type="text"
                                               className="ww-sum-picker__value ww-letters"
                                               onChange={this.insertWallet}
                                               value={this.state.pickerWallet}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12 col-md-4">
                            <button className="btn blue-big-btn"
                                    ref={(withdrawBtn) => {
                                        this.withdrawBtn = withdrawBtn
                                    }}
                                    onClick={this.withdrawMoney}
                            >
                                Подтвердить
                            </button>
                        </div>
                        <div className="col-xs-12 col-md-4">
                            <button className="btn grey-big-btn"
                            >
                                Отменить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default WithdrawWallet;
