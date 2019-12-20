[English](./README.md) | 简体中文

<div align="center">
<h1>import.macro</h1>
自动注入import
</div>

[![NPM version](https://img.shields.io/npm/v/import.macro.svg?style=flat)](https://npmjs.org/package/import.macro)
[![Build Status](https://travis-ci.org/yoyooyooo/import.macro.svg?branch=master)](https://travis-ci.org/yoyooyooo/import.macro)
[![codecov](https://codecov.io/gh/yoyooyooo/import.macro/branch/master/graph/badge.svg)](https://codecov.io/gh/yoyooyooo/import.macro)

## 安装

```shell
npm i -D import.macro
// or
yarn add -D import.macro
```

## 必须安装 babel-plugin-macros

`.babelrc`

```shell
{
  plugins: ['babel-plugin-macros']
}
```

## 用法

```js
import i from 'import.macro';
i('./a/b');
i('./a/b');
```

会编译成：

```js
import _aB from './a/b';
_aB;
_aB;
```

## 定义指定前缀的 import

现在项目根目录下添加配置文件其中之一:

- .babel-plugin-macrosrc
- .babel-plugin-macrosrc.json
- .babel-plugin-macrosrc.yaml
- .babel-plugin-macrosrc.yml
- .babel-plugin-macrosrc.js
- babel-plugin-macros.config.js
- babelMacros in package.json

加如下配置：

```js
// .babel-plugin-macrosrc.js
module.exports = {
  importHelper: {
    // import i from 'import.macro' 引入时默认配置
    defaultImport: {
      transformSource: a => a
    },
    imports: [
      [
        'customImport',
        {
          prefix: '/path/to', // 路径补全前缀
          isDefaultExport: true, // 是否默认导出，默认为true
          transformSource: a => a // 插入import声明前改变导入路径
        }
      ]
    ]
  }
};
```

然后就可以从`import.macro`里引入刚刚定义的`customImport`：

```js
import { customImport } from 'import.macro';
customImport('filename');
```

会被编译成：

```js
import filename from '../a/b/filename';
filename;
```

默认也会到出一个 import，可以通过 importHelper.defaultImport 配置其行为。

默认 import 只支持函数调用，用作简单引入用，自定义 import 可以使用模板字符串式引入，并且当参数字符串以@开头时，会被编译成 React 组件，例：

```jsx
import { customImport } from 'import.macro';
customImport('@SomeComponent');
```

会被编译为：

```jsx
<SomeComponent />
```
