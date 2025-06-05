const pluginTester = require('babel-plugin-tester');
const path = require('path');
const plugin = require('babel-plugin-macros');

pluginTester.default({
  pluginName: 'icon',
  plugin,
  snapshot: true,
  babelOptions: { filename: __filename, parserOpts: { plugins: ['jsx'] }, babelrc: false, configFile: false },
  pluginOptions: {
    macros: {
      // Define an alias for the macro. The key 'customMacro' will be used in imports.
      customMacro: require.resolve('../macro.js')
    }
  },
  tests: {
    'default import': `
        import i from 'customMacro';
        i("./a/b", { isDefaultExport: false });
      `,
    'default import with options': `
        import i from 'customMacro';
        i("./a/b");
      `,
    'default duplicate import': `
        import i from 'customMacro';
        i("./a/b");
        i("./a/b");
      `,
    'template-tag': `
        import { muiIcon } from 'customMacro';
        muiIcon\`Palette\`;
      `,
    'template-tag as component': `
        import { muiIcon } from 'customMacro';
        muiIcon\`@Palette\`;
      `,
    function: `
        import { muiIcon } from 'customMacro';
        muiIcon('Palette');
      `,
    'function as component': `
        import { muiIcon } from 'customMacro';
        muiIcon('@Palette');
      `,
    'function component with props': `
        import { muiIcon } from 'customMacro';
        muiIcon('@Palette', { a: 1, b: 2 });
      `,
    'function component with options': `
        import { muiIcon } from 'customMacro';
        muiIcon('@Palette', { isDefaultExport: false });
      `,
    'function with options': `
        import { muiIcon } from 'customMacro';
        muiIcon('Palette', { isDefaultExport: false });
      `,
    'function component with props and options': `
        import { muiIcon } from 'customMacro';
        muiIcon('@Palette', { a: 1, b: 2 }, { isDefaultExport: false });
      `,
    duplicate: `
        import { muiIcon } from 'customMacro';
        muiIcon('Palette');
        muiIcon('Palette');
      `
  }
});
