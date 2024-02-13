'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var runtime = require('../runtime-no-yield');

var defaultStylesheets = undefined;

function tmpl(emit, props, attrs, slotted, Cmp, instance, stylesheets) {
  if (Cmp.renderMode !== 'light') {
    emit(`<template shadowroot="open"${Cmp.delegatesFocus ? ' shadowrootdelegatesfocus' : ''}>`);
  }
  for (const stylesheet of stylesheets ?? []) {
    const token = null;
    const useActualHostSelector = true;
    const useNativeDirPseudoclass = null;
    emit('<style type="text/css">');
    stylesheet(emit, token, useActualHostSelector, useNativeDirPseudoclass);
    emit('</style>');
  }
  emit("<div>");
  if (instance.isPositive) {
    if (instance.isDivisibleByThree) {
      for (let [__unused__, child] of Object.entries(instance.someChildren ?? ({}))) {
        emit("<span");
        emit(">");
        {
          const childProps = {
            label: child,
            remaining: instance.minusOne
          };
          const childAttrs = {};
          const childSlottedContentGenerators = {};
          generateMarkup(emit, "x-component", childProps, childAttrs, childSlottedContentGenerators);
        }
        emit("</span>");
      }
    } else if (instance.isDivisibleByTwo) {
      emit("<div");
      emit(">");
      emit("<span");
      emit(">");
      emit("two");
      emit("</span>");
      {
        const childProps = {
          remaining: instance.minusOne
        };
        const childAttrs = {};
        const childSlottedContentGenerators = {};
        generateMarkup(emit, "x-component", childProps, childAttrs, childSlottedContentGenerators);
      }
      emit("</div>");
    } else {
      {
        const childProps = {
          remaining: instance.minusOne
        };
        const childAttrs = {};
        const childSlottedContentGenerators = {};
        generateMarkup(emit, "x-component", childProps, childAttrs, childSlottedContentGenerators);
      }
    }
  } else {
    emit("terminal node");
  }
  emit("</div>");
  if (Cmp.renderMode !== 'light') {
    emit('</template>');
  }
}

class Component extends runtime.LightningElement {
  remaining = 9;
  label = "default";
  get someChildren() {
    return ["a", "b", "c"];
  }
  get isPositive() {
    return this.remaining > 0;
  }
  get isDivisibleByThree() {
    return this.remaining % 3 === 0;
  }
  get isDivisibleByTwo() {
    return this.remaining % 3 === 0;
  }
  get minusOne() {
    return this.remaining - 1;
  }
}
const __REFLECTED_PROPS__ = [];
function generateMarkup(emit, tagName, props, attrs, slotted) {
  attrs = attrs ?? ({});
  const instance = new Component({
    tagName: tagName.toUpperCase()
  });
  instance.__internal__setState(props, __REFLECTED_PROPS__, attrs);
  instance.isConnected = true;
  instance.connectedCallback?.();
  emit(`<${tagName}`);
  runtime.renderAttrs(emit, attrs);
  emit('>');
  const tmplFn = tmpl ?? runtime.fallbackTmpl;
  tmplFn(emit, props, attrs, slotted, Component, instance, defaultStylesheets);
  emit(`</${tagName}>`);
}

const tagName = 'x-component';

exports.default = Component;
exports.generateMarkup = generateMarkup;
exports.tagName = tagName;
