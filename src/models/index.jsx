export function _roundNumbers(n, digits) {
    if (digits === undefined) {
        digits = 0;
    }

    let multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    let test = (Math.round(n) / multiplicator);
    return +(test.toFixed(digits));
}

export function _cutNumber(n, digits) {
    let reault = Math.floor(n * digits) / digits
    return reault;
}

// there is three types success,danger,info
// second param is message
export function showNotify(notifyType, notifyMessage) {
    let newNotify = document.createElement('span');
    newNotify.classList.add('notify-box');
    newNotify.classList.add(notifyType);
    newNotify.innerHTML = notifyMessage;
    document.body.appendChild(newNotify);

    setTimeout(function () {
        newNotify.classList.add('visible');
    }, 200);
    setTimeout(function () {
        newNotify.classList.remove('visible');
    }, 4500);
    setTimeout(function () {
        document.body.removeChild(newNotify);
    }, 5000);

}

export function _validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export function _validatePass(pass) {
    if (pass.length > 3) {
        let re = /^(?=.*[a-z])(^.{5,}$)/;
        return re.test(pass);
    } else {
        return false
    }
}

export function _trimSpaces(str) {
    str = str.replace(/^\s+/, '');
    for (let i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return str;
}

export function secondsToString(seconds)
{
    let numdays = Math.floor(seconds / 86400);
    let numhours = Math.floor((seconds % 86400) / 3600);
    let numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
    let numseconds = ((seconds % 86400) % 3600) % 60;

    if(numdays < 0){
        numdays = '0';
    }

    if(numhours < 0){
        numhours = '00';
    }

    if(numhours >= 0 && numhours < 10){
        numhours = '0' + numhours;
    }

    if(numminutes < 0){
        numminutes = '00';
    }

    if(numminutes >= 0 && numminutes < 10){
        numminutes = '0' + numminutes;
    }

    if(numseconds < 0){
        numseconds = '00';
    }

    if(numseconds >= 0 && numseconds < 10){
        numseconds = '0' + numseconds;
    }

    return {days:numdays,hours:numhours,minutes:numminutes,seconds:numseconds}
}

export function isEmptyObj(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (let key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

// export function sortByObjProp(a,b) {
//     if (a.last_nom < b.last_nom)
//         return -1;
//     if (a.last_nom > b.last_nom)
//         return 1;
//     return 0;
// }

export function returnMinSum(source, curId){
    let minSum = [];

    let minSumArray = JSON.parse(JSON.stringify(source));

    minSum = minSumArray.map((el)=>{
        if(el.currencyId === curId){
            return el
        }
    });

    return minSum[0];
}

export function routeParser (route) {
    let paths = [];
    if (Array.isArray(route)) {
        route.forEach((r) => {
            paths = paths.concat(extractRoute(r));
        });
    } else {
        paths = paths.concat(extractRoute(route));
    }

    return paths;
};

function extractChildRoutes (route, prefix) {
    let paths = [];
    const childRoutes = route.props && route.props.children ?
        route.props.children : route.childRoutes;
    if (childRoutes) {
        if (Array.isArray(childRoutes)) {
            childRoutes.forEach((r) => {
                paths = paths.concat(extractRoute(r, prefix));
            });
        } else {
            paths = paths.concat(extractRoute(childRoutes, prefix));
        }
    }

    return paths;
}

function extractRoute (route, prefix) {
    const path = route.props && route.props.path ? route.props.path : route.path;
    let paths = [];

    if (!path) {
        if (Array.isArray(route)) {
            route.forEach((r) => {

                paths = paths.concat(extractRoute(r, prefix));
            });

            return paths;
        } else {

            return extractChildRoutes(route, prefix)
        }
    }
    const currentPath = (
        `${prefix || ''}${path.replace(/\//, '')}`
    );

    if (!/:|\*/.test(currentPath)) {
        paths.push(`${currentPath.startsWith('/') ? '' : '/'}${currentPath}`);
        paths = paths.concat(extractChildRoutes(route, `${currentPath}/`));
    }else{
        let position;
        position = currentPath.indexOf('(');
        if(position == -1){
            position = currentPath.indexOf(':');
        }
        let purePath =  currentPath.substring(0,position);
        paths = paths.concat(purePath);
    }
    return paths;
}

