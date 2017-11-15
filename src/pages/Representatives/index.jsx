import React from 'react';
import {Helmet} from "react-helmet";
import * as Helpers from '../../models'

import RepresentativesPresenter from '../../components/RepresentativesPresenter'
// import RepresentativesTable from '../../components/RepresentativesTable'
import Cookies from 'universal-cookie';

class Representatives extends React.Component {

    setQuerySearch(e) {
        e.preventDefault();

        this.setState({
            querySearch: e.target.value,
        },()=>{
            this.filterByInputSearch(this.state.querySearch);
        });
    }

    filterByInputSearch(searchQuery) {
        let queryResult = [], resultArray, agentsArray;
        let trimmedQuery = Helpers._trimSpaces(searchQuery.toLowerCase());

        this.props.mainContent.representativesList.map((data) => {
            agentsArray = [];
            data.agents.map((agents, index) => {
                if ((!!agents.login && agents.login.indexOf(trimmedQuery) != -1)
                    ||
                    (!!agents.phone && agents.phone.indexOf(trimmedQuery) != -1)
                    ||
                    (!!agents.skype && agents.skype.indexOf(trimmedQuery) != -1)
                ) {
                    agentsArray.push(agents);
                }
            });

            if (agentsArray.length) {
                data.agents = agentsArray;
                queryResult.push(data);
            }
        });

        if(trimmedQuery.length == 0){
            this.setState({searchResult: this.props.mainContent.representativesList, showClear:false});
        }else{
            this.setState(
                {searchResult: queryResult, showClear:true}
                );
        }

        // return queryResult;
    }

    selectCountry(index) {
        if (this.state.selectedCountryIndex == index) {
            this.setState({
                selectedCountryIndex: -1,
            })
        } else {
            this.setState({
                selectedCountryIndex: index,
            })
        }
    }

    setTokenToState() {
        if (process.env.WEBPACK) {
            const cookies = new Cookies();
            this.setState({
                token: typeof cookies.get('APIToken') != 'undefined'
            });
        }
    }

    clearSearch(){
        this.setState({
            searchResult: this.props.mainContent.representativesList ? this.props.mainContent.representativesList : [],
            querySearch: '',
            showClear:false
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            querySearch: '',
            searchResult: [],
            selectedCountryIndex: -1,
            token: false,
            showClear: false,
        }
        this.setQuerySearch = this.setQuerySearch.bind(this)
        this.filterByInputSearch = this.filterByInputSearch.bind(this)
        this.selectCountry = this.selectCountry.bind(this)
        this.setTokenToState = this.setTokenToState.bind(this)
        this.clearSearch = this.clearSearch.bind(this)
    }

    componentWillMount() {
        let promise = this.props.actions.gerRepresentatives();
        promise.then(() => {
            this.setState({
                searchResult: this.props.mainContent.representativesList ? this.props.mainContent.representativesList : []
            })
        })
    }

    componentDidMount() {
        if (process.env.WEBPACK) {
            window.scrollTo(0, 0)

            let header = document.getElementById('header');
            let scrollTop = document.querySelector('.scroll-top');
            window.addEventListener('scroll', function (e) {
                if (header) {
                    header.classList[window.scrollY > 1 ? 'add' : 'remove']('fixed');
                }
                if (scrollTop) {
                    scrollTop.classList[window.scrollY > 1 ? 'add' : 'remove']('short');
                }
            });

            this.setTokenToState();
        }
    }

    componentWillUnmount() {
        //Remove event listeners
        if (process.env.WEBPACK) {
            let header = document.getElementById('header');
            let scrollTop = document.querySelector('.scroll-top');
            window.removeEventListener('scroll', function (e) {
                if (header) {
                    header.classList[window.scrollY > 1 ? 'add' : 'remove']('fixed');
                }
                if (scrollTop) {
                    scrollTop.classList[window.scrollY > 1 ? 'add' : 'remove']('short');
                }
            });
        }
    }

    componentWillReceiveProps(){
        this.setTokenToState();
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
                <div className="page-top repres-page">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12">
                                <h1>{this.props.textConstants['repr.title']}</h1>
                                <p className="page-top-text">{this.props.textConstants['repr.text']}</p>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-md-offset-3 text-center">
                                <div className="repres-input-block">
                                    <div className="search-form">
                                        <div className="repres-search-cover">
                                            <input type="text"
                                                   className="form-control faq-input"
                                                   value={this.state.querySearch}
                                                   placeholder={this.props.textConstants['common.search']}
                                                   onChange={this.setQuerySearch}
                                            />
                                            <label htmlFor="search-input"/>
                                            <i className={"cursor fa fa-times clearSearchRepr " + (this.state.showClear ? '' : 'hidden')} aria-hidden="true" onClick={this.clearSearch}/>
                                        </div>
                                    </div>

                                    {typeof this.props.mainContent.representativesPopUpData != 'undefined' && this.state.token && !this.props.mainContent.representativesPopUpData.partner ?
                                        <button onClick={() => {
                                            this.props.openSideBar('applyRepr')
                                        }} className="cursor btn sweep-to-right">
                                            {this.props.textConstants['index.representatives.apply.for.representation']}
                                        </button>
                                        : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {this.props.mainContent.representativesLoaded ?

                    <div className="page-content" id="repres">
                        <Helmet>
                            <meta charSet="utf-8"/>
                            <title>{this.props.mainContent.content.representativesPage ? this.props.mainContent.content.representativesPage.metaTitle : ''}</title>
                            <meta name="description"
                                  content={this.props.mainContent.content.representativesPage ? this.props.mainContent.content.representativesPage.metaDescription : ''}/>
                            <meta name="keywords"
                                  content={this.props.mainContent.content.representativesPage ? this.props.mainContent.content.representativesPage.metaKeywords : ''}/>
                            <meta property="og:url" content={fullUrl}/>
                            <meta property="og:type" content="article"/>
                            <meta property="og:title"
                                  content={this.props.mainContent.content.representativesPage ? this.props.mainContent.content.representativesPage.metaTitle : ''}/>
                            <meta property="og:description"
                                  content={this.props.mainContent.content.representativesPage ? this.props.mainContent.content.representativesPage.metaDescription : ''}/>
                            <meta property="og:image"
                                  content={this.props.mainContent.content.representativesPage ? this.props.mainContent.content.representativesPage.picture : ''}/>
                            <meta content='1391915080924626' property='fb:app_id'/>
                        </Helmet>

                        <div className="container">
                            <div className="row">
                                <div className="col-xs-12">
                                    <div id="repres-block">

                                        {this.state.searchResult
                                        &&
                                        this.state.searchResult.length
                                        ?
                                        this.state.searchResult.map((el, key) => {
                                            return <RepresentativesPresenter
                                                textConstants={this.props.textConstants}
                                                isActive={this.state.selectedCountryIndex == key}
                                                keyIndex={key}
                                                selectCountry={this.selectCountry}
                                                key={key}
                                                country={el}/>
                                        })
                                        :
                                            <div className="empty_bar"><p>{this.props.textConstants['index.representatives.empty']}</p></div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    : <div className="block-loader"/>}

            </div>
        );
    }
}

export default Representatives;