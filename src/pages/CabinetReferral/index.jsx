import React from 'react';
import Cookies from 'universal-cookie';
import NavLink from '../../components/NavLink'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import * as Helpers from '../../models'
import {Helmet} from "react-helmet";

import CabinetReferralsPresenter from '../../components/cabinetComponents/CabinetReferralsPresenter'
import CabinetReferralsLevelsList from '../../components/cabinetComponents/CabinetReferralsLevelsList'

class CabinetReferral extends React.Component {

    _trimSpaces(str) {
        str = str.replace(/^\s+/, '');
        for (let i = str.length - 1; i >= 0; i--) {
            if (/\S/.test(str.charAt(i))) {
                str = str.substring(0, i + 1);
                break;
            }
        }
        return str;
    }

    _clearSelect() {
        let arrayOfTransactions = !!this.props.mainContent.referralsList && this.props.mainContent.referralsList.result && this.props.mainContent.referralsList.list.length ? JSON.parse(JSON.stringify(this.props.mainContent.referralsList.list)) : []
        let sortedArray = arrayOfTransactions.sort(this.sortByDate);
        let endtDate = sortedArray.length ? sortedArray[0].registerDate : moment().subtract(350, 'days');
        let startDate = sortedArray.length ? sortedArray[sortedArray.length - 1].registerDate : moment().add(50, 'days');

        this.setState({
            searchResult: arrayOfTransactions,
            pagesCount: Math.ceil(this.props.mainContent.referralsList.list / 10),
            startDate: moment(startDate, 'DD.MM.YYYY'),
            endDate: moment(endtDate, 'DD.MM.YYYY'),
            searchQuery: '',
            resetCheckbox: true,
            allLevels: [1, 2, 3, 4, 5, 6, 7]
        }, () => {
            this.state.resetCheckbox = false;
        })
    }

    clearInputSelect() {
        this.setState({
            searchQuery: '',
        }, () => {
            this.filterByInputSearch('')
        })
    }

    _compareDates(dateTimeA, dateTimeB) {

        let momentA = moment(dateTimeA, "DD.MM.YYYY");
        let momentB = moment(dateTimeB, "DD.MM.YYYY");

        if (momentA > momentB) return 1;
        else if (momentA < momentB) return -1;
        else return 0;
    }

    _mergeArraysByEqualVal(array1, array2, array3) {
        let result, mediumResult;

        mediumResult = array1.filter((val) => {
            return array2.indexOf(val) != -1;
        });
        result = mediumResult.filter((val) => {
            return array3.indexOf(val) != -1;
        });

        return result;
    }

    _copyToClipboard() {

        this.setState({linkCopied: true});

        setTimeout(() => {
            this.setState({linkCopied: false});
        }, 1500);

        window.getSelection().removeAllRanges();
        let to_copy = this.clipboard;

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

    handleStartChange(date) {
        this.setState({startDate: date}, () => {
            this.filterByDate()
        })
    }

    handleEndChange(date) {
        this.setState({endDate: date}, () => {
            this.filterByDate()
        })
    }

    setQuerySearch(e) {
        e.preventDefault();
        this.setState({
            searchQuery: e.target.value,
        });
        this.filterByInputSearch(e.target.value)
    }

    setQueryLevel(levelIndex, checked) {

        let proxyArray = this.state.allLevels;
        let resultArray;
        if (checked) {
            if (proxyArray.indexOf(levelIndex) == -1) {
                proxyArray.push(levelIndex);
            }
            resultArray = proxyArray;
        } else {
            resultArray = proxyArray.filter(function (el) {
                return el != levelIndex
            })
        }
        this.setState({allLevels: resultArray}, () => {
            this.filterByLevel()
        })
    }

    filterByInputSearch(searchQuery, boolFlag = false) {
        let queryResult = [], resultArray;
        searchQuery = this._trimSpaces(searchQuery.toLowerCase());
        this.props.mainContent.referralsList.list.map((data) => {
            if (data.login.toLowerCase().indexOf(searchQuery) != -1
                ||
                data.email.indexOf(searchQuery) != -1
            ) {
                queryResult.push(data);
            }
        });

        if (!boolFlag) {
            let filteredByDateArray = this.filterByDate(true);
            let filteredByLevelArray = this.filterByLevel(true);
            resultArray = this._mergeArraysByEqualVal(filteredByDateArray, queryResult, filteredByLevelArray);
            this.setState({
                searchResult: resultArray,
            });
        } else {
            this.setState({
                searchResult: queryResult,
            });
        }
        return queryResult;
    }

    filterByDate(boolFlag = false) {
        let queryResult = [];
        let resultArray;
        let startDate = moment(this.state.startDate._d).format('DD.MM.YYYY');
        let endDate = moment(this.state.endDate._d).format('DD.MM.YYYY');

        this.props.mainContent.referralsList.list.map((data) => {
            let itemsDate = data.registerDate;
            if ((this._compareDates(itemsDate, startDate) == 1 || this._compareDates(itemsDate, startDate) == 0) && (this._compareDates(itemsDate, endDate) == -1 || this._compareDates(itemsDate, endDate) == 0))
                queryResult.push(data);
        });

        if (!boolFlag) {
            let filteredByDateArray = this.filterByInputSearch(this.state.searchQuery, true);
            let filteredByLevelArray = this.filterByLevel(true);
            resultArray = this._mergeArraysByEqualVal(filteredByDateArray, queryResult, filteredByLevelArray);
            this.setState({searchResult: resultArray});
        } else {
            this.setState({searchResult: queryResult});
        }
        return queryResult;
    }

    filterByLevel(boolFlag = false) {
        let queryResult = [];

        this.props.mainContent.referralsList.list.map((data) => {
            if (this.state.allLevels.indexOf(data.level) != -1) {
                queryResult.push(data);
            }
        });

        if (!boolFlag) {
            let resultArray;
            let filteredByInputArray = this.filterByInputSearch(this.state.searchQuery, true);
            let filteredByDateArray = this.filterByDate(true);
            resultArray = this._mergeArraysByEqualVal(filteredByDateArray, queryResult, filteredByInputArray);
            this.setState({searchResult: resultArray});
        } else {
            this.setState({searchResult: queryResult});
        }
        return queryResult;
    }

    openCallendar(whichCallendar) {
        if (whichCallendar == 'from') {
            this._calendarFrom.setOpen(true);
            this._calendarTill.setOpen(false);
        } else {
            this._calendarFrom.setOpen(false);
            this._calendarTill.setOpen(true);
        }
    }

    sortByDate(a, b) {
        return moment(b.registerDate, 'DD.MM.YYYY') - moment(a.registerDate, 'DD.MM.YYYY')
    }

    constructor(props) {
        super(props)
        this.state = {
            searchResult: [],
            pagesCount: 0,
            startDate: moment().subtract(350, 'days'),
            endDate: moment().add(50, 'days'),
            searchQuery: '',
            linkCopied: false,
            resetCheckbox: false,
            allLevels: [1, 2, 3, 4, 5, 6, 7]
        };

        this.filterByDate = this.filterByDate.bind(this)
        this.filterByInputSearch = this.filterByInputSearch.bind(this)
        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)
        this.filterByLevel = this.filterByLevel.bind(this)
        this.setQuerySearch = this.setQuerySearch.bind(this)
        this.setQueryLevel = this.setQueryLevel.bind(this)
        this._copyToClipboard = this._copyToClipboard.bind(this)
        this.openCallendar = this.openCallendar.bind(this)
        this._clearSelect = this._clearSelect.bind(this)
        this.clearInputSelect = this.clearInputSelect.bind(this)
    }

    componentWillMount() {
        let lang = 'ru'
        if (process.env.WEBPACK) {
            const cookies = new Cookies();
            if (!!cookies.get('language')) {
                lang = cookies.get('language');
            }
            moment.locale(lang)
            this.setState({
                referralLink: window.location.origin + '/?referralLink=' + this.props.mainContent.cabinetPageData.login,
            })
        }
    }

    componentDidMount() {
        this.ifMounted = true;
        let promise = this.props.actions.getReferrals();
        promise.then(() => {

            let arrayOfTransactions = !!this.props.mainContent.referralsList && this.props.mainContent.referralsList.result && this.props.mainContent.referralsList.list.length ? JSON.parse(JSON.stringify(this.props.mainContent.referralsList.list)) : []
            let sortedArray = arrayOfTransactions.sort(this.sortByDate);
            let endtDate = sortedArray.length ? sortedArray[0].registerDate : moment().subtract(350, 'days');
            let startDate = sortedArray.length ? sortedArray[sortedArray.length - 1].registerDate : moment().add(50, 'days');

            if (this.ifMounted == true) {
                this.setState({
                    searchResult: sortedArray,
                    pagesCount: Math.ceil(this.props.mainContent.referralsList.list / 10),
                    startDate: moment(startDate, 'DD.MM.YYYY'),
                    endDate: moment(endtDate, 'DD.MM.YYYY')
                })
            }
        })
    }

    componentWillUnmount() {
        this.ifMounted = false;
    }

    render() {

        let levelsArray = [];

        if (!!this.props.mainContent.referralsList && this.props.mainContent.referralsList.result) {
            for (let i = 1; i <= this.props.mainContent.referralsList.lvlMax; i++) {
                levelsArray.push(<CabinetReferralsLevelsList resetCheckbox={this.state.resetCheckbox} key={i}
                                                             levelIndex={i}
                                                             setQueryLevel={this.setQueryLevel}/>)
            }
        }
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
                    <title>{this.props.mainContent.content.cabinetPage.metaTitle}</title>
                    <meta name="description" content={this.props.mainContent.content.cabinetPage.metaDescription}/>
                    <meta name="keywords" content={this.props.mainContent.content.cabinetPage.metaKeywords}/>
                    <meta property="og:url" content={fullUrl}/>
                    <meta property="og:type" content="article"/>
                    <meta property="og:title" content={this.props.mainContent.content.cabinetPage.metaTitle}/>
                    <meta property="og:description"
                          content={this.props.mainContent.content.cabinetPage.metaDescription}/>
                    <meta property="og:image" content={this.props.mainContent.content.cabinetPage.metaPicture}/>
                </Helmet>

                <div className="cabinet-content" id="cabinet-referral">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12">
                                {this.props.mainContent.cabinetPageData
                                &&
                                this.props.mainContent.cabinetPageData.bannerView
                                &&
                                this.props.mainContent.cabinetPageData.bannerView.length
                                    ?
                                    this.props.mainContent.cabinetPageData.bannerView.map((el, key) => {
                                        if (el.alias == 'referrals' && el.picture != null) {
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

                                <p className="cabinet-header">{this.props.textConstants['cabinet.my.ref.link']}
                                    <NavLink to={'/cabinet'} className="back-to-home" onlyActiveOnIndex>
                                        <i className="fa fa-angle-left"
                                           aria-hidden="true"/>&nbsp;{this.props.textConstants['common.back.to.main.page']}
                                    </NavLink>
                                </p>
                                <div className="referral-tab">
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-5">
                                            <p className="referral-text">{this.props.textConstants['cabinet.ref.page.text']}</p>
                                        </div>
                                        <div className="referral-input">
                                            <div className="col-xs-12 col-sm-5">
                                                <input type="text"
                                                       className="form-control referral_page_input js-copyinput"
                                                       readOnly=""
                                                       ref={(clipboard) => {
                                                           this.clipboard = clipboard
                                                       }}
                                                       defaultValue={this.state.referralLink}
                                                />
                                            </div>

                                            <div
                                                className={"animated-copy-link w100 col-xs-12 col-sm-2 " + (this.state.linkCopied ? 'success' : '')}>
                                                <button
                                                    onClick={this._copyToClipboard}
                                                    className="btn btn-cabinet copy-link js-copybtn">

                                                    <div className="copyIcon">
                                                        <span
                                                            className="copyText">{this.props.textConstants['cabinet.copy']}</span>
                                                        <i className="fa fa-check"/>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {!!this.props.mainContent.referralsList && this.props.mainContent.referralsList.result && this.props.mainContent.referralsList.list.length ?
                                <div className="col-xs-12">
                                    <p className="cabinet-header">{this.props.textConstants['cabinet.my.referalls']}</p>
                                    <div id="filter" className="filter filter-referral">
                                        <form className="filter-form" role="form" method="post" action="#"
                                              name="filter_form">
                                            <div className="row form-group">
                                                <div className="col-xs-12 col-sm-4 col-md-2 col-lg-2 p-r-0">
                                                    <label
                                                        className="filter-label">{this.props.textConstants['common.from']}</label>
                                                    <div className="input-group date" id="datetimepicker1">
                                                        <DatePicker
                                                            ref={(c) => this._calendarFrom = c}
                                                            className="form-control calendar-input"
                                                            selected={this.state.startDate}
                                                            onChange={this.handleStartChange}
                                                            dateFormat="DD.MM.YYYY"
                                                            //calendarClassName="rasta-stripes"
                                                        />

                                                        <span className="input-group-addon">
                                                        <span className="referral-icon" onClick={() => {
                                                            this.openCallendar('from')
                                                        }}/>
                                                    </span>
                                                    </div>
                                                </div>
                                                <div className="col-xs-12 col-sm-4 col-md-2 col-lg-2 p-l-0">
                                                    <label
                                                        className="filter-label">{this.props.textConstants['common.to']}</label>
                                                    <div className="input-group date" id='datetimepicker2'>
                                                        <DatePicker
                                                            ref={(c) => this._calendarTill = c}
                                                            className="form-control calendar-input"
                                                            selected={this.state.endDate}
                                                            onChange={this.handleEndChange}
                                                            dateFormat="DD.MM.YYYY"
                                                        />

                                                        <span className="input-group-addon">
                                                        <span className="referral-icon" onClick={() => {
                                                            this.openCallendar('till')
                                                        }}/>
                                                    </span>
                                                    </div>
                                                </div>
                                                <div className="col-xs-12 col-sm-4 col-md-3 col-lg-3 col-lg-offset-1">
                                                    <ul className="filter-levels">
                                                        {levelsArray.map((el) => {
                                                            return el
                                                        })}
                                                    </ul>
                                                </div>
                                                <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                                                    <div className="input-group filter-search">
                                                        <input type="text"
                                                               className="form-control "
                                                               name="filter_search"
                                                               id="filter_search"
                                                               value={this.state.searchQuery}
                                                               onChange={this.setQuerySearch}
                                                               placeholder={this.props.textConstants['common.search']}/>
                                                        <span className="input-group-addon">
                                                        <span className="search-icon"/>
                                                    </span>
                                                        <span className="input-group-clear-select cursor"
                                                              onClick={this.clearInputSelect}>
                                                        <i className="fa fa-times-circle greyColor" aria-hidden="true"/>
                                                    </span>
                                                    </div>
                                                </div>
                                                <div className="col-xs-12 col-sm-12 col-md-1 col-lg-1 rel-pos">
                                                        <span className="input-group-clear-all-select cursor"
                                                              onClick={this._clearSelect}>
                                                               {this.props.textConstants['cabinet.ClearSearch']}
                                                         </span>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                :
                                ''
                            }
                        </div>

                        <div className="row">
                            <div className="col-xs-12">
                                <div className="table-responsive">
                                    {!!this.state.searchResult && this.state.searchResult.length ?
                                        <table className="table table-cabin table-referral">
                                            <tbody>
                                            <tr className="title_table">
                                                <th>{this.props.textConstants['cabinet.login']} </th>
                                                <th>{this.props.textConstants['cabinet.email']} </th>
                                                <th>{this.props.textConstants['cabinet.activity']} </th>
                                                <th>{this.props.textConstants['cabinet.reg.date']}</th>
                                                <th>{this.props.textConstants['cabinet.level']} </th>
                                                <th>{this.props.textConstants['cabinet.dep.amount']}</th>
                                                <th>{this.props.textConstants['cabinet.your.bonus']}</th>
                                            </tr>
                                            {this.state.searchResult.map((el, key) => {
                                                let pageIndex = ++key
                                                return <CabinetReferralsPresenter
                                                    textConstants={this.props.textConstants}
                                                    pageIndex={pageIndex}
                                                    key={key}
                                                    list={el}/>
                                            })}
                                            <tr className="footer_table">
                                                <td colSpan="7"/>
                                            </tr>

                                            </tbody>

                                        </table>
                                        :
                                        <div className="empty_bar">
                                            <p>{this.props.textConstants['cabinet.no.referrals.exist']}</p></div>
                                    }

                                </div>
                                {this.props.mainContent.referralsListLoaded ? '' : <div className="block-loader"/>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CabinetReferral;