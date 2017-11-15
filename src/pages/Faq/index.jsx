import React from 'react'
import {Helmet} from "react-helmet"
import FaqCategorys from '../../components/FaqCategorys'

class Faq extends React.Component {
    toggleShow() {
        this.setState({
            show: !this.state.show
        })
    }

    chooseCategory(value, id) {
        this.setState({
            categoryValue: value,
            categorysList: this.props.content.faqPage.categories.find((el) => {
                return el.categoryId == id
            }).faqs
        })
    }

    clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        let copy = obj.constructor();
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }

    faqSearch(e) {
        let queryResult = [];
        let middleObj = [];
        this.props.content.faqPage.categories.map((el, key) => {
            el.faqs.map((innerEl, innerKey) => {
                if (innerEl.text.toLowerCase().indexOf(e.target.value) != -1 || innerEl.title.toLowerCase().indexOf(e.target.value) != -1) {
                    middleObj = this.clone(innerEl);
                    if (innerEl.text.toLowerCase().indexOf(e.target.value) != -1) {
                        middleObj.text = innerEl.text.replace(new RegExp(e.target.value, 'ig'), (match) => {
                            return '<span class="highlight">' + match + '</span>'
                        })
                    }
                    if (innerEl.title.toLowerCase().indexOf(e.target.value) != -1) {
                        middleObj.title = innerEl.title.replace(new RegExp(e.target.value, 'ig'), (match) => {
                            return '<span class="highlight">' + match + '</span>'
                        })
                    }
                    queryResult.push(middleObj);
                }
            })
        })

        this.setState({
            searchValue: e.target.value,
            startSearch: e.target.value.length > 0,
            filteredData: queryResult
        })
    }

    clearSelect(){
        this.setState({
            searchValue: '',
            startSearch:0,
            filteredData: null
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
            this.setState({
                show: false
            })
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            categoryValue: '',
            categorysList: [],
            searchValue: '',
            startSearch: false,
            filteredData: null
        }
        this.toggleShow = this.toggleShow.bind(this)
        this.chooseCategory = this.chooseCategory.bind(this)
        this.faqSearch = this.faqSearch.bind(this)
        this.handleClickOutside = this.handleClickOutside.bind(this)
        this.setWrapperRef = this.setWrapperRef.bind(this)
        this.clearSelect = this.clearSelect.bind(this)
    }

    componentWillMount() {
        this.setState({
            categoryValue: this.props.content.faqPage.categories[0] ? this.props.content.faqPage.categories[0].category : '',
            categorysList: this.props.content.faqPage.categories[0] ? this.props.content.faqPage.categories[0].faqs : ''
        })
    }

    componentDidMount() {

        if (process.env.WEBPACK) {
            window.scrollTo(0, 0)
            window.addEventListener('scroll', function (e) {
                if (document.getElementById('header')) {
                    document.getElementById('header').classList[window.scrollY > 1 ? 'add' : 'remove']('fixed');
                }
                if (document.querySelector('.scroll-top')) {
                    document.querySelector('.scroll-top').classList[window.scrollY > 1 ? 'add' : 'remove']('short');
                }
            });

            document.addEventListener('mousedown', this.handleClickOutside);

        }
    }

    componentWillUnmount() {
        //Remove event listeners
        if (process.env.WEBPACK) {
            window.removeEventListener('scroll', function (e) {
                if (document.getElementById('header')) {
                    document.getElementById('header').classList[window.scrollY > 1 ? 'add' : 'remove']('fixed');
                }
                if (document.querySelector('.scroll-top')) {
                    document.querySelector('.scroll-top').classList[window.scrollY > 1 ? 'add' : 'remove']('short');
                }
            });
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
            <section>

                <Helmet>
                    <meta charSet="utf-8"/>
                    <title>{this.props.mainContent.content.faqPage.metaTitle}</title>
                    <meta name="description" content={this.props.mainContent.content.faqPage.metaDescription}/>
                    <meta name="keywords" content={this.props.mainContent.content.faqPage.metaKeywords}/>
                    <meta property="og:url" content={fullUrl}/>
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={this.props.mainContent.content.faqPage.metaTitle}/>
                    <meta property="og:description" content={this.props.mainContent.content.faqPage.metaDescription}/>
                    <meta property="og:image" content={this.props.mainContent.content.faqPage.metaPicture}/>
                    <meta content='1391915080924626' property='fb:app_id'/>
                </Helmet>

                <div className="page-top scroll-top faq-page">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12">
                                <h1>{this.props.textConstants['faq.faq']}</h1>
                                <p className="page-top-text">{this.props.textConstants['faq.text']}</p>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-md-offset-3 text-center">
                                <div className="faq-input-block">
                                    <div className="faq-search-cover">
                                        <input type="text"
                                               autoComplete="off"
                                               className="pr40 form-control faq-input"
                                               name="search"
                                               id="search-input"
                                               value={this.state.searchValue}
                                               placeholder={this.props.textConstants['faq.place.holder.search']}
                                               onChange={this.faqSearch}
                                        />
                                        <label htmlFor="search-input"/>
                                        <a href="javascript:void(0)" id="clear-search" className={this.state.startSearch ? ' visible' : ''}
                                           onClick={this.clearSelect} title="Clear search"/>
                                    </div>

                                    <div className="custom_select">
                                        <div className="current_option" data-value="1" onClick={this.toggleShow} ref={this.setWrapperRef}>
                                            <span>{this.state.categoryValue ? this.state.categoryValue : 'Loading'}</span>
                                            <b><i className="fa fa-angle-down"/></b>
                                            <ul className={"custom_options " + (this.state.show ? '' : 'hidden')}>
                                                {this.props.content.faqPage.categories ? this.props.content.faqPage.categories.map((el, key) => {
                                                    return (<li onClick={() => {
                                                        this.chooseCategory(el.category, el.categoryId)
                                                    }} key={key}> {el.category}</li>)
                                                }) : <div className="empty_bar"><p>{this.props.textConstants['index.faq.empty']}</p></div>}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-content" id="faq">

                    <div className={"faq-content-block " + (this.state.startSearch ? "" : "hidden")}>
                        <div className="container">
                            <div className="row">
                                <div className="col-xs-12">
                                    <div className="faq">
                                        <div className="faq-block active">
                                            {this.state.filteredData && this.state.filteredData.length ? this.state.filteredData.map((el, key) => {
                                                return (<FaqCategorys list={el} key={key}/>)
                                            }) : <div className="empty_bar">
                                                <p>{this.props.textConstants['index.faq.no.search']}</p>
                                            </div>}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={"faq-content-block " + (this.state.startSearch ? "hidden" : "")}>
                        <div className="container">
                            <div className="row">
                                <div className="col-xs-12">
                                    <div className="faq">
                                        <div className="faq-block active">
                                            {this.state.categorysList ? this.state.categorysList.map((el, key) => {
                                                return (<FaqCategorys list={el} key={key}/>)
                                            }) : <div className="empty_bar"><p>{this.props.textConstants['index.faq.empty']}</p></div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Faq;
