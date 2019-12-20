const pluginTester = require('babel-plugin-tester');
const path = require('path');
const plugin = require('babel-plugin-macros');

pluginTester.default({
  pluginName: 'icon',
  plugin,
  snapshot: true,
  babelOptions: { filename: __filename, parserOpts: { plugins: ['jsx'] } },
  tests: {
    'default import': `
        import i from '../macro';
        i("./a/b", { isDefaultExport: false });
      `,
    'default import with options': `
        import i from '../macro';
        i("./a/b");
      `,
    'default duplicate import': `
        import i from '../macro';
        i("./a/b");
        i("./a/b");
      `,
    'template-tag': `
        import { muiIcon } from '../macro';
        muiIcon\`Palette\`;
      `,
    'template-tag as component': `
        import { muiIcon } from '../macro';
        muiIcon\`@Palette\`;
      `,
    function: `
        import { muiIcon } from '../macro';
        muiIcon('Palette');
      `,
    'function as component': `
        import { muiIcon } from '../macro';
        muiIcon('@Palette');
      `,
    'function component with props': `
        import { muiIcon } from '../macro';
        muiIcon('@Palette', { a: 1, b: 2 });
      `,
    'function component with options': `
        import { muiIcon } from '../macro';
        muiIcon('@Palette', { isDefaultExport: false });
      `,
    'function with options': `
        import { muiIcon } from '../macro';
        muiIcon('Palette', { isDefaultExport: false });
      `,
    'function component with props and options': `
        import { muiIcon } from '../macro';
        muiIcon('@Palette', { a: 1, b: 2 }, { isDefaultExport: false });
      `,
    duplicate: `
        import { muiIcon } from '../macro';
        muiIcon('Palette');
        muiIcon('Palette');
      `
  }
});
