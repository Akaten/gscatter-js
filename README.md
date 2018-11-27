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

#### Making a connection
This usage is reserved for the future, now it doesn't make any sense, but required.

```js
// Optional!

ScatterJS.scatter.connect("Put_Your_App_Name_Here").then(connected => {
    if(!connected) {
        // User does not have Scatter installed/unlocked.
        return false;
    }
    
    // Use `scatter` normally now.
    GScatterJS.gscatter.getIdentity(...);
});
```
