'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var runtime = require('./experimental-ssr-runtime');

var defaultStylesheets = undefined;

function* tmpl(props, attrs, slotted, Cmp, instance, stylesheets) {
  if (Cmp.renderMode !== 'light') {
    yield `<template shadowroot="open"${Cmp.delegatesFocus ? ' shadowrootdelegatesfocus' : ''}>`;
  }
  for (const stylesheet of stylesheets ?? []) {
    const token = null;
    const useActualHostSelector = true;
    const useNativeDirPseudoclass = null;
    yield '<style type="text/css">';
    yield stylesheet(token, useActualHostSelector, useNativeDirPseudoclass);
    yield '</style>';
  }
  yield "<div>";
  if (instance.isPositive) {
    if (instance.isDivisibleByThree) {
      for (let [__unused__, child] of Object.entries(instance.someChildren ?? ({}))) {
        yield "<span";
        yield ">";
        {
          const childProps = {
            label: child,
            remaining: instance.minusOne
          };
          const childAttrs = {};
          const childSlottedContentGenerators = {};
          yield* generateMarkup("x-component", childProps, childAttrs, childSlottedContentGenerators);
        }
        yield "</span>";
      }
    } else if (instance.isDivisibleByTwo) {
      yield "<div";
      yield ">";
      yield "<span";
      yield ">";
      yield "two";
      yield "</span>";
      {
        const childProps = {
          remaining: instance.minusOne
        };
        const childAttrs = {};
        const childSlottedContentGenerators = {};
        yield* generateMarkup("x-component", childProps, childAttrs, childSlottedContentGenerators);
      }
      yield "</div>";
    } else {
      {
        const childProps = {
          remaining: instance.minusOne
        };
        const childAttrs = {};
        const childSlottedContentGenerators = {};
        yield* generateMarkup("x-component", childProps, childAttrs, childSlottedContentGenerators);
      }
    }
  } else {
    yield "terminal node";
  }
  yield "</div>";
  if (Cmp.renderMode !== 'light') {
    yield '</template>';
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
function* generateMarkup(tagName, props, attrs, slotted) {
  attrs = attrs ?? ({});
  const instance = new Component({
    tagName: tagName.toUpperCase()
  });
  instance.__internal__setState(props, __REFLECTED_PROPS__, attrs);
  instance.isConnected = true;
  instance.connectedCallback?.();
  yield `<${tagName}`;
  yield* runtime.renderAttrs(attrs);
  yield '>';
  const tmplFn = tmpl ?? runtime.fallbackTmpl;
  yield* tmplFn(props, attrs, slotted, Component, instance, defaultStylesheets);
  yield `</${tagName}>`;
}

const tagName = 'x-component';

exports.default = Component;
exports.generateMarkup = generateMarkup;
exports.tagName = tagName;
