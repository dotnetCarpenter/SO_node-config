According to https://github.com/node-config/node-config/wiki/Special-features-for-JavaScript-configuration-files you can not use ESM for configuration files but must use one of the other [supported formats](https://github.com/node-config/node-config/wiki/Configuration-Files#file-formats).

>Loading files as ESM is not yet supported. So .mjs or .js when "type":"module" or --experimental-modules will not work.

But there is a work-around.
For example you could have the following structure, where **dynamic.js** is where you have _big config variables and dynamic values_:

```
.
├── config
│   ├── dynamic.js
│   └── test.cjs
├── index.js
├── node_modules
│   ├── config
│   ├── json5
│   └── minimist
├── package-lock.json
└── package.json
```

You **must** tell nodejs that you use esm. So in your **package.json** you will want to have:

```json
{
  "scripts": {
    "start": "NODE_ENV=test node index.js"
  },
  "type": "module"
}
```

In the beginning of your **index.js** file, you want to import [node-config](https://github.com/lorenwest/node-config).

```js
import config from 'config';

const {default:configVariable} = await config.get('variable');

console.debug(configVariable.foo);
```

In the above case you could write "Hello World!" to your terminal if **config/test.cjs** and **config/dynamic.js** has the following:

```js
'use strict'

module.exports = {
	variable: import('./dynamic.js')
}
```
_test.cjs_

```js
export default {
	v1: 'var1',
	v2: 'var2',
	foo: 'Hello World!'
}
```
_dynamic.js_


The result of the above should then be:

```
$ npm start

> start
> NODE_ENV=test node index.js

Hello World!
```

Obviously, you can rename `variable` and `configVariable` to what-ever you want.

In my test, I had no issue with the above way of exporting esm as a Promise. But if you do get any issue with with that, you might solve it by wrapping `import()` in `require('config/raw').raw`.
See: https://github.com/node-config/node-config/wiki/Special-features-for-JavaScript-configuration-files#using-promises-processstdout-and-other-objects-in-javascript-config-files.