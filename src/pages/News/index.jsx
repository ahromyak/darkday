import React from 'react'
import {Helmet} from "react-helmet";
import {browserHistory} from 'react-router';
import ReactPaginate from 'react-paginate';

import NewsPresenter from '../../components/NewsPresenter'

class News extends React.Component {

    getNewsArray(from) {
        this.setState({showLoader:true})
        let promise = this.props.actions.getNews(from, this.state.newsPerPage)
        promise.then(() => {
            this.setState({
                newsList: this.props.mainContent.newsList,
                newsCount: this.props.mainContent.newsCount,
                pagesCount: Math.ceil(this.props.mainContent.newsCount / this.state.newsPerPage),
                showLoader:false
            })
        })
    }

    handlePageClick(e) {
        let from = e.selected;
        browserHistory.push('/news/' + (from + 1));
        this.getNewsArray(++from);
    }

    constructor(props) {
        super(props)
        this.state = {
            newsCount: 0,
            newsList: [],
            pagesCount: 0,
            newsPerPage: 15, //If changed check sitemap.js file for sitemap generation
            page: 1,
            showLoader: true,
        }
        this.getNewsArray = this.getNewsArray.bind(this)
        this.handlePageClick = this.handlePageClick.bind(this)
    }

    componentWillMount() {

        !!this.props.params.page && this.setState({page: this.props.params.page});

        let promise = this.props.actions.getNewsCount();
        promise.then(() => {
            if (!!this.props.params.page && (this.props.params.page * this.state.newsPerPage <= this.props.mainContent.newsCount)) {
                this.getNewsArray(this.props.params.page);
            } else {
                this.getNewsArray(this.state.page);
            }
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
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // only update likes will be changed
        if (prevProps.mainContent.newsList !== this.props.mainContent.newsList) {
            this.setState({
                newsList: this.props.mainContent.newsList,
            })
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
                    <title>{this.props.mainContent.content.newsPage.metaTitle}</title>
                    <meta name="description" content={this.props.mainContent.content.newsPage.metaDescription}/>
                    <meta name="keywords" content={this.props.mainContent.content.newsPage.metaKeywords}/>
                    <meta property="og:url" content={fullUrl}/>
                    <meta property="og:type" content="article"/>
                    <meta property="og:title" content={this.props.mainContent.content.newsPage.metaTitle}/>
                    <meta property="og:description" content={this.props.mainContent.content.newsPage.metaDescription}/>
                    <meta property="og:image" content={this.props.mainContent.content.newsPage.metaPicture}/>
                </Helmet>

                <div>
                    <div className="page-top scroll-top news-all">
                        <div className="container">
                            <div className="row">
                                <div className="col-xs-12">
                                    <h1>{this.props.textConstants['news.title']}</h1>
                                    <p className="page-top-text">
                                        {this.props.textConstants['news.header.text']}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="page-content" id="news">
                        <div className="container">
                            <div className="row">

                                {this.state.newsList.length ? this.state.newsList.map((el, key) => {
                                    return (<NewsPresenter
                                        mainContent={this.props.mainContent}
                                        actions={this.props.actions}
                                        newsList={el} key={key}/>)
                                }) : <div className="empty_bar">
                                    <p>{this.props.textConstants['index.no.news']}</p>
                                </div>}
                                <div className={"block-loader " + (this.state.showLoader ? '' : 'hidden')}/>
                            </div>
                        </div>
                    </div>

                    {this.state.newsList && this.state.pagesCount > 1 ?
                    <div className="paginator">
                        <ReactPaginate previousLabel={"<<"}
                                       nextLabel={">>"}
                                       breakLabel={<a href="">...</a>}
                                       breakClassName={"break-me"}
                                       pageCount={this.state.pagesCount}
                                       initialPage={( this.state.page * 1 - 1)}
                                       marginPagesDisplayed={2}
                                       pageRangeDisplayed={5}
                                       disableInitialCallback={true}
                                       onPageChange={this.handlePageClick}
                                       containerClassName={"pagination"}
                                       subContainerClassName={"pages pagination"}
                                       activeClassName={"active"}/>
                    </div>
                    :''}
                </div>

            </section>
        );
    }
}

export default News;