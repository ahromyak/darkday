import React from 'react'
import {Helmet} from "react-helmet";

import CabinetHeader from '../../components/CabinetHeader'
// import CabinetSidebarMenu from '../../components/cabinetComponents/CabinetSidebarMenu'
// import SidebarMenu from '../../components/SidebarMenu'
// import SidebarSignIn from '../../components/SidebarSignIn'
// import SidebarSignUp from '../../components/SidebarSignUp'
// import SidebarRestore from '../../components/SidebarRestore'
import Footer from '../../components/Footer'

if (process.env.WEBPACK) {
    require('./styles.scss');
}

class ConfidentialPolicy extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            // openMenuState: false,
            // openAuthBar: {
            //     openAuthFirst: false,
            // }
        }
    }

    componentDidMount() {
        if (process.env.WEBPACK) {
            window.scrollTo(0, 0)
        }
    }

    componentWillMount() {

    }

    render() {
        let fullUrl = '/';

        if (process.env.WEBPACK) {
            fullUrl = window.location.href;
        }else{
            // fullUrl = process.env.webSiteUrl + '/confidentialpolicy'
            fullUrl = process.env.webSiteUrl
        }
        return (
            <section className="h100">
                <div className="wrapper">
                    <Helmet>
                        <meta charSet="utf-8"/>
                        <title>{this.props.mainContent.content.dynamicData.policy.metaTitle}</title>
                        <meta name="description"
                              content={this.props.mainContent.content.dynamicData.policy.metaDescription}/>
                        <meta name="keywords" content={this.props.mainContent.content.dynamicData.policy.metaKeywords}/>
                        <meta property="og:url" content={fullUrl}/>
                        <meta property="og:type" content="article"/>
                        <meta property="og:title" content={this.props.mainContent.content.dynamicData.policy.metaTitle}/>
                        <meta property="og:description"
                              content={this.props.mainContent.content.dynamicData.policy.metaDescription}/>
                        <meta property="og:image" content={this.props.mainContent.content.dynamicData.policy.metaPicture}/>
                        <meta content='1391915080924626' property='fb:app_id'/>
                    </Helmet>

                    <CabinetHeader
                        actions={this.props.actions}
                        mainContent={this.props.mainContent}
                        content={this.props.content}
                        textConstants={this.props.textConstants}
                        openSideBar={this.props.openSideBar}
                        cabinetPageData={this.props.cabinetPageData}
                    />

                    <div className="container">

                        <h1 className="h1 big-title text-center">{this.props.mainContent.content.dynamicData.policy.title}</h1>


                        <hr className="pb60"/>

                        <div className="linkColor">
                            <p dangerouslySetInnerHTML={{__html: this.props.mainContent.content.dynamicData.policy.text}}/>
                        </div>
                    </div>
                    <div className="footerStyler"/>
                    <div className="pb60"/>
                </div>

                <Footer
                    actions={this.props.actions}
                    content={this.props.content}
                    textConstants={this.props.textConstants}
                    mainContent={this.props.mainContent}
                />

            </section>
        );
    }
}

export default ConfidentialPolicy;
