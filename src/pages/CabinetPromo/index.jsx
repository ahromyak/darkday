import React from 'react';
import NavLink from '../../components/NavLink'
import {Helmet} from "react-helmet";

import CabinetPromoCategorys from '../../components/cabinetComponents/CabinetPromoCategorys'

class CabinetPromo extends React.Component {

    showPromoList(categoryId) {
        this.setState({
            categoryId:categoryId
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            categoryId: this.props.cabinetPageData.promoView ? this.props.cabinetPageData.promoView[0].categoryId : 0,
        }
        this.showPromoList = this.showPromoList.bind(this)
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
                    <title>{this.props.mainContent.content.promo.metaTitle}</title>
                    <meta name="description" content={this.props.mainContent.content.promo.metaDescription}/>
                    <meta name="keywords" content={this.props.mainContent.content.promo.metaKeywords}/>
                    <meta property="og:url" content={fullUrl}/>
                    <meta property="og:type" content="article"/>
                    <meta property="og:title" content={this.props.mainContent.content.promo.metaTitle}/>
                    <meta property="og:description" content={this.props.mainContent.content.promo.metaDescription}/>
                    <meta property="og:image" content={this.props.mainContent.content.promo.metaPicture}/>
                </Helmet>

                <div className="cabinet-content" id="cabinet-promo">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="promo-tabs">

                                    {this.props.cabinetPageData.promoView && this.props.cabinetPageData.promoView.length ? this.props.cabinetPageData.promoView.map((el, key) => {
                                        return <a href="javascript:void(0);" key={key} onClick={() => {
                                            this.showPromoList(el.categoryId)
                                        }} className={"btn btn-promo " + (el.categoryId == this.state.categoryId ? 'active' : '')}>{el.categoryTitle}</a>
                                    }) : ''}

                                    <NavLink to={'/cabinet'} className="back-to-home" onlyActiveOnIndex>
                                        <i className="fa fa-angle-left" aria-hidden="true"/>&nbsp;{this.props.textConstants['common.back.to.main.page']}
                                    </NavLink>
                                </div>
                                <div className="promo-tab">

                                    {this.props.cabinetPageData.promoView && this.props.cabinetPageData.promoView.length ? this.props.cabinetPageData.promoView.map((el, key) => {
                                        return <CabinetPromoCategorys category={el}
                                                                      key={key}
                                                                      categoryId={el.categoryId}
                                                                      stateCategoryId={this.state.categoryId}
                                                                      textConstants={this.props.textConstants}
                                                                      mainContent={this.props.mainContent}
                                        />
                                    }) : ''}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CabinetPromo;

