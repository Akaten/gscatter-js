"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");var _BlockcityService=require("../services/BlockcityService"),_i18n=_interopRequireDefault(require("./i18n"));Object.defineProperty(exports,"__esModule",{value:!0}),exports.blockcityGlobalInject=blockcityGlobalInject;function compareVersion(a,b){var c=a.split("."),d=b.split(".");return 1e6*c[0]+1e3*c[1]+parseInt(c[2])<=1e6*d[0]+1e3*d[1]+parseInt(d[2])}function blockcityGlobalInject(){window.isSupportGScatter=function(a){(0,_BlockcityService.getDeviceInfo)(function(b){var c=b.version;// if less than 2.0.3, not support gscatter
compareVersion("2.0.3",c)||a(b)})},window.notSupportGScatterCallback=window.notSupportGScatterCallback||function(a){alert((0,_i18n.default)("not_support",a.appLanguage))}}