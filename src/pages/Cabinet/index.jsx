import React from 'react'
import NavLink from '../../components/NavLink'
import {Helmet} from "react-helmet";

import CurrencyPick from '../../components/cabinetComponents/CurrencyPick'
import DepositListPresenter from '../../components/cabinetComponents/DepositListPresenter'
import DepositEmptyListPresenter from '../../components/cabinetComponents/DepositEmptyListPresenter'
import CabinetStatsView from '../../components/cabinetComponents/CabinetStatsView'

if (process.env.WEBPACK) {
    require('./index.scss')
}

class Cabinet extends React.Component {
    openDropDown() {
        this.setState({
            openDrop: !this.state.openDrop
        })
    }

    pickCurrency(index) {
        this.setState({
            index: index
        })
    }

    sortDepositsBy(type, val) {
        let array = [];
        // let arrayCopy = JSON.parse(JSON.stringify(this.state.depositsArray));
        let arrayCopy = this.state.depositsArray;
        switch (type) {
            case "date-asc":
                array = arrayCopy.sort((a, b) => {
                    return a.creationDateTimeSpan - b.creationDateTimeSpan
                });
                break;
            case "date-des":
                array = arrayCopy.sort((a, b) => {
                    return b.creationDateTimeSpan - a.creationDateTimeSpan
                });
                break;
            case "sum-asc":
                array = arrayCopy.sort((a, b) => {
                    return a.startValue - b.startValue
                });
                break;
            case "sum-des":
                array = arrayCopy.sort((a, b) => {
                    return b.startValue - a.startValue
                });
                break;
        }
        this.setState({
            depositsArray: array,
            sortBy: val
        });
    }

    changeView(val) {
        val == 'plateView' ?
            this.setState({
                row: false,
                plate: true,
                listView: true
            })
            :
            this.setState({
                row: true,
                plate: false,
                listView: false
            })
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({openDrop: false})
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            openDrop: false,
            listView: 'plateView',
            row: false,
            plate: true,
            sortBy: null,
            depositsArray: [],
            index: 1,
            depositsLoaded: false,
        }
        this.openDropDown = this.openDropDown.bind(this)
        this.pickCurrency = this.pickCurrency.bind(this)
        this.changeView = this.changeView.bind(this)
        this.sortDepositsBy = this.sortDepositsBy.bind(this)
        this.handleClickOutside = this.handleClickOutside.bind(this)
        this.setWrapperRef = this.setWrapperRef.bind(this)
    }

    componentWillMount() {

        let promise = this.props.actions.getDeposits();
        promise.then(() => {
            if (this.cabinetPage) {
                this.setState({
                    depositsArray: this.props.mainContent.userDepositsCollection ? JSON.parse(JSON.stringify(this.props.mainContent.userDepositsCollection.deposits)) : [],
                    depositsLoaded: true
                })
            }
        })
    }

    componentDidMount() {
        if (process.env.WEBPACK) {
            document.addEventListener('mousedown', this.handleClickOutside);
        }
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.mainContent.userDepositsCollection != this.props.mainContent.userDepositsCollection && typeof this.props.mainContent.userDepositsCollection != 'undefined') {
            if (this.cabinetPage) {
                this.setState({
                    depositsArray: nextProps.mainContent.userDepositsCollection ? JSON.parse(JSON.stringify(nextProps.mainContent.userDepositsCollection.deposits)) : [],
                    depositsLoaded: true
                })
            }
        }
    }

    componentWillUnmount() {
        if (process.env.WEBPACK) {
            document.removeEventListener('mousedown', this.handleClickOutside);
        }
    }

    render() {

        let fullUrl = '/';

        if (process.env.WEBPACK) {
            fullUrl = window.location.href;
        } else {
            fullUrl = process.env.webSiteUrl
        }

        return (
            <div className="" ref={(cabinetPage) => {
                this.cabinetPage = cabinetPage
            }}>

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

                <div className="container cabinet-statistic-wrap">
                    <div className="cabinet-statistics">

                        {this.props.mainContent.cabinetPageData.statView
                        &&
                        this.props.mainContent.cabinetPageData.statView.length
                            ?
                            this.props.mainContent.cabinetPageData.statView.map((el, key) => {
                                return <CabinetStatsView key={key} el={el}/>
                            })
                            : ''}
                    </div>
                </div>

                <div className="cabinet-content no-padding" id="cabinet-main">
                    <div className="container">

                        <div className="cabinet-btn_wrap text-center">
                            <NavLink className="btn btn-cabinet-green-big" to={`/deposit`}>
                                {this.props.textConstants['cabinet.create.new.deposit']}
                            </NavLink>
                            {/*<button className="btn btn-cabinet-green-big">{this.props.textConstants['cabinet.create.new.deposit']}</button>*/}
                        </div>

                        <div className={"row " + (this.state.listView ? 'plateView' : 'rowView')}>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">

                                {this.props.mainContent.cabinetPageData
                                &&
                                this.props.mainContent.cabinetPageData.bannerView
                                &&
                                this.props.mainContent.cabinetPageData.bannerView.length
                                    ?
                                    this.props.mainContent.cabinetPageData.bannerView.map((el, key) => {
                                        if (el.alias == 'deposits' && el.picture != null) {
                                            return (
                                                <div key={key} className="referral-banner"
                                                     style={{backgroundImage: 'url(' + el.picture + ')'}}>
                                                    <p>{el.title}</p>

                                                    {el.isPopup ?
                                                        el.popupType == "SendTicket" ?

                                                            <button onClick={() => {
                                                                this.props.openSideBar('ticket')
                                                            }} className="cursor btn sweep-to-right">
                                                                {this.props.textConstants[el.btnConst]}
                                                            </button>

                                                            :

                                                            el.popupType == 'BecomeRegionalRepresentative' ?

                                                                <button onClick={() => {
                                                                    this.props.openSideBar('applyRepr')
                                                                }} className="cursor btn sweep-to-right">
                                                                    {this.props.textConstants[el.btnConst]}
                                                                </button>

                                                                :

                                                                ''
                                                        :

                                                        el.url !== null
                                                            ?
                                                            <a target="_blank" className="cursor btn sweep-to-right"
                                                               href={'//' + el.url}>{this.props.textConstants[el.btnConst]}</a>
                                                            :
                                                            ''
                                                    }
                                                </div>
                                            )
                                        }
                                    })
                                    : ''
                                }
                            </div>

                            {typeof this.state.depositsArray != 'undefined' && this.state.depositsArray.length ?

                                <div className="col-xs-12 cabinet-sortbar__container">
                                    <div className="cabinet-sortbar__left">
                                        <p className="cabinet-sortbar__drop-down-title">{this.props.textConstants['cabinet.sort.by']}</p>
                                        <div className={"cabinet-sortbar__drop-down"}
                                             onClick={this.openDropDown}>

                                            <p className="cabinet-sortbar__placeholder">
                                                {this.state.sortBy != null ? this.state.sortBy : this.props.textConstants['cabinet.sort.date.asc']}
                                            </p>

                                            <i className="fa fa-angle-down cabinet-sortbar__open-drop"
                                               aria-hidden="true"/>

                                            <div ref={this.setWrapperRef}
                                                 className={"cabinet-sortbar__drop-down-list " + (this.state.openDrop ? "open" : "")}>
                                                <ul>
                                                    <li onClick={() => {
                                                        this.sortDepositsBy('date-asc', this.props.textConstants['cabinet.sort.date.asc'])
                                                    }}>{this.props.textConstants['cabinet.sort.date.asc']}</li>
                                                    <li onClick={() => {
                                                        this.sortDepositsBy('date-des', this.props.textConstants['cabinet.sort.date.des'])
                                                    }}>{this.props.textConstants['cabinet.sort.date.des']}</li>
                                                    <li onClick={() => {
                                                        this.sortDepositsBy('sum-asc', this.props.textConstants['cabinet.sort.sum.asc'])
                                                    }}>{this.props.textConstants['cabinet.sort.sum.asc']}</li>
                                                    <li onClick={() => {
                                                        this.sortDepositsBy('sum-des', this.props.textConstants['cabinet.sort.sum.des'])
                                                    }}>{this.props.textConstants['cabinet.sort.sum.des']}</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <CurrencyPick
                                            keyL={1}
                                            pickCurrency={this.pickCurrency}
                                            picked={this.state.index == 1}
                                        />

                                        {/*<CurrencyPick*/}
                                        {/*keyL={2}*/}
                                        {/*pickCurrency={this.pickCurrency}*/}
                                        {/*picked={this.state.index == 2}*/}
                                        {/*/>*/}

                                    </div>
                                    <div className="cabinet-sortbar__right">
                                        <div className={"cabinet-sortbar__row " + (this.state.row ? 'active' : '')}
                                             onClick={() => {
                                                 this.changeView('rowView')
                                             }}/>
                                        <div className={"cabinet-sortbar__plate " + (this.state.plate ? 'active' : '')}
                                             onClick={() => {
                                                 this.changeView('plateView')
                                             }}/>
                                    </div>
                                </div>

                                :

                                ''}

                            {typeof this.state.depositsArray != 'undefined' && this.state.depositsArray.length ? this.state.depositsArray.map((el, key) => {
                                    return <div key={key}
                                                className={' ' + (this.state.listView ? 'col-xs-12 col-sm-6 col-md-4' : 'col-xs-12')}>
                                        <DepositListPresenter
                                            openMenu={this.props.openMenu}
                                            mainContent={this.props.mainContent}
                                            actions={this.props.actions}
                                            valueProp={el} textConstants={this.props.textConstants}/>
                                    </div>
                                })
                                : ''}

                            {this.state.depositsLoaded ? '' : <div className="col-xs-12">
                                <div className="block-loader"/>
                            </div>}

                            <div className={' ' + (this.state.listView ? 'col-xs-12 col-sm-6 col-md-4' : 'col-xs-12')}>
                                <DepositEmptyListPresenter textConstants={this.props.textConstants}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Cabinet;
