import React from 'react'
import {Helmet} from "react-helmet";
import SubMainPage from '../../components/SubMainPage'
import SidebarSocial from '../../components/SidebarSocial'
import SidebarPaySys from '../../components/SidebarPaySys'

const MainPage = React.createClass({
    getInitialState: function () {
        return {}
    },

    componentWillMount: function () {
    },

    componentDidMount: function () {
    },

    componentWillUnmount: function () {
    },

    render() {

        let fullUrl = '/';

        if (process.env.WEBPACK) {
            fullUrl = window.location.href;
        }else{
            fullUrl = process.env.webSiteUrl
        }

        return (
            <section >

                <Helmet>
                    <meta charSet="utf-8" />
                    <title>{this.props.mainContent.content.homePage.metaTitle}</title>
                    <meta name="description" content={this.props.mainContent.content.homePage.metaDescription}/>
                    <meta name="keywords" content={this.props.mainContent.content.homePage.metaKeywords}/>
                    <meta property="og:url" content={fullUrl}/>
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={this.props.mainContent.content.homePage.metaTitle}/>
                    <meta property="og:description" content={this.props.mainContent.content.homePage.metaDescription}/>
                    <meta property="og:image" itemprop="image" content={this.props.mainContent.content.homePage.metaPicture}/>
                    <meta content='1391915080924626' property='fb:app_id'/>
                </Helmet>

                <SidebarSocial
                    fromFooter={false}
                    content={this.props.content}
                    textConstants={this.props.textConstants}
                    mainContent={this.props.mainContent}
                />

                <SidebarPaySys
                    content={this.props.content}
                    textConstants={this.props.textConstants}
                    mainContent={this.props.mainContent}
                />

                <SubMainPage
                    actions={this.props.actions}
                    content={this.props.content}
                    textConstants={this.props.textConstants}
                    userData={this.props.userData}
                    openSideBar={this.props.openSideBar}
                    mainContent={this.props.mainContent}
                />

            </section>
        );
    }
});

export default MainPage;
