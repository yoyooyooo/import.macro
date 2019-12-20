English | [简体中文](./README_zh-CN.md)

<div align="center">
<h1>import.macro</h1>
auto import importDeclaration
</div>

[![NPM version](https://img.shields.io/npm/v/import.macro.svg?style=flat)](https://npmjs.org/package/import.macro)
[![Build Status](https://travis-ci.org/yoyooyooo/import.macro.svg?branch=master)](https://travis-ci.org/yoyooyooo/import.macro)
[![codecov](https://codecov.io/gh/yoyooyooo/import.macro/branch/master/graph/badge.svg)](https://codecov.io/gh/yoyooyooo/import.macro)

## install

```shell
npm i -D import.macro
// or
yarn add -D import.macro
```

## unsure you have install babel-plugin-macros

`.babelrc`

```shell
{
  plugins: ['babel-plugin-macros']
}
```

## useage

```js
import i from 'import.macro';
i('./a/b');
i('./a/b');
```

output：

```js
import _aB from './a/b';
_aB;
_aB;
```

## custom import

add a config file:

- .babel-plugin-macrosrc
- .babel-plugin-macrosrc.json
- .babel-plugin-macrosrc.yaml
- .babel-plugin-macrosrc.yml
- .babel-plugin-macrosrc.js
- babel-plugin-macros.config.js
- babelMacros in package.json

Configuration is as follows：

```js
// .babel-plugin-macrosrc.js
module.exports = {
  importHelper: {
    // import i from 'import.macro'
    defaultImport: {
      transformSource: a => a
    },
    imports: [
      [
        'customImport',
        {
          prefix: '/path/to', // prefix source path
          isDefaultExport: true, // default is true
          transformSource: a => a // before add importDeclaration,transform sourcePath
        }
      ]
    ]
  }
};
```

then, you can import `customImport` from `import.macro`：

```js
import { customImport } from 'import.macro';
customImport('filename');
```

output：

```js
import filename from '../a/b/filename';
filename;
```

there are also a default import，you can config it by importHelper.defaultImport.

when start with @, it will compiled to React component

```jsx
import { customImport } from 'import.macro';
customImport('@SomeComponent');
```

会被编译为：

```jsx
<SomeComponent />
```
