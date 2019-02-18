import { getDeviceInfo } from '../services/BlockcityService'
import i18n from './i18n'

function compareVersion(lowestVersion, localVersion) {
    let v1 = lowestVersion.split('.');
    let v2 = localVersion.split('.');
    return v1[0] * 1000000 + v1[1] * 1000 + parseInt(v1[2]) <= v2[0] * 1000000 + v2[1] * 1000 + parseInt(v2[2]);
}

export function blockcityGlobalInject() {
    window.isSupportGScatter = function (failCallback) {
        getDeviceInfo((result) => {
            const version = result.version
            // if less than 2.0.3, not support gscatter
            if (!compareVersion('2.0.3', version)) {
                failCallback(result)
            }
        })
    }

    // allow developer overide
    window.notSupportGScatterCallback = window.notSupportGScatterCallback || function (appInfo) {
        alert(i18n('not_support', appInfo.appLanguage))
    }
}