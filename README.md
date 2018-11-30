# GScatter JS


## Installation

```js
npm i -S gscatterjs-core
```

--------



### NodeJS and babel/webpack.

If you're having trouble packaging or compiling your project you probably need to add a babel transpiler.
- `npm i -D @babel/runtime` <-- run this command and it should compile.

-------------



## Importing GScatterJS into your project.

You should be doing this early in your application, somewhere like
your main.js or app.js, and not inside sub-pages.

```js
import ScatterJS from 'gscatterjs-core';
```



## GScatterJS Usage

### Making a connection
This usage is reserved for the future, now it doesn't make any sense, but required.

```js

GScatterJS.gscatter.connect("Put_Your_App_Name_Here").then(connected => {
    if(!connected) {
        // User does not have GScatter Plugin installed/unlocked.
        return false;
    }
    
    // Use `gscatter` normally now.
    GScatterJS.gscatter.getIdentity(...);
});
```



### Display account info

```javascript
GScatterJS.gscatter.connect("Put_Your_App_Name_Here").then(connected => {
    if(!connected) {
        // User does not have GScatter Plugin installed/unlocked.
        return false;
    }
    
	// if identity exist, means user has authorize the website and already unlock, you could display account info then
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
        // User does not have GScatter Plugin installed/unlocked.
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

```javascript
let gscatter;

GScatterJS.gscatter.connect("Put_Your_App_Name_Here").then(connected => {
    if(!connected) {
        // User does not have GScatter Plugin installed/unlocked.
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
            // no identity found
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
        // if doesn't unlock, it would display unlock prompt; if doesn't login, it would display authorize prompt; if already login, it would display operation confirm prompt
 		gxc.transfer('toAccount', 'memo info', '1 GXC', true).then(trx => {
                console.log(`transfer success`, trx);
            }).catch(error => {
                console.error(error);
            });
    }
});

```



### Required fields

You can require specific fields to be given back to your app from a user's Identity on both Identity Requests and Signature Requests. 



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



### Scatter api support

only support `useIdentity` `suggestNetwork` `getIdentity` `authenticate` `forgetIdentity` `requireVersion` .

`getArbitrarySignature `may add in the future.



More details you can check [here](https://get-scatter.com/docs/api-reference)



### GXClient api support

Api which need identity **only support**: `transfer` `callContract` `vote`.

Api which not need identity **all support**.

**All apis are asynchronous.**



More details you can check [here](https://github.com/gxchain/gxclient-node)