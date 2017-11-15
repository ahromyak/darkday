import React from 'react'
import NavLink from '../../components/NavLink'

import CabinetHeaderNoMenu from '../../components/cabinetComponents/CabinetHeaderNoMenu'
// import {Helmet} from "react-helmet";

// import SidebarMenu from '../../components/SidebarMenu'
// import SidebarSignIn from '../../components/SidebarSignIn'
// import SidebarSignUp from '../../components/SidebarSignUp'
// import SidebarRestore from '../../components/SidebarRestore'
// import SidebarSocial from '../../components/SidebarSocial'
// import SidebarPaySys from '../../components/SidebarPaySys'

import noUiSlider from 'nouislider'
import wNumb from 'wnumb'

if (process.env.WEBPACK) {
    require('./styles.scss');
}

class CreateDeposit extends React.Component {
    countHandler(val) {
        let slider = document.getElementById('createDepositSlider');
        let value = slider.noUiSlider.get();
        if (val == 'd') {
            value = value * 1 - 4
        } else {
            value = value * 1 + 4
        }
        slider.noUiSlider.set(value);
    }

    acceptAmount(e){
        // let slider = document.getElementById('createDepositSlider');
        // if(this.isNumeric(e.target.value*1) && e.target.value*1 <= slider.noUiSlider.options.range.max[0] && e.target.value*1 >= slider.noUiSlider.options.range.min[0]){
        //     slider.noUiSlider.set(e.target.value*1);
        // }
    }

    isNumeric(val) {
        return typeof(val) === 'number' && !isNaN(val);
    }

    withdrawMoney(){
        this.withdrawBtn.setAttribute("disabled", "disabled");
    }

    constructor(props) {
        super(props)
        this.state = {
            pickerVal: 0
        }
        this.countHandler = this.countHandler.bind(this)
        this.acceptAmount = this.acceptAmount.bind(this)
        this.withdrawMoney = this.withdrawMoney.bind(this)
    }

    componentDidMount() {

        // update range
        // slider.noUiSlider.updateOptions({
        //     range: {
        //         'min': 20,
        //         'max': 30
        //     }
        // });

        let slider = document.getElementById('createDepositSlider');
        let range_all_sliders = {
            'min': [0],
            '10%': [0.01],
            '20%': [0.05],
            '30%': [0.1],
            '40%': [0.5],
            '50%': [1],
            '60%': [5],
            '70%': [10],
            '80%': [50],
            '90%': [100],
            'max': [550]
        };
        noUiSlider.create(slider, {
            start: 20,
            connect: [true, false],
            range: range_all_sliders,
            step: 0.001,
            format: wNumb({
                decimals: 4,
                // prefix  : '€ '
            }),
            pips: {
                mode: 'values',
                values: [0, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5, 10, 50, 100, 500],
                density: 100,
                stepped: true,
                format: wNumb({
                    decimals: 3,
                    // prefix: '$'
                })
            }
        });

        slider.noUiSlider.on('update', (values, handle) => {
            this.setState({pickerVal: values[handle]});
        });
    }

    componentWillUnmout(){
        let slider = document.getElementById('createDepositSlider');
        slider.noUiSlider.destroy()
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

                <div className="center-childrens">
                    <div className="container cabinet-content ">

                        {/*<Helmet>*/}
                        {/*<meta charSet="utf-8"/>*/}
                        {/*<title>Withdraw money</title>*/}
                        {/*<link rel="canonical" href="http://faq page.com/example"/>*/}
                        {/*</Helmet>*/}

                        <div className="row ">
                            <div className="col-xs-12">
                                <p className="cabinet-header">пополнить баланс
                                    <NavLink to={'/cabinet'} className="back-to-home" onlyActiveOnIndex>
                                        <i className="fa fa-angle-left" aria-hidden="true"/>&nbsp;{this.props.textConstants['common.back.to.main.page']}
                                        </NavLink>
                                </p>
                            </div>
                        </div>

                        <hr/>

                        <div className="">
                            <div className="">
                                <div className="sum-picker__container wp-container">

                                    <div className="wp-label">
                                        <p className="withdraw-subheader">Выберите сумму</p>
                                    </div>

                                    <div className="wp-input">
                                        <div className="wp-sum-picker__wrap">
                                            <div className="sum-picker__minus"
                                                 onClick={() => {
                                                     this.countHandler('d')
                                                 }}/>
                                            <p className="wp-sum-picker__value">{this.state.pickerVal}</p>
                                            <div className="sum-picker__plus"
                                                 onClick={() => {
                                                     this.countHandler('i')
                                                 }}/>
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
                                <div className="withdrawSlider" id="createDepositSlider"/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-12">
                                <div className="" id="pips-steps"/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-12 col-md-4">
                                <button className="btn blue-big-btn">
                                    РеинвестирОвать
                                </button>
                            </div>
                            <div className="col-xs-12 col-md-4">
                                <button className="btn grey-big-btn"
                                        ref={(withdrawBtn)=>{this.withdrawBtn = withdrawBtn}}
                                        onClick={this.withdrawMoney}
                                >
                                    Вывести
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateDeposit;
