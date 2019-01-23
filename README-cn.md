# GScatter JS

English document click [here](https://github.com/gxchain/gscatter-js/blob/master/README.md).

## 概述

此仓库供开发者使用。

你可以用它跟使用[gscatter chrome插件](https://github.com/gxchain/GScatter)或者[布洛克城](https://blockcity.gxb.io/download/)的用户交互。




## 安装

```js
npm i -S gscatterjs-core
```

--------



### 打包失败

如果你打包的时候失败了，你可能需要安装babel-runtime。

- `npm i -D @babel/runtime` 

-------------



## 在项目中引入

你应该尽早在你的应用中引入，比如在`main.js`或者`app.js`之类的地方，不要在子页面引入。

```js
import GScatterJS from 'gscatterjs-core';
```



## 网络

**布洛克城**: 你不能在布洛克城中选择网络，不过传了也没关系，会自动被忽略掉。

### 主网

```javascript
const network = {
    blockchain: 'gxc',
    protocol: 'https',
    host: 'node1.gxb.io',
    port: 443,
    chainId: '4f7d07969c446f8342033acb3ab2ae5044cbe0fde93db02de75bd17fa8fd84b8'
}
```



### 测试网络

```javascript
const network = {
    blockchain: 'gxc',
    protocol: 'https',
    host: 'testnet.gxchain.org',
    port: 443,
    chainId: 'c2af30ef9340ff81fd61654295e98a1ff04b23189748f86727d0b26b40bb0ff4'
}
```





## 使用

### Demo

clone这个仓库，切换到对应的目录，然后serve该目录，你可以尝试使用[puer](https://github.com/leeluolee/puer)。

然后在chrome打开`mock-sites/browser/index.html`来测试gscatter chrome插件能否正常运行。

或者在[开发者中心](https://developer.gxb.io/login.html)上传你的测试应用，选择沙箱环境，地址指定为`http://your.ip:port/mock-sites/blockcity/index.html`，然后[下载布洛克城沙箱环境](https://fir.im/blockcitysandbox)体验。

**注意不要用ftp打开demo，否则会无法运行。**



判断是否安装了插件

### 判断gscatter是否注入成功

```javascript
GScatterJS.gscatter.isExtension
```



### 连接
app name可以随便填。当connect为true时，则说明gscatter注入成功了。

```js

GScatterJS.gscatter.connect("Put_Your_App_Name_Here").then(connected => {
    if(!connected) {
        return false;
    }
    
    // 现在可以正常使用 gscatter 了
    GScatterJS.gscatter.getIdentity(...);
});
```



### 展示账户信息

```javascript
GScatterJS.gscatter.connect("Put_Your_App_Name_Here").then(connected => {
    if(!connected) {
        return false;
    }
    
	// 在pc浏览器上，如果identity存在，则说明用户已经授权过该网站并且已经解锁了；
    // 在布洛克城里，如果identity存在，则说明用户已经导入过公信链钱包
    if(gscatter.identity){
        account = gscatter.identity.accounts.find(x => x.blockchain === 'gxc');
        displayAccountInfo(account)
    }
});
```



### 登录

```javascript
let gscatter;

GScatterJS.gscatter.connect("Put_Your_App_Name_Here").then(connected => {
    if(!connected) {
        return false;
    }
    
    gscatter = GScatterJS.gscatter;
    
    login.onclick = async function(){
        try {
                // 如果你希望用户添加你指定的网络，你可以调用suggestNetwork。如果用户已经存储过该网络，那么什么都不会发生。在布洛克城是无效的。
                await gscatter.suggestNetwork(network);
            } catch (err) {
                // 用户拒绝或者关闭该提示窗口。在布洛克城不会出错。
                console.error(err)
                return;
            }

            try {
                // 通过required fields获取身份，这些字段会出现在gscatter.identity里
                await gscatter.getIdentity({ accounts: [network] })
            } catch (err) {
                // 用户拒绝或者关闭该提示窗口。在布洛克城不会出错。
                console.error(err)
                return;
            }

            // 你可以获取到gscatter.identity.accounts是因为你之前在getIdentity的时候传了accounts字段。
            const account = gscatter.identity.accounts.find(x => x.blockchain === 'gxc');
            displayAccountInfo(account)
    }
});
```



### 登出
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
            // 在pc浏览器上可能是因为没有身份
            console.error(err)
        }
    }
});
```







### 使用gxclient api

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
    
    // 使用client api: generateKey
    const key = await gxc.generateKey()
    console.log(key)
});

```



你可以在登录之后使用一些需要identity的api：

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
        // 在pc浏览器上，如果没有解锁，会提示解锁；如果没有授权过，会提示授权；如果已经授权过，那么会弹出交易确认的提示框。
 		gxc.transfer('toAccount', 'memo info', '1 GXC', true).then(trx => {
                console.log(`transfer success`, trx);
            }).catch(error => {
                console.error(error);
            });
    }
});

```



### Required fields

**布洛克城**: 不支持，如果传了，相应的字段会返回空。

你可以要求返回一些指定的字段，当Identity Requests（授权身份）或者 Signature Requests（如转账），前提是用户在身份中填写过这些字段，否则会拿不到任何信息。



Identity Requests:

`gscatter.getIdentity({ accounts: [network],personal:['firstname','email']})`



Signature Requests, 意思是需要身份信息的 gxclient api, 就像 `transfer` `callContract` `vote`:

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

**requiredFields 必须加到最后一个参数, 这是gxclient没有的扩展功能**



更多关于requiredFields的细节可以看[这里](https://get-scatter.com/docs/requirable-fields).



### 邀请用户下载插件

用户可能在pc或者手机的浏览器中浏览你的应用，但此时他们可能并没有安装相应的插件。你可以引导他们去下载chrome插件或者布洛克城:

```javascript
// 没有注入
if(!GScatterJS.gscatter.isExtension){
    var flag = confirm('You haven\'t download extension, confirm to download')
    if(flag){
        // 如果已经安装过，则不会有任何反应
        // 如果没有安装过, 则会根据当前环境跳转到安装页面
        GScatterJS.openExtensionPage()
    }
}
```



### 检测环境

```javascript
Gscatter.getEnv((env)=>{console.log(env)})	// 根据环境返回 'blockcity' 'webview'、'mobile'、'pc'
```



### 错误码

你可以根据下列的错误码处理异常：

**浏览器**:

```javascript
{
    // 如果用户拒绝交易（比如转账或者调用合约），将返回这个码
    NO_SIGNATURE: 402,

    FORBIDDEN: 403,

    TIMED_OUT: 408,

    LOCKED: 423,

    UPGRADE_REQUIRED: 426,

    TOO_MANY_REQUESTS: 429,

    ENCRYPT_MEMO_ERROR: 430,

    BUILD_DISPLAY_MESSAGE_ERROR: 431,

    NO_IDENTITY: 432,
    
    // 所有未分类的错误都会放在这里
    UN_DEF_ERROR: 433
}
```



**布洛克城**:

```javascript
{
    NO_SIGNATURE: 402,	// 与浏览器相同
        
    UN_DEF_ERROR: 433,	// 与浏览器相同
        
    PASSWORD_ERROR: 434,	// 密码错误
        
    NO_IDENTITY: 435	// 当调用vote、callContract、transfer等需要身份信息的方法时，如果用户没有，则会抛错
}
```





例子:

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



## API支持情况

### Scatter api 支持情况

只支持 `useIdentity` `suggestNetwork` `getIdentity` `authenticate` `forgetIdentity` `requireVersion` .

`getArbitrarySignature`可能会在之后加上。



更多细节可以看[这里](https://get-scatter.com/docs/api-reference)



### GXClient api 支持

需要身份信息的api只支持: `transfer` `callContract` `vote`.

其它的全部都支持。

**需要注意的是，与gxclient不一致的是，所有的api都是异步的。**



更多细节可以看[这里](https://github.com/gxchain/gxclient-node)



## Debug

暂时不支持在布洛克城上调试，你可以先在浏览器上调试，布洛克城做好了语法兼容。

如果遇到问题，可以反馈给开发，或者用[vConsole](https://github.com/Tencent/vConsole)



## 其它平台兼容GScatter

由于GScatter本质上只是一组语法，任何平台都可以根据该语法去实现对应的插件，就像meetone实现Scatter插件一样。

如果想在webview里面实现插件，可以参考[gscatter-blockcity-inject](https://github.com/gxchain/blockcity-gscatter-inject)。

**需要注意的是：**

1.输入输出一定要一致，交互不一定一致

2.含义一致的错误码，请保持跟上述文档 `错误码` 部分一致。



### 低版本不支持

你的产品可能从1.0.0版本开始支持GScatter语法的应用，而1.0.0版本以下不支持。

这时候你会希望给低版本用户一些提示。

我们提供的解决办法是：

在webview的`window`对象里面注入`isSupportGScatter `和`notSupportGScatterCallback`，`gscatterjs-core`会自动去调用`window.isSupportGScatter(window.notSupportGScatterCallback) `。

比如布洛克城中就注入了如下的代码：

```javascript
function blockcityGlobalInject() {
    window.isSupportGScatter = function (failCallback) {
        getDeviceInfo((result) => {
            const version = result.version
            // if less than 2.0.3, not support gscatter
            if (!compareVersion('2.0.3', version)) {
                failCallback(result)
            }
        })
    }

    window.notSupportGScatterCallback = function (appInfo) {
        alert(i18n('not_support', appInfo.appLanguage))
    }
}
```



如果你的产品之前的版本并没有在webview中注入可以方便配置的脚本，那么可以开放一个GScatter应用专区，或者在url上加上GScatter的标识，来标注GScatter应用，然后再在这些webview里面判断当前版本是否支持GScatter。



### 获取当前环境

开发者可能根据不同的平台，做一些适配，那么他需要知道当前的使用环境，你可以在`window`对象中注入`GSCATTER_ENV`，那么开发者通过`getEnv`取到的值就会是你注入的值。