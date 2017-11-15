import React from 'react';
import {Helmet} from "react-helmet";

import CabinetHeaderNoMenu from '../../components/cabinetComponents/CabinetHeaderNoMenu'
import { browserHistory } from 'react-router'


if (process.env.WEBPACK) {
    require('./styles.scss');
}

class CodemapPage extends React.Component {

    imagetoPrint(source) {
        return "<html><head><script>function step1(){\n" +
            "setTimeout('step2()', 10);}\n" +
            "function step2(){window.print();window.close()}\n" +
            "</scri" + "pt></head><body onload='step1()'>\n" +
            "<img src='" + source + "' /></body></html>";
        this.finish.removeAttribute('disabled')
    }

    printImage() {
        let Pagelink = "about:blank";
        let pwa = window.open(Pagelink, "_new");
        pwa.document.open();
        pwa.document.write(this.imagetoPrint(this.state.codeMap));
        pwa.document.close();
        this.finish.removeAttribute('disabled')
    }

    sendEmailWithCodeMap(){
        this.props.actions.sendCodeMapToEmail();
        this.finish.removeAttribute('disabled')
    }

    finishRegistration(){
        browserHistory.push('/cabinet');
    }

    allowRegister(){
        this.finish.removeAttribute('disabled');
    }

    constructor(props) {
        super(props)
        this.state = {
            codeMap: null,
            allowFinishRegistration:false,
            buttonLabel:this.props.textConstants['cabinet.codemap.finish'],
        }
        this.finishRegistration = this.finishRegistration.bind(this)
        this.sendEmailWithCodeMap = this.sendEmailWithCodeMap.bind(this)
        this.printImage = this.printImage.bind(this)
        this.allowRegister = this.allowRegister.bind(this)
    }

    componentWillMount() {
        let promise = this.props.actions.generateCodemap();
        promise.then(() => {
            if (this.props.mainContent.codeMapGenerated.result) {
                this.setState({codeMap: this.props.mainContent.codeMapGenerated.picture});
                localStorage.setItem('codeMapPictureView', this.props.mainContent.codeMapGenerated.picture);
            }else{
                let codemap = localStorage.getItem('codeMapPictureView');
                if(typeof codemap != 'undefined'){
                    this.setState({codeMap: codemap});
                }
            }
        });

        if(typeof this.props.location.query.reissue !== 'undefined'){
            if(this.props.location.query.reissue == 'true'){
                this.setState({
                    buttonLabel:this.props.textConstants['common.back.to.main.page']
                })
            }
        }
    }

    componentDidMount(){
        this.finish.setAttribute('disabled','disabled');
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

                <Helmet>
                    <meta charSet="utf-8"/>
                    <title>{this.props.mainContent.content.codeMapPage.metaTitle}</title>
                    <meta name="description" content={this.props.mainContent.content.codeMapPage.metaDescription}/>
                    <meta name="keywords" content={this.props.mainContent.content.codeMapPage.metaKeywords}/>
                    <meta property="og:url" content={fullUrl}/>
                    <meta property="og:type" content="article"/>
                    <meta property="og:title" content={this.props.mainContent.content.codeMapPage.metaTitle}/>
                    <meta property="og:description" content={this.props.mainContent.content.codeMapPage.metaDescription}/>
                    <meta property="og:image" content={this.props.mainContent.content.codeMapPage.metaPicture}/>
                </Helmet>

                <CabinetHeaderNoMenu
                    actions={this.props.actions}
                    mainContent={this.props.mainContent}
                    content={this.props.mainContent.content}
                    textConstants={this.props.textConstants}
                    openMenu={this.openMenu}
                    cabinetPageData={this.props.cabinetPageData}
                />

                <div className="container">
                    <p className="cm-title">{this.props.textConstants['cabinet.codemap.title']}</p>
                    <hr/>
                    <div className="cm-description">
                        <p className="cm-sub-title">{this.props.textConstants['cabinet.codemap.subtitle']}</p>
                        <p>{this.props.textConstants['cabinet.codemap.text']}</p>

                    </div>
                    <div className="row cm-content__block">
                        <div className="col-xs-12 col-md-4">
                            {this.state.codeMap && <img className="cm-image" src={this.state.codeMap}/>}
                        </div>
                        <div className="col-xs-12 col-md-4 cm-btn-group">
                            <button className="btn btn-grey-round"
                                    onClick={()=>{this.printImage(this.state.codeMap)}}
                            >{this.props.textConstants['cabinet.codemap.print']}</button>
                            <a href={this.state.codeMap} download className="btn btn-grey-round" onClick={this.allowRegister}>
                                {this.props.textConstants['cabinet.codemap.save']}</a>
                            <button className="btn btn-grey-round"
                            onClick={this.sendEmailWithCodeMap}
                            >{this.props.textConstants['cabinet.codemap.send.by.mail']}</button>
                        </div>
                        <div className="col-xs-12 col-md-4">
                            <div className="cm-warning">
                                <img src="../assets/images/warning-sign.png"/>
                                <p>{this.props.textConstants['cabinet.codemap.warning']}</p>
                                <p>{this.props.textConstants['cabinet.codemap.warning.text']} </p>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <button ref={(finish)=>{this.finish = finish}}
                            className="btn btn-blue setting-submit"
                                onClick={this.finishRegistration}
                        >{this.state.buttonLabel}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default CodemapPage;