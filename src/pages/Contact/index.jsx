import React from 'react'
import {Helmet} from "react-helmet";

// import SignalR from '../../components/SignalR'

const Contact = React.createClass({
    getInitialState: function () {
        return {
        }
    },

    componentWillMount:function(){

    },

    componentDidMount: function () {
        if (process.env.WEBPACK) {
            window.scrollTo(0, 0)
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
    },

    componentWillUnmount: function () {
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
    },

    render() {
        let fullUrl = '/';

        if (process.env.WEBPACK) {
            fullUrl = window.location.href;
        }else{
            fullUrl = process.env.webSiteUrl
        }

        return (
            <section>
                {/*<SignalR/>*/}
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>{this.props.mainContent.content.contactPage.metaTitle}</title>
                    <meta name="description" content={this.props.mainContent.content.contactPage.metaDescription}/>
                    <meta name="keywords" content={this.props.mainContent.content.contactPage.metaKeywords}/>
                    <meta property="og:url" content={fullUrl}/>
                    <meta property="og:type" content="article"/>
                    <meta property="og:title" content={this.props.mainContent.content.contactPage.metaTitle}/>
                    <meta property="og:description" content={this.props.mainContent.content.contactPage.metaDescription}/>
                    <meta property="og:image" content={this.props.mainContent.content.contactPage.metaPicture}/>
                    <meta content='1391915080924626' property='fb:app_id'/>
                </Helmet>

                <div>
                    <div className="page-top scroll-top contact-page">
                        <div className="container">
                            <div className="row">
                                <div className="col-xs-12">
                                    <h1>{this.props.textConstants['index.contact']}</h1>
                                    <p className="page-top-text">{this.props.textConstants['index.contact.page.text']}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="page-content" id="contact-page">
                        <div className="container">
                            <div className="row">
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-lg-offset-2">
                                    <p className="contact-page-text"><i className="fa fa-phone"/>&nbsp;
                                        {this.props.textConstants['index.contact.tel']}</p>

                                    <p className="contact-page-text"><i className="fa fa-envelope"/>&nbsp;
                                        <a href={"mailto:" + this.props.textConstants['index.contact.mail']} target="_blank">{this.props.textConstants['index.contact.mail']}</a></p>

                                    <p className="contact-page-medium"><i className="fa fa-map-marker"/>&nbsp;
                                        {this.props.textConstants['index.contact.adress']}</p>

                                    <div className="text-center">
                                        <div className="page-social">
                                            {this.props.mainContent.content.dynamicData
                                                &&
                                            this.props.mainContent.content.dynamicData.socialLinks
                                                &&
                                            this.props.mainContent.content.dynamicData.socialLinks.length
                                            ? this.props.mainContent.content.dynamicData.socialLinks.map((el, key)=>{
                                                return <a key={key} target="_blank" href={el.url} className={"social " + (el.title.toLowerCase())}>
                                                    <i className={"fa fa-facebook " + (el.icon)} />
                                                </a>
                                            }):''}
                                        </div>
                                    </div>
                                    <p className="contact-page-text whiteSpaceNoWrap">{this.props.textConstants['index.do.you.have.problems']}</p>
                                    <p className="head-button-text" >
                                        <a onClick={()=>{this.props.openSideBar('ticket')}} className="btn sweep-to-right-grey cursor">{this.props.textConstants['index.contact.ticket']}</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
})

export default Contact;