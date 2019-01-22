const methods = {}
let methodID = 99999999
let needEncode = true

const nativeCallback = window.nativeCallback || function () { }
window.nativeCallback = function (mId) {
    var args = Array.prototype.slice.call(arguments, 1)
    const handledArgs = args.map(arg => {
        try {
            return JSON.parse(decodeURIComponent(arg))
        } catch (err) {
            return decodeURIComponent(arg)
        }
    })
    typeof methods[mId] === 'function' && methods[mId].apply(this, handledArgs)

    nativeCallback(...arguments)
}

function callNative(method, params, callback) {
    callBridge('native', method, params, callback)
}

function callBridge(schema, method, params, callback) {
    var mId = methodID++;
    var url_params = '';
    methods[mId] = function () {
        typeof callback === 'function' && callback.apply(this, arguments);
        if (methods[mId]) {
            try {
                delete methods[mId];
            } catch (err) {
                methods[mId] = null;
            }
        }
    };
    if (typeof (params) !== 'object') {
        params = {};
    }
    params._mId = mId;
    for (var k in params) {
        if (needEncode) {
            url_params += ((url_params.indexOf('=') != -1) ? '&' : '') + encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
        } else {
            url_params += ((url_params.indexOf('=') != -1) ? '&' : '') + k + '=' + encodeURI(params[k]);
        }
    }
    var url = schema + '://' + method + '?' + url_params;
    var iFrame;
    iFrame = document.createElement('iframe');
    iFrame.setAttribute('src', url);
    iFrame.setAttribute('style', 'display:none;');
    iFrame.setAttribute('height', '0px');
    iFrame.setAttribute('width', '0px');
    iFrame.setAttribute('frameborder', '0');
    document.body.appendChild(iFrame);
    iFrame.parentNode.removeChild(iFrame);
    iFrame = null;
}

export function getDeviceInfo(callback) {
    callNative('deviceInfo', {
    }, callback)
}