import PluginRepository from './plugins/PluginRepository';
import SocketService from './services/SocketService';
import Plugin from './plugins/Plugin';
import * as PluginTypes from './plugins/PluginTypes';
import { Blockchains } from './models/Blockchains';
import Network from './models/Network';
import UserAgent from 'gxc-frontend-base/src/script/util/ua'
import { blockcityGlobalInject, detectBlockcityWebview } from './util/blockcityUtil'
import checkSupport from './util/checkSupport'

export const ENV_WEBVIEW = 'webview'
export const ENV_MOBILE = 'mobile'
export const ENV_PC = 'pc'
export const ENV_BLOCKCITY = 'blockcity'

const ua = new UserAgent()
const getEnv = () => {
    return new Promise((resolve) => {
        // waiting host to inject global variable
        setTimeout(async () => {
            if (ua.WEB_VIEW) {
                const flag = await detectBlockcityWebview()
                if (flag) {
                    resolve(ENV_BLOCKCITY)
                }
            }

            if (ua.WEB_VIEW) {
                resolve(ENV_WEBVIEW)
            }

            if (ua.MOBILE) {
                resolve(ENV_MOBILE)
            }

            if (ua.PC) {
                resolve(ENV_PC)
            }
        }, 100)
    })
}

const getEnvSingleInstance = getEnv()


getEnvSingleInstance.then((env) => {
    if (env === ENV_BLOCKCITY) {
        // hack for blockcity, cause blockcity app didn't inject a global script
        blockcityGlobalInject()
    }

    checkSupport()
})

const throwNoAuth = () => {
    if (!holder.gscatter.isExtension && !SocketService.isConnected())
        throw new Error('Connect and Authenticate first - gscatter.connect( pluginName )');
};

const checkForExtension = (resolve, reject, tries = 0) => {
    if (tries > 30) {
        reject(false);
        return;
    }
    if (holder.gscatter.isExtension) return resolve(true);
    setTimeout(() => checkForExtension(resolve, tries + 1), 100);
};


class Index {

    constructor() {
        this.isExtension = false;
        this.identity = null;
    }

    loadPlugin(plugin) {
        const noIdFunc = () => { if (!this.identity) throw new Error('No Identity') };
        if (!plugin.isValid()) throw new Error(`${plugin.name} doesn't seem to be a valid GScatterJS plugin.`);

        PluginRepository.loadPlugin(plugin);

        if (plugin.isSignatureProvider()) {
            this[plugin.name] = plugin.signatureProvider(noIdFunc, () => this.identity);
            this[plugin.name + 'Hook'] = plugin.hookProvider;
        }
    }

    async connect(pluginName, options = {}) {
        return new Promise((resolve, reject) => {
            if (!pluginName || !pluginName.length) throw new Error("You must specify a name for this connection");

            // Setting options defaults
            options = Object.assign({ initTimeout: 10000, linkTimeout: 30000 }, options);

            // Auto failer
            setTimeout(() => {
                resolve(false);
            }, options.initTimeout);

            // Defaults to gscatter extension if exists
            checkForExtension(resolve, reject);

            // Tries to set up Desktop Connection
            // SocketService.init(pluginName, options.linkTimeout);
            // SocketService.link().then(async authenticated => {
            //     if(!authenticated) return false;
            //     this.identity = await this.getIdentityFromPermissions();
            //     return resolve(true);
            // });
        })
    }

    disconnect() {
        return SocketService.disconnect();
    }

    isConnected() {
        return SocketService.isConnected();
    }

    isPaired() {
        return SocketService.isPaired();
    }

    getVersion() {
        return SocketService.sendApiRequest({
            type: 'getVersion',
            payload: {}
        });
    }

    getIdentity(requiredFields) {
        checkSupport()
        // throwNoAuth();
        // return SocketService.sendApiRequest({
        //     type: 'getOrRequestIdentity',
        //     payload: {
        //         fields: requiredFields
        //     }
        // }).then(id => {
        //     if (id) this.identity = id;
        //     return id;
        // });
    }

    getIdentityFromPermissions() {
        throwNoAuth();
        return SocketService.sendApiRequest({
            type: 'identityFromPermissions',
            payload: {}
        }).then(id => {
            if (id) this.identity = id;
            return id;
        });
    }

    forgetIdentity() {
        checkSupport()
        // throwNoAuth();
        // return SocketService.sendApiRequest({
        //     type: 'forgetIdentity',
        //     payload: {}
        // }).then(res => {
        //     this.identity = null;
        //     return res;
        // });
    }

    authenticate(nonce) {
        throwNoAuth();
        return SocketService.sendApiRequest({
            type: 'authenticate',
            payload: { nonce }
        });
    }

    getArbitrarySignature(publicKey, data, whatfor = '', isHash = false) {
        throwNoAuth();
        return SocketService.sendApiRequest({
            type: 'requestArbitrarySignature',
            payload: {
                publicKey,
                data,
                whatfor,
                isHash
            }
        });
    }

    getPublicKey(blockchain) {
        throwNoAuth();
        return SocketService.sendApiRequest({
            type: 'getPublicKey',
            payload: { blockchain }
        });
    }

    linkAccount(publicKey, network) {
        throwNoAuth();
        return SocketService.sendApiRequest({
            type: 'linkAccount',
            payload: { publicKey, network }
        });
    }

    hasAccountFor(network) {
        throwNoAuth();
        return SocketService.sendApiRequest({
            type: 'hasAccountFor',
            payload: {
                network
            }
        });
    }

    suggestNetwork(network) {
        checkSupport()
        // throwNoAuth();
        // return SocketService.sendApiRequest({
        //     type: 'requestAddNetwork',
        //     payload: {
        //         network
        //     }
        // });
    }

    requestTransfer(network, to, amount, options = {}) {
        const payload = { network, to, amount, options };
        return SocketService.sendApiRequest({
            type: 'requestTransfer',
            payload
        });
    }

    requestSignature(payload) {
        throwNoAuth();
        return SocketService.sendApiRequest({
            type: 'requestSignature',
            payload
        });
    }

    createTransaction(blockchain, actions, account, network) {
        throwNoAuth();
        return SocketService.sendApiRequest({
            type: 'createTransaction',
            payload: {
                blockchain,
                actions,
                account,
                network
            }
        });
    }
}


class Holder {
    constructor(_gscatter) {
        this.gscatter = _gscatter;
    }

    plugins(...plugins) {
        if (!this.gscatter.isExtension) {
            plugins.map(plugin => this.gscatter.loadPlugin(plugin));
        }
    }

    openExtensionPage() {
        if (ua.MOBILE) {
            window.open('https://blockcity.gxb.io/download/');
        } else if (ua.PC) {
            window.open('https://gxchain.github.io/GScatter/arch/guide/');
        }
    }
}


let holder = new Holder(new Index());
if (typeof window !== 'undefined') {

    // Catching extension instead of Desktop
    if (typeof document !== 'undefined') {
        const bindScatterClassic = () => {
            holder.gscatter = window.gscatter;
            holder.gscatter.isExtension = true;
            holder.gscatter.connect = () => new Promise(resolve => resolve(true));
        };

        if (typeof window.gscatter !== 'undefined') bindScatterClassic();
        else document.addEventListener('gscatterLoaded', () => bindScatterClassic());
    }

    window.GScatterJS = holder;
}

holder.Plugin = Plugin;
holder.PluginTypes = PluginTypes;
holder.Blockchains = Blockchains;
holder.Network = Network;
holder.SocketService = SocketService;
export { Plugin, PluginTypes, Blockchains, Network, SocketService };
export default holder;


