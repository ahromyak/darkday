import React from 'react';
import {browserHistory} from 'react-router'
import * as Helpers from '../../models'
import {Helmet} from "react-helmet";

import DepositHeader from '../../components/DepositHeader'
import DepositsList from '../../components/DepositsList'

import InvestTabsCol from '../../components/InvestTabsCol'

if (process.env.WEBPACK) {
    require('./styles.scss');
}

class SelectDeposit extends React.Component {

    pickDepositPlan(index) {

        //selecting plan by key;
        this.setState({
            indexPlan:index,
            index:index,
            showLoader:true
        },()=>{
            let promise = this.props.actions.createDeposit(null, this.props.location.query.reinvest, this.props.content.dynamicData.plans[this.state.indexPlan].id, 3, 0, window.location.origin);
            promise.then(()=>{
                if(this.props.mainContent.createDepositResponce.result == false){
                    Helpers.showNotify('info', this.props.textConstants[this.props.mainContent.createDepositResponce.message]);
                }
                this.setState({
                    showLoader:false
                })
                 browserHistory.push('/cabinet');
            })
        })
    }

    createDeposit() {

    }

    constructor(props) {
        super(props)
        this.state = {
            index:0,
            indexPlan:-1,
            showLoader:false,
            plansAreEmpty:false,
            depositPlanLabels: {'blue':'deposit-blue', 'pink':'deposit-purple', 'orange':'deposit-orange'},
            showComponent: !!this.props.location.query.reinvest
        }
        this.pickDepositPlan = this.pickDepositPlan.bind(this)
        this.createDeposit = this.createDeposit.bind(this)
    }

    componentWillMount() {
        if (!this.props.content.dynamicData.plans.length) {
            this.setState({plansAreEmpty:true})
            Helpers.showNotify('info', this.props.textConstants['System.CantCreateNewDepositNow'])
        }
    }

    componentDidMount() {

    }

    render() {
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

                <DepositHeader mainContent={this.props.mainContent} actions={this.props.actions} textConstants={this.props.textConstants}/>

                <div className={"cabinet-content "  + (this.state.plansAreEmpty ? 'hidden' : '')}>
                    <div className="container">
                        <div className="">
                            <div>
                                <h2 className="text-left">{this.props.textConstants['deposit.title']}</h2>
                            </div>
                        </div>

                        <div className="deposit__flex-container">

                            <div className="deposit-left-block">

                                <div className={"depositBlock  "}>
                                    {/*<div className="disabled__block"/>*/}
                                    <div className="deposit-head">
                                        {/*<div className="deposit-step">{this.state.stepCounts['plan']}</div>*/}
                                        <div className="deposit-title">
                                            {this.props.textConstants['deposit.step.a']}
                                        </div>
                                    </div>

                                    <div className="depositBlock-left">

                                        {this.props.content.dynamicData.plans && this.props.content.dynamicData.plans.length ? this.props.content.dynamicData.plans.map((el, key) => {
                                            return <DepositsList keyL={key}
                                                                 key={key}
                                                                 mainContent={this.props.mainContent}
                                                                 textConstants={this.props.textConstants}
                                                                 pickDepositPlan={this.pickDepositPlan}
                                                                 indexState={this.state.indexPlan}
                                                                 el={el}
                                                                 picked={this.state.indexPlan == key}
                                                                 label={this.state.depositPlanLabels[el.color]}/>
                                        }):()=>{}}
                                    </div>
                                </div>
                            </div>

                            <div className="deposit-right-block">
                                <div className="cabinet-invest-tabs cabinet-invest-tabs-row">
                                    {this.props.content.dynamicData.plans && this.props.content.dynamicData.plans.map((plan, key) => {
                                        return <InvestTabsCol key={key}
                                                              visible={this.state.index == key}
                                                              plan={plan}
                                                              depositPlanLabels={this.state.depositPlanLabels}
                                                              depositlabel={this.state.depositPlanLabels[this.state.index]}
                                                              textConstants={this.props.textConstants}/>
                                    })}
                                    <div className="invest-tab" id="delta">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"whitebg " + (this.state.showLoader ? '' : 'hidden')}><div className={"fixed-loader " + (this.state.showLoader ? '' : 'hidden')}/></div>
            </div>
        );
    }
}

export default SelectDeposit;
