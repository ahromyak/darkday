import React from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as contentActions from '../../actions/Content'
import Cookies from 'universal-cookie';
import {browserHistory} from 'react-router'

if (process.env.WEBPACK) {
    require('../../scss/main.scss');
    require('./styles.scss');
}

const urls = [

];

class App extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
        }
        // this.openSideBar = this.openSideBar.bind(this)
    }

    componentWillMount() {
        // if (!this.props.mainContent.content) {
        //     this.props.actions.getContent();
        // }
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div className="h100">
                {this.props.load ?

                    <div className="h100">
                        <section className="h100">
                            <SidebarMenu
                                content={this.props.mainContent.content}
                                textConstants={this.props.mainContent.textConstants}
                                actions={this.props.actions}
                                mainContent={this.props.mainContent}
                                codeMapGenerated={this.props.codeMapGenerated}
                                openSideBar={this.openSideBar}
                                allSidebarCases={this.state.allSidebarCases}
                                location={this.props.location}
                                forceLogOut={this.forceLogOut}
                            />

                            <SidebarSignIn
                                actions={this.props.actions}
                                content={this.props.mainContent.content}
                                mainContent={this.props.mainContent}
                                textConstants={this.props.mainContent.textConstants}
                                openSideBar={this.openSideBar}
                                allSidebarCases={this.state.allSidebarCases}
                                location={this.props.location}
                                forceLogOut={this.forceLogOut}
                            />

                            <SidebarSignUp
                                actions={this.props.actions}
                                mainContent={this.props.mainContent}
                                textConstants={this.props.mainContent.textConstants}
                                openSideBar={this.openSideBar}
                                allSidebarCases={this.state.allSidebarCases}
                            />

                            <SidebarRestore
                                actions={this.props.actions}
                                textConstants={this.props.mainContent.textConstants}
                                mainContent={this.props.mainContent}
                                openSideBar={this.openSideBar}
                                allSidebarCases={this.state.allSidebarCases}
                            />

                            <SidebarTickets
                                actions={this.props.actions}
                                content={this.props.mainContent.content}
                                textConstants={this.props.mainContent.textConstants}
                                mainContent={this.props.mainContent}
                                openSideBar={this.openSideBar}
                                allSidebarCases={this.state.allSidebarCases}
                            />

                            <SidebarSetWallet
                                actions={this.props.actions}
                                content={this.props.mainContent.content}
                                textConstants={this.props.mainContent.textConstants}
                                mainContent={this.props.mainContent}
                                openSideBar={this.openSideBar}
                                allSidebarCases={this.state.allSidebarCases}
                            />

                            <SidebarApplyForRepr
                            actions={this.props.actions}
                            textConstants={this.props.mainContent.textConstants}
                            mainContent={this.props.mainContent}
                            openSideBar={this.openSideBar}
                            allSidebarCases={this.state.allSidebarCases}
                            />

                            {this.props.children && React.cloneElement(this.props.children, {
                                content: this.props.mainContent.content,
                                textConstants: this.props.mainContent.textConstants,
                                actions: this.props.actions,
                                userData: this.props.mainContent.userData,
                                token: this.props.token,
                                newsCount: this.props.mainContent.newsCount,
                                newsList: this.props.mainContent.newsList,
                                photoResponce: this.props.mainContent.photoResponce,
                                emailConfirmation: this.props.mainContent.emailConfirmation,
                                codeMapGenerated: this.props.mainContent.codeMapGenerated,
                                cabinetPageData: this.props.mainContent.cabinetPageData,
                                passwordChanged: this.props.mainContent.passwordChanged,
                                cabinetSettingsEditRequest: this.props.mainContent.cabinetSettingsEditRequest,
                                codeMapSentToEmail: this.props.mainContent.codeMapSentToEmail,
                                mainContent: this.props.mainContent,
                                openSideBar: this.openSideBar,
                                allSidebarCases: this.state.allSidebarCases,
                                tokenValidator: this.tokenValidator,
                                location:this.props.location,
                                forceLogOut:this.forceLogOut
                            })}
                        </section>
                    </div>
                    : <div className="loading"/>}
            </div>
        );
    }
};

const mapStateToProps = function (state) {
    return {
        mainContent: state.content,
        load: state.content.load,
        token: state.content.token,
        session: state.content.session
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(contentActions, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
