# GScatter JS
中文版文档请查看[这里](https://github.com/gxchain/gscatter-js/blob/master/README-cn.md)

## Overview

This repo is for developer.

You can use it to interact with user in chrome by [chrome gscatter extension](https://github.com/gxchain/ScatterWebExtension), or in [blockcity](https://blockcity.gxb.io/download/), which support in box.




## Installation

```js
npm i -S gscatterjs-core
```

--------



### Build fail

If you're having trouble building your project you probably need to add a babel transpiler.
- `npm i -D @babel/runtime`

-------------



## Importing into your project.

You should be doing this early in your application, somewhere like
your main.js or app.js, and not inside sub-pages.

```js
import GScatterJS from 'gscatterjs-core';
```



## Network

**blockcity**: you can not choose network in blockcity, it's okay if you pass this which would be automatically omited.

### Main Net

```javascript
const network = {
    blockchain: 'gxc',
    protocol: 'https',
    host: 'node1.gxb.io',
    port: 443,
    chainId: '4f7d07969c446f8342033acb3ab2ae5044cbe0fde93db02de75bd17fa8fd84b8'
}
```



### Test Net

```javascript
const network = {
    blockchain: 'gxc',
    protocol: 'https',
    host: 'testnet.gxchain.org',
    port: 443,
    chainId: 'c2af30ef9340ff81fd61654295e98a1ff04b23189748f86727d0b26b40bb0ff4'
}
```





## Usage

### Demo

Clone this repo, change to the directory, then serve the directory, you can use [puer](https://github.com/leeluolee/puer).

Then open `mock-sites/browser/index.html` in chrome to test gscatter chrome extension.
Or upload your test demo on [developer center](https://developer.gxb.io/login.html), choose sandbox environment, and input website as `http://your.ip:port/mock-sites/blockcity/index.html`, then download [blockcity sandbox env](https://fir.im/blockcitysandbox) to experience.

**Don't use file protocal to open it.**



### Judge whether gscatter injected

```javascript
GScatterJS.gscatter.isExtension
```



### Making a connection
You can customize your app name.
When `connected` return true, it means gscatter inject successfully.

```js

GScatterJS.gscatter.connect("Put_Your_App_Name_Here").then(connected => {
    if(!connected) {
        return false;
    }
    
    // Use gscatter normally now.
    GScatterJS.gscatter.getIdentity(...);
});
```



### Display account info

```javascript
GScatterJS.gscatter.connect("Put_Your_App_Name_Here").then(connected => {
    if(!connected) {
        return false;
    }
    
    // On pc browser, if identity exist, means user has authorize the website and already unlock.
    // On blockcity, if identity exist, means user has imported gxchain wallet.
    if(gscatter.identity){
        account = gscatter.identity.accounts.find(x => x.blockchain === 'gxc');
        displayAccountInfo(account)
    }
});
```





### Login

```javascript
let gscatter;

GScatterJS.gscatter.connect("Put_Your_App_Name_Here").then(connected => {
    if(!connected) {
        return false;
    }
    
    gscatter = GScatterJS.gscatter;
    
    login.onclick = async function(){
        try {
                // if you want user add the network, you could call suggestNetwork, if user already has, nothing happen
                await gscatter.suggestNetwork(network);
            } catch (err) {
                // user refuse or close the prompt window
                console.error(err)
                return;
            }

            try {
                // getIdentity with required fields, it will appear at gscatter.identity
                await gscatter.getIdentity({ accounts: [network] })
            } catch (err) {
                // user refuse or close the prompt window
                console.error(err)
                return;
            }

            // you could get gscatter.identity.accounts because of { accounts: [network] } before
            const account = gscatter.identity.accounts.find(x => x.blockchain === 'gxc');
            displayAccountInfo(account)
    }
});
```



### Logout

**blockcity**: not support real logout, if call `forgetIdentity` , will throw an error.

```javascript
let gscatter;

GScatterJS.gscatter.connect("Put_Your_App_Name_Here").then(connected => {
    if(!connected) {
        return false;
    }
    
    gscatter = GScatterJS.gscatter;
    
    login.onclick = async function(){
        ...
    }
        
    logout.onclick = async function(){
        try {
            gscatter.forgetIdentity();
            clearAccountInfo()
        } catch (err) {
            // On pc browser may cause of no identity；On blockcity must throw error.
            console.error(err)
        }
    }
});
```







### Use gxclient api

```javascript
let gscatter;
let gxc
const network = {
    blockchain: 'gxc',
    protocol: 'https',
    host: 'testnet.gxchain.org',
    port: 443,
    chainId: 'c2af30ef9340ff81fd61654295e98a1ff04b23189748f86727d0b26b40bb0ff4'
}

GScatterJS.gscatter.connect("Put_Your_App_Name_Here").then(async connected => {
    if(!connected) {
        return false;
    }
    
    ...
    
    gscatter = GScatterJS.gscatter;
    gxc = gscatter.gxc(network);
    
    // use client api: generateKey
    const key = await gxc.generateKey()
    console.log(key)
});

```



And you can use api which need identity after login:

```javascript
let gscatter;
let gxc
const network = {
    blockchain: 'gxc',
    protocol: 'https',
    host: 'testnet.gxchain.org',
    port: 443,
    chainId: 'c2af30ef9340ff81fd61654295e98a1ff04b23189748f86727d0b26b40bb0ff4'
}

GScatterJS.gscatter.connect("Put_Your_App_Name_Here").then(async connected => {
    if(!connected) {
        return false;
    }
    
    ...
    
    gscatter = GScatterJS.gscatter;
    gxc = gscatter.gxc(network);
    
    login.onclick = async function(){
       ...
    }
       
    transfer.click = async function(){
        // On pc browser, if doesn't unlock, it would display unlock prompt; if doesn't login, it would display authorize prompt; if already login, it would display operation confirm prompt
 		gxc.transfer('toAccount', 'memo info', '1 GXC', true).then(trx => {
                console.log(`transfer success`, trx);
            }).catch(error => {
                console.error(error);
            });
    }
});

```



### Required fields

**blockcity**: not support required fields, if you pass, relative field will return empty.

You can require specific fields to be given back to your app from a user's Identity on both Identity Requests and Signature Requests. Precondition is 



Identity Requests:

`gscatter.getIdentity({ accounts: [network],personal:['firstname','email']})`



Signature Requests, means gxclient api which need identity, like `transfer` `callContract` `vote`:

```javascript
const requiredFields = {
	personal: ['firstname', 'lastname', 'email', 'birthdate']
};

gxc.transfer('toAccount', 'memo info', '1 GXC', true, {requiredFields}).then(trx => {
                console.log(`transfer success`, trx);
            }).catch(error => {
                console.error(error);
            });
```

**requiredFields must added after the last param, this is a extended feature which gxclient doesn't has**



More details about required fields you can check [here](https://get-scatter.com/docs/requirable-fields).



### Invite user to download extension

If in chrome, user may not have the extension, you can invite him/her to download:

```javascript
// detect no inject
if(!GScatterJS.gscatter.isExtension){
    var flag = confirm('You haven\'t download extension, confirm to download')
    if(flag){
        // if installed, nothing hapen
        // if not installed, jump to install page according to environment
        GScatterJS.openExtensionPage()
    }
}
```



### Detect Environment

```javascript
Gscatter.getEnv()	// return 'webview'、'mobile'、'pc' according to environment
```



### Error Codes

You can handle error according to the error code below:

**browser**:

```javascript
{
    // if user reject transaction(like transfer or callContract), will return this code
    NO_SIGNATURE: 402,

    FORBIDDEN: 403,

    TIMED_OUT: 408,

    LOCKED: 423,

    UPGRADE_REQUIRED: 426,

    TOO_MANY_REQUESTS: 429,

    ENCRYPT_MEMO_ERROR: 430,

    BUILD_DISPLAY_MESSAGE_ERROR: 431,

    NO_IDENTITY: 432,
    
    // all uncategoried error put here
    UN_DEF_ERROR: 433
}
```



**blockcity**:

```javascript
{
    NO_SIGNATURE: 402,	// same with browser
        
    UN_DEF_ERROR: 433,	// same with browser
        
    PASSWORD_ERROR: 434,	// password error
        
    NO_IDENTITY: 435	// when call vote、callContract、transfer which need account, if user don't have account，will throw this error
}
```





example:

```javascript
gxc.transfer('toAccount', 'memo info', '1 GXC', true, {requiredFields}).then(trx => {
	console.log(`transfer success`, trx);
}).catch(error => {
    if(error.code === 432){
    	alert('you don\'t authorize identity!')
    }
	console.error(error);
});
```



## API Support

### Scatter api support

only support `useIdentity` `suggestNetwork` `getIdentity` `authenticate` `forgetIdentity` `requireVersion` .

`getArbitrarySignature `may add in the future.



More details you can check [here](https://get-scatter.com/docs/api-reference)



### GXClient api support

Api which need identity **only support**: `transfer` `callContract` `vote`.

Api which not need identity **all support**.

**All apis are asynchronous.**



More details you can check [here](https://github.com/gxchain/gxclient-node)





## Debug

Not support debug on blockcity yet, you could debug on chrome first, then it will pass on blockcity.
