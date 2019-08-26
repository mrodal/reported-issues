const fs = require('fs');
const path = require('path');
const compiler = require('vue-template-compiler');
const htmlparser = require("htmlparser2");
const {parse} = require('@vue/component-compiler-utils');
const {getOptions} = require('loader-utils');
const schema = require('./options.json');
const validateOptions = require('schema-utils');

const defaultOptions = {
  EXT_POINT_TAG: 'extension-point',
  EXTENSIONS_TAG: 'extensions',
  EXTENSION_TAG: 'extension',
  EXT_POINT_NAME_ATTR: 'name',
  EXT_POINT_REF_ATTR: 'point',
  EXTENDABLE_ATTR: 'extendable',
  EXTENDS_ATTR: 'extends'
};
let options = null;

module.exports = function (source, map) {
  options = {...defaultOptions, ...getOptions(this)};
  validateOptions(schema, options, 'vue-template-inheritance-loader');

  let callback = this.async();
  resolveComponent(source, this).then((finalComponent) => {

    // Remove comment lines at beginning of script block that were generated by the SFC parser
    let finalDescriptor = toDescriptor(finalComponent);
    if (finalDescriptor.script) {
      finalDescriptor.script.content = finalDescriptor.script.content.replace(/^(\/\/\n)+/, '')
    }

    // Change all extension points to <template> on the final component to display fallback content
    if (finalDescriptor.template.attrs[options.EXTENDABLE_ATTR]) {
      let finalDom = htmlparser.parseDOM(finalDescriptor.template.content);
      findDomElementsByTagName(finalDom, options.EXT_POINT_TAG).forEach(ext => {
        ext.name = 'template';
        delete ext.attribs[options.EXT_POINT_NAME_ATTR]
      });
      finalComponent = `<template>
                          ${htmlparser.DomUtils.getOuterHTML(finalDom)}
                        </template> 
                        ${descriptorToHTML(finalDescriptor)}`;
    }

    callback(null,
      finalComponent,
      map);
  }, error => {
    callback(error)
  });
};

function resolveComponent(currentSource, context) {
  return new Promise((resolve, reject) => {
    try {
      let currentDesc = toDescriptor(currentSource);

      // If the component extends another, resolve its source merging it with the base component
      // else return code as is
      if (currentDesc.template.attrs[options.EXTENDS_ATTR]) {
        let baseRelPath = currentDesc.template.attrs[options.EXTENDS_ATTR];
        let baseAbsPath = path.join(context.context, baseRelPath);

        // To make HMR aware of the base file and reload it when it changes
        context.addDependency(baseAbsPath);

        fs.readFile(baseAbsPath, 'utf8', (err, contents) => {
          // File read error, reject
          if (err) reject(err);

          // Resolve the base component recursively to support inheritance in N levels
          resolveComponent(contents, context).then((resolvedComponent) => {
            try {
              let baseDescriptor = toDescriptor(resolvedComponent);

              let baseDom = htmlparser.parseDOM(baseDescriptor.template.content);
              let currentDom = htmlparser.parseDOM(currentDesc.template.content);

              // Get all the child's component extensions
              let extensions = currentDom.find(node => node.type = 'tag' && node.name === options.EXTENSIONS_TAG).children
                .filter(node => node.type = 'tag' && node.name === options.EXTENSION_TAG);

              // Replace each of the Base component's extension points with the child's extensions
              findDomElementsByTagName(baseDom, options.EXT_POINT_TAG).forEach(extPoint => {
                // Find the extend block for the current extension point
                let extendBlock = extensions.find(node => node.attribs[options.EXT_POINT_REF_ATTR] === extPoint.attribs[options.EXT_POINT_NAME_ATTR]);

                // If a extend block matching the extension point was found, replace the point's content with the extend block's
                if (extendBlock) {
                  extPoint.children = extendBlock.children;
                }

                // Change extension point tag to a template tag
                extPoint.name = 'template';
                delete extPoint.attribs[options.EXT_POINT_NAME_ATTR];
              });

              // Resolve promise with the new generated SFC
              resolve(`<template ${options.EXTENDABLE_ATTR}>
                         ${htmlparser.DomUtils.getOuterHTML(baseDom)}
                       </template> 
                       ${descriptorToHTML(currentDesc)}`);
            } catch (e) {
              reject(e)
            }
          }, e => {
            reject(e)
          });
        });
      } else {
        resolve(currentSource);
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Returns the SFC descriptor for a given SFC sourcecode
 * @param source
 */
function toDescriptor(source) {
  return parse({
    source: source,
    compiler,
    needMap: false
  });
}

function findDomElementsByTagName(dom, tag) {
  return htmlparser.DomUtils.findAll(node => (node.type === 'tag' && node.name === tag), dom)
}

/**
 * Given a SFC's descriptor, returns the SFC's source **without** the template part
 * @param descriptor - SFC descriptor
 * @returns {string} - SFC source code
 */
function descriptorToHTML(descriptor) {
  return descriptor.customBlocks
      .filter(cb => cb.type !== options.EXTENSION_TAG)
      .map(cb => blockToHTML(cb))
      .join('\n') +
    blockToHTML(descriptor.script) +
    descriptor.styles
      .map(cb => blockToHTML(cb))
      .join('\n');
}

function blockToHTML(block) {
  if (block) {
    let attrToHtmlAttr = ([key, value]) => ` ${key}="${value}" `;
    let attrs = Object.entries(block.attrs).reduce((accum, curr) => accum + attrToHtmlAttr(curr), '');
    return `<${block.type} ${attrs}>${block.content}</${block.type}>`
  }
}