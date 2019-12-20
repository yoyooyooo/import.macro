const { createMacro } = require('babel-plugin-macros');
const template = require('@babel/template');
const t = require('@babel/types');
const _ = require('lodash');

function Error(path, msg) {
  throw path.buildCodeFrameError('\nMacro error: \x1b[31m' + msg + '\x1b[0m');
}

function hasImported(state, path, source, importConfig) {
  if (importConfig[1].transformSource) {
    source = importConfig[1].transformSource(source);
  }
  return state.file.path.get('body').find(path => {
    if (path.isImportDeclaration()) {
      return source === path.get('source.value').node;
    } else {
      return false;
    }
  });
}

function addImport(
  { state, config },
  { importConfig, path, source, filename, options }
) {
  if (importConfig[1].transformSource) {
    source = importConfig[1].transformSource(source);
  }

  options = { isDefaultExport: true, ...options };

  if (!hasImported(state, path, source, importConfig)) {
    const importNode = t.importDeclaration(
      [
        options.isDefaultExport
          ? t.importDefaultSpecifier(t.identifier(filename))
          : t.importSpecifier(t.identifier(filename), t.identifier(filename))
      ],
      t.stringLiteral(source)
    );
    state.file.path.unshiftContainer('body', importNode);
  }
}

function replaceNode(context, { path, importConfig, filename, args = [] }) {
  let options = importConfig[1];

  const { config, state } = context;

  let iconNode;
  if (filename.startsWith('@')) {
    options = {
      ...options,
      ...((args[2] && args[2].evaluate().value) || {})
    };
    let props = args[1];
    if (props && t.isObjectExpression(props)) {
      props = props.node.properties.map(({ key, value }) =>
        t.jsxAttribute(
          t.jsxIdentifier(key.name),
          t.jsxExpressionContainer(value)
        )
      );
    }
    filename = filename.slice(1);
    iconNode = t.jsxElement(
      t.jsxOpeningElement(t.jsxIdentifier(filename), props || [], true),
      null,
      [],
      true
    );
  } else {
    options = {
      ...options,
      ...((args[1] && args[1].evaluate().value) || {})
    };
    iconNode = t.identifier(filename);
  }
  const source = options.prefix + '/' + filename;
  addImport(context, {
    path,
    source,
    filename,
    options,
    importConfig
  });

  path.parentPath.replaceWith(iconNode);
}

module.exports = createMacro(
  context => {
    const { references, state, config } = context;
    const programPath = state.file.path;

    references.default &&
      references.default.forEach(path => {
        if (path.parentPath.isCallExpression()) {
          const args = path.parentPath.get('arguments');
          const options = {
            ...(config.defaultImport || {}),
            ...((args[1] && args[1].evaluate().value) || {})
          };
          let source = args[0].evaluate().value;
          source =
            config.defaultImport && config.defaultImport.prefix
              ? config.defaultImport.prefix + '/' + source
              : source;
          const importConfig = [null, config.defaultImport || {}];
          const matchedImport = hasImported(state, path, source, importConfig);
          let filename;
          if (matchedImport) {
            filename = matchedImport.node.specifiers[0].local.name;
          } else {
            filename = path.parentPath.scope.generateUid(source);
            addImport(context, {
              path,
              source,
              filename,
              options,
              importConfig
            });
          }
          path.parentPath.replaceWith(t.identifier(filename));
        }
      });

    config.imports.forEach(importConfig => {
      if (!Array.isArray(importConfig)) {
        Error(programPath, "importHelper.imports's item must be array");
      } else {
        if (!importConfig[1] || !importConfig[1].prefix) {
          Error(
            programPath,
            "importHelper.imports's item option must have filed [prefix]"
          );
        }
      }
      references[importConfig[0]] &&
        references[importConfig[0]].forEach(path => {
          if (path.parentPath.isTaggedTemplateExpression()) {
            const quasiPath = path.parentPath.get('quasi.quasis');
            let filename = quasiPath[0].node.value.cooked;
            replaceNode(context, { path, importConfig, filename });
          } else if (path.parentPath.isCallExpression()) {
            const args = path.parentPath.get('arguments');
            const filename = args[0].evaluate().value;
            replaceNode(context, { path, importConfig, filename, args });
          }
        });
    });
  },
  { configName: 'importHelper' }
);
