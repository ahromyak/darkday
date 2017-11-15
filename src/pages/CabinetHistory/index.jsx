import React from 'react';
import NavLink from '../../components/NavLink'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import * as Helpers from '../../models'
import Cookies from 'universal-cookie'
import {Helmet} from "react-helmet";

import CabinetHistoryDataPresenter from '../../components/cabinetComponents/CabinetHistoryDataPresenter'

if (process.env.WEBPACK) {
    require('./styles.scss');
}

class CabinetHistory extends React.Component {

    _searchByDate(dataArray) {
        let result = [];

        // let startDate = this.state.startDate.utc().valueOf();
        // let endDate = this.state.endDate.utc().valueOf();

        let startDate = moment(this.state.startDate._d).format('DD.MM.YYYY');
        let endDate = moment(this.state.endDate._d).format('DD.MM.YYYY');

        dataArray.map((data) => {

            // let startDatePiont = this._compare(parseFloat(data.date * 1000), startDate);
            // let endDatePiont = this._compare(parseFloat(data.date * 1000), endDate);

            let convertedDate = moment(parseFloat(data.date*1000)).format('DD.MM.YYYY');
            let startDatePiont = this._compare(convertedDate, startDate);
            let endDatePiont = this._compare(convertedDate, endDate);

            if ((startDatePiont == 1 || startDatePiont == 0) && (endDatePiont == -1 || endDatePiont == 0))
            {
                result.push(data);
            }
        });
        return result;
    }

    _searchByInput(dataArray) {
        let result = [];

        dataArray.map((data) => {
            if ((data.sum !== null && data.sum.toLowerCase().indexOf(this._trimSpaces(this.state.searchQuery.toLowerCase())) !== -1)
                ||
                (data.batch !== null && data.batch.toLowerCase().indexOf(this._trimSpaces(this.state.searchQuery.toLowerCase())) !== -1)
            )
                result.push(data);
        });
        return result;
    }

    _searchByLevel(dataArray) {
        let result = [];
        if(this.state.pickedType === -1){
            result = JSON.parse(JSON.stringify(dataArray));
        }else{
            dataArray.map((data) => {
                if (data.operationIdTypeId == this.state.pickedType) {
                    result.push(data);
                }
            });
        }
        return result;
    }

    searchItems() {
        let queryResult = this._searchByDate(this._searchByInput(this._searchByLevel(this.props.mainContent.transactionsHistory.transactions)));

        this.setState({searchResult: queryResult,});
    }

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

        let arrayOfTransactions = this.props.mainContent.transactionsHistory && this.props.mainContent.transactionsHistory.transactions && this.props.mainContent.transactionsHistory.transactions.length ? JSON.parse(JSON.stringify(this.props.mainContent.transactionsHistory.transactions)) : []
        let sortedArray = arrayOfTransactions.sort(this.sortByDateRevers);

        let endtDate ;
        let startDate ;

         endtDate = sortedArray.length ? sortedArray[0].date : moment().subtract(50, 'days');
         startDate = sortedArray.length ? sortedArray[sortedArray.length - 1].date : moment().add(50, 'days');

        startDate = new Date(startDate*1000);
        endtDate = new Date(endtDate*1000);
        this.setState(
            {
                searchResult: sortedArray,
                startDate: moment(startDate.getDate() + '.' + (startDate.getMonth() + 1) + '.' + startDate.getFullYear() + '','DD.MM.YYYY'),
                endDate: moment(endtDate.getDate() + '.' + (endtDate.getMonth() + 1) + '.' + endtDate.getFullYear() + '','DD.MM.YYYY'),
                searchQuery: '',
                dropValue: this.props.textConstants['cabinet.history.sorting.type'],
                pickedType: -1,
                activeDrop: false,
            }
        )
    }

    clearInputSelect(){
        this.setState({
            searchQuery: '',
        }, () => {
            this.searchItems();
        });
    }

    _compare(dateTimeA, dateTimeB) {
        // let momentA = dateTimeA;
        // let momentB = dateTimeB;
        //
        // if (momentA > momentB) return 1;
        // else if (momentA < momentB) return -1;
        // else return 0;

        let momentA = moment(dateTimeA, "DD.MM.YYYY");
        let momentB = moment(dateTimeB, "DD.MM.YYYY");

        if (momentA > momentB) return 1;
        else if (momentA < momentB) return -1;
        else return 0;
    }

    setQuerySearch(e) {
        e.preventDefault();
        this.setState({
            searchQuery: e.target.value,
        }, () => {
            this.searchItems();
        });
    }

    pickType(key, value) {
        if(key === null && value === null){
            this.setState({
                pickedType: -1,
                activeDrop: false,
                dropValue: this.props.textConstants['cabinet.history.showAll'],
                transactions: this.props.mainContent.transactionsHistory && this.props.mainContent.transactionsHistory.transactions ? this.props.mainContent.transactionsHistory.transactions : []
            },()=>{
                this.searchItems();
            });
        }else{
            this.setState({
                pickedType: key,
                activeDrop: false,
                dropValue: this.props.textConstants[value]
            }, () => {
                this.searchItems();
            })
        }
    }

    openDrop() {
        this.setState({
            activeDrop: !this.state.activeDrop
        })
    }

    handleStartChange(date) {
        this.setState({startDate:date}, () => {
            this.searchItems();
        })
    }

    handleEndChange(date) {
        this.setState({endDate: date}, () => {
            this.searchItems();
        })
    }

    /**
     * Set the wrapper ref
     */
    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({activeDrop: false})
        }
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

    sortByDateRevers(a, b) {
        return parseFloat(b.date) - parseFloat(a.date)
    }

    setDateToDatePicker(transactionsHistory){
        let arrayOfTransactions = transactionsHistory && transactionsHistory.transactions && transactionsHistory.transactions.length ? JSON.parse(JSON.stringify(transactionsHistory.transactions)) : []
        let sortedArray = arrayOfTransactions.sort(this.sortByDateRevers);
        let endtDate = sortedArray.length ? sortedArray[0].date : moment().subtract(50, 'days');
        let startDate = sortedArray.length ? sortedArray[sortedArray.length - 1].date : moment().add(50, 'days');

        if (this.historyPage) {

            startDate = new Date(parseFloat(startDate*1000));
            endtDate = new Date(parseFloat(endtDate*1000));

            this.setState(
                {
                    searchResult: sortedArray,
                    startDate: moment(startDate.getDate() + '.' + (startDate.getMonth() + 1) + '.' + startDate.getFullYear(),'DD.MM.YYYY'),
                    endDate: moment(endtDate.getDate() + '.' + (endtDate.getMonth() + 1) + '.' + endtDate.getFullYear(),'DD.MM.YYYY'),
                }
            )
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            startDate: moment().subtract(50, 'days'),
            endDate: moment().add(50, 'days'),
            searchResult: [],
            searchQuery: '',
            dropValue: this.props.textConstants['cabinet.history.sorting.type'],
            pickedType: -1,
            activeDrop: false,
            transactions: this.props.mainContent.transactionsHistory && this.props.mainContent.transactionsHistory.transactions ? this.props.mainContent.transactionsHistory.transactions : []
        };

        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)
        this.pickType = this.pickType.bind(this)
        this.setQuerySearch = this.setQuerySearch.bind(this)
        this.openDrop = this.openDrop.bind(this)
        this.handleClickOutside = this.handleClickOutside.bind(this)
        this.setWrapperRef = this.setWrapperRef.bind(this)
        this.openCallendar = this.openCallendar.bind(this)
        this._clearSelect = this._clearSelect.bind(this)
        this.searchItems = this.searchItems.bind(this)
        this._searchByLevel = this._searchByLevel.bind(this)
        this._searchByInput = this._searchByInput.bind(this)
        this._searchByDate = this._searchByDate.bind(this)
        this.setDateToDatePicker = this.setDateToDatePicker.bind(this)
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
        }

        let promise = this.props.actions.getTransactionsHistory();
        promise.then(() => {

            this.setDateToDatePicker(this.props.mainContent.transactionsHistory);

        })
    }

    componentDidMount() {
        if (process.env.WEBPACK) {
            document.addEventListener('mousedown', this.handleClickOutside);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(typeof nextProps.mainContent.transactionsHistory !== 'undefined'){

            if (nextProps.mainContent.transactionsHistory !== this.props.mainContent.transactionsHistory && typeof this.props.mainContent.transactionsHistory != 'undefined') {

                this.setDateToDatePicker(nextProps.mainContent.transactionsHistory);

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
            <div ref={(historyPage) => {
                this.historyPage = historyPage
            }}>

                <Helmet>
                    <meta charSet="utf-8"/>
                    <title>{this.props.mainContent.content.history.metaTitle}</title>
                    <meta name="description" content={this.props.mainContent.content.history.metaDescription}/>
                    <meta name="keywords" content={this.props.mainContent.content.history.metaKeywords}/>
                    <meta property="og:url" content={fullUrl}/>
                    <meta property="og:type" content="article"/>
                    <meta property="og:title" content={this.props.mainContent.content.history.metaTitle}/>
                    <meta property="og:description" content={this.props.mainContent.content.history.metaDescription}/>
                    <meta property="og:image" content={this.props.mainContent.content.history.metaPicture}/>
                </Helmet>

                <div className="cabinet-content" id="cabinet-referral">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12">

                                <p className="cabinet-header">{this.props.textConstants['cabinet.operations.history']}
                                    <NavLink to={'/cabinet'} className="back-to-home">
                                        <i className="fa fa-angle-left"
                                           aria-hidden="true"/>&nbsp;{this.props.textConstants['common.back.to.main.page']}
                                    </NavLink>
                                </p>

                                {this.props.mainContent.transactionsHistory
                                    ?
                                    <div id="filter" className="filter filter-referral">
                                        <form className="filter-form" role="form" method="post" action="#"
                                              name="filter_form">
                                            {typeof this.props.mainContent.transactionsHistory != 'undefined'
                                            &&
                                            typeof this.props.mainContent.transactionsHistory.transactions != 'undefined'
                                            &&
                                            this.props.mainContent.transactionsHistory.transactions.length
                                                ?
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
                                                            />

                                                            <span className="input-group-addon">
                                                        <span className="referral-icon" onClick={() => {
                                                            this.openCallendar('from')
                                                        }}/>
                                                    </span>
                                                        </div>
                                                    </div>
                                                    <div className="col-xs-12 col-sm-4 col-md-2 col-lg-2 p-l-0">

                                                        <label className="filter-label">
                                                            {this.props.textConstants['common.to']}
                                                        </label>

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

                                                    <div className="col-xs-12 col-sm-4 col-md-3 col-lg-3">
                                                        <div ref={this.setWrapperRef}
                                                             className={"form-control transactions-history__container " + (this.state.activeDrop ? 'active' : '')}>
                                                            <div className="transactions-history__block"
                                                                 onClick={this.openDrop}>
                                                                <span>{this.state.dropValue}</span>
                                                                <i className="fa fa-caret-down align-fl-center"/>
                                                            </div>

                                                            <ul className="transactions-history__list">

                                                                <li onClick={() => {
                                                                        this.pickType(null, null)
                                                                    }}
                                                                >{this.props.textConstants['cabinet.history.showAll']}</li>

                                                                {this.props.mainContent.transactionsHistory
                                                                &&
                                                                this.props.mainContent.transactionsHistory.filters
                                                                &&
                                                                this.props.mainContent.transactionsHistory.filters.length
                                                                    ?
                                                                    this.props.mainContent.transactionsHistory.filters.map((el, key) => {
                                                                        return <li onClick={() => {
                                                                            this.pickType(el.key, el.value)
                                                                        }}
                                                                                   key={key}>{this.props.textConstants[Helpers._trimSpaces(el.value)]}</li>
                                                                    })
                                                                    :
                                                                    <div className="empty_bar">
                                                                        <p>{this.props.textConstants['cabinet.no.payment.history']}</p>
                                                                    </div>
                                                                }

                                                                {/*{this.props.mainContent.transactionsHistory ? '' : <div className="block-loader"/> }*/}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                                                        <div className="input-group filter-search">
                                                            <input type="text"
                                                                   className="form-control pr-30"
                                                                   onChange={this.setQuerySearch}
                                                                   value={this.state.searchQuery}
                                                                //value={this.state.searchQuery}
                                                                   name="filter_search"
                                                                   id="filter_search"
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
                                                :
                                                <div className="empty_bar">
                                                    <p>{this.props.textConstants['cabinet.no.payment.history']}</p>
                                                </div>
                                            }

                                        </form>
                                    </div>
                                    :
                                    <div className="block-loader"/>
                                }

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                {this.props.mainContent.transactionsHistory
                                &&
                                this.props.mainContent.transactionsHistory.transactions
                                &&
                                this.props.mainContent.transactionsHistory.transactions.length
                                    ?
                                    <CabinetHistoryDataPresenter
                                        actions={this.props.actions}
                                        mainContent={this.props.mainContent}
                                        textConstants={this.props.textConstants}
                                        transactionCollection={this.state.searchResult}/>
                                    :
                                    ''
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default CabinetHistory;