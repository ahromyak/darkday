import React from 'react'
import {Route, IndexRoute} from 'react-router'
import App from './containers/App';
import HeadComponent from './containers/HeadComponent';
import MainPage from './pages/MainPage';
import Faq from './pages/Faq';
import News from './pages/News';
import SingleNews from './pages/SingleNews';
import Contact from './pages/Contact';
import LoginRequired from './components/LoginRequired';
import cabinetFullHeaderComponent from './components/cabinetComponents/cabinetFullHeaderComponent';
import EmailVerification from './components/EmailVerification';
import Deposit from './pages/Deposit';
// import PickedDeposit from './pages/PickedDeposit';
import SelectDeposit from './pages/SelectDeposit';
import Cabinet from './pages/Cabinet';
import CabinetPromo from './pages/CabinetPromo';
import CabinetReferral from './pages/CabinetReferral';
import CabinetSettings from './pages/CabinetSettings';
import CabinetHistory from './pages/CabinetHistory';
import Representatives from './pages/Representatives';
import Withdraw from './pages/Withdraw';
import WithdrawWallet from './pages/WithdrawWallet';
import CreateDeposit from './pages/CreateDeposit';
import ConfidentialPolicy from "./pages/ConfidentialPolicy/index";
import Rules from "./pages/Rules";
import AntiSpam from "./pages/AntiSpam/index";
import CodemapPage from "./pages/CodemapPage";
import QrCodePage from "./pages/QrCodePage";
import PasswordCreate from "./pages/PasswordCreate";
import DepositApproval from "./pages/DepositApproval";
import ChangeEmailConfirm from "./pages/ChangeEmailConfirm";

function requireAuth() {
   // console.log('login required');
}

let innerRoutes = (
    <Route>
        <Route component={HeadComponent}>
            <IndexRoute component={MainPage}/>
            <Route path="faq" component={Faq}/>
            <Route path="news(/:page)" component={News}/>
            <Route path="singlenews/:id" component={SingleNews}/>
            <Route path="contact" component={Contact}/>
            <Route path="representatives" component={Representatives}/>
            <Route path="emailverification" component={EmailVerification}/>
        </Route>

        <Route path="createdeposit" component={CreateDeposit}/>
        <Route path="passwordcreate" component={PasswordCreate}/>
        <Route path="confidentialpolicy" component={ConfidentialPolicy}/>
        <Route path="rules" component={Rules}/>
        <Route path="antispampolicy" component={AntiSpam}/>
        <Route path="deposit" component={Deposit}/>
        <Route path="changeemailconfirm" component={ChangeEmailConfirm}/>

        <Route onEnter={requireAuth } component={LoginRequired}>
            <Route component={cabinetFullHeaderComponent}>
                <Route path="cabinet" component={Cabinet}/>
                <Route path="promo" component={CabinetPromo}/>
                <Route path="referral" component={CabinetReferral}/>
                <Route path="settings" component={CabinetSettings}/>
                <Route path="history" component={CabinetHistory}/>
                <Route path="withdraw" component={Withdraw}/>
                <Route path="withdrawwallet" component={WithdrawWallet}/>
            </Route>
            <Route path="codemap" component={CodemapPage}/>
            <Route path="qrcodevalidation" component={QrCodePage}/>
            <Route path="depositapproval/:approvesNeeded/:approves/:sum/:id" component={DepositApproval}/>
            <Route path="reinvest" component={SelectDeposit}/>
        </Route>
    </Route>
);

export default (
    <Route>
        <Route path='/' component={App}>
            {innerRoutes}
        </Route>
        {/*<Route path="/(:lang)" component={App}>*/}
            {/*{innerRoutes}*/}
        {/*</Route>*/}
    </Route>
);
