const path = require('path');
const babel = require('@babel/core');
const generator = require('@babel/generator');
const traverse = require('@babel/traverse');
const { parse } = require('@babel/parser');
const template = require('@babel/template');
const t = require('@babel/types');

const code = `
i(\`asas\`)
`;

const ast = babel.parse(code, {
  sourceType: 'module',
  plugins: ['@babel/plugin-syntax-jsx']
});
traverse.default(ast, {
  Program(path) {},
  CallExpression(path) {}
});
const output = generator.default(ast, {}, code);

console.log('\noutput========>\n', output.code);
