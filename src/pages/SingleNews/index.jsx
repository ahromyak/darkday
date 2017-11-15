import React from 'react'
import {Helmet} from "react-helmet";
import Cookies from 'universal-cookie';

import {
    ShareButtons,
    ShareCounts,
    generateShareIcon
} from 'react-share';

class SingleNews extends React.Component {

    addLike(id) {

        const cookies = new Cookies();

        if (typeof cookies.get('APIToken') != 'undefined' && !this.props.mainContent.singleNews.isUserLike) {
            let promise = this.props.actions.addLike(id);
            promise.then(() => {
                this.props.mainContent.singleNews.isUserLike = true;
                this.props.mainContent.singleNews.likes++;
                this.forceUpdate();
            })
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            newsLoaded: false
        }
        this.addLike = this.addLike.bind(this);
    }

    componentWillMount() {
        if (!!this.props.params.id) {
            this.props.actions.getSingleNews(this.props.params.id);
        }else{
            this.props.actions.emptySingleNews();
        }
    }

    componentDidMount(){
        if (process.env.WEBPACK) {
            if (!document.querySelector('#fullpage')) {

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
    }

    componentWillUnmount(){
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
        }else{
            fullUrl = process.env.webSiteUrl
        }

        const {
            FacebookShareButton,
            TwitterShareButton,
            TelegramShareButton,
        } = ShareButtons;

        const FacebookIcon = generateShareIcon('facebook');
        const TwitterIcon = generateShareIcon('twitter');
        const TelegramIcon = generateShareIcon('telegram');

        return (
            <section>
                {typeof this.props.mainContent.singleNews != 'undefined' ?
                <div>

                    <Helmet>
                        <meta charSet="utf-8"/>
                        <title>{this.props.mainContent.singleNews.metaTitle}</title>
                        <meta name="description" content={this.props.mainContent.singleNews.metaDescription}/>
                        <meta name="keywords" content={this.props.mainContent.singleNews.metaKeywords}/>
                        <meta property="og:url" content={fullUrl}/>
                        <meta property="og:type" content="article"/>
                        <meta property="og:title" content={this.props.mainContent.singleNews.metaTitle}/>
                        <meta property="og:description" content={this.props.mainContent.singleNews.metaDescription}/>
                        <meta property="og:image" content={this.props.mainContent.singleNews.picture}/>
                    </Helmet>

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

                    <div className="page-content" id="news-page">
                        <div className="container">
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                                    <div className="news-block">
                                        <div className="news-top">
                                            <div className="news-image">
                                                <img src={this.props.mainContent.singleNews.picture}/>
                                            </div>
                                        </div>
                                        <div className="news-bottom">

                                            <div className="news-share">
                                                <FacebookShareButton url={fullUrl}>
                                                    <FacebookIcon size={30} round={true}/>
                                                </FacebookShareButton>
                                                <TwitterShareButton url={fullUrl}>
                                                    <TwitterIcon size={30} round={true}/>
                                                </TwitterShareButton>
                                                <TelegramShareButton url={fullUrl}>
                                                    <TelegramIcon size={30} round={true}/>
                                                </TelegramShareButton>
                                            </div>

                                            <div
                                                className={"news-like " + (this.props.mainContent.singleNews.isUserLike ? 'liked' : '')}
                                                onClick={() => {
                                                    this.props.mainContent.singleNews.isUserLike ? '' : this.addLike(this.props.mainContent.singleNews.id)
                                                }}>
                                                {this.props.mainContent.singleNews.likes}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-6 col-md-8 col-lg-8">
                                    <div className="news-page">
                                        <div className="news-date">
                                            {this.props.mainContent.singleNews.publishDate}</div>
                                        <p className="news-title">
                                            {this.props.mainContent.singleNews.title}</p>
                                        <p className="news-text"
                                           dangerouslySetInnerHTML={{__html: this.props.mainContent.singleNews.textFull}}/>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                : <div className="block-loader"/>}
            </section>
        );
    }
}

export default SingleNews;
