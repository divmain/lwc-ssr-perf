'use strict';

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var asyncNoYield = {exports: {}};

var compiled = {};

const MULTI_SPACE = /\s+/g;

class ClassList {
    constructor(el) {
        this.el = el;
    }

    add(...newClassNames) {
        const className = this.el.className;
        const set = new Set(className.split(MULTI_SPACE).filter(Boolean));
        for (const newClassName of newClassNames) {
            set.add(newClassName);
        }
        this.el.className = Array.from(set).join(' ');
    }

    contains(className) {
        const currentClassNameStr = this.el.className;
        return new RegExp(`\\b${className}\\b`).test(currentClassNameStr);
    }

    remove(...deprecatedClassNames) {
        const className = this.el.className;
        const set = new Set(className.split(MULTI_SPACE).filter(Boolean));
        for (const newClassName of deprecatedClassNames) {
            set.delete(newClassName);
        }
        this.el.className = Array.from(set).join(' ');
    }

    replace(oldClassName, newClassName) {
        let classWasReplaced = false;
        const className = this.el.className;
        const listOfClasses = className.split(MULTI_SPACE).filter(Boolean);
        listOfClasses.forEach((value, idx) => {
            if (value === oldClassName) {
                classWasReplaced = true;
                listOfClasses[idx] = newClassName;
            }
        });
        this.el.className = listOfClasses.join(' ');
        return classWasReplaced;
    }

    toggle(classNameToToggle, force) {
        const classNameStr = this.el.className;
        const set = new Set(classNameStr.split(MULTI_SPACE).filter(Boolean));
        if (!set.has(classNameToToggle) && force !== false) {
            set.add(classNameToToggle);
        } else if (set.has(classNameToToggle) && force !== true) {
            set.remove(classNameToToggle);
        }
        this.el.className = Array.from(set).join(' ');
        return set.has(classNameToToggle);
    }
}

class LightningElement {
    constructor(propsAvailableAtConstruction) {
        Object.assign(this, propsAvailableAtConstruction);
        this.isConnected = false;
    }

    __internal__setState(props, reflectedProps, attrs) {
        Object.assign(this, props);
        this.__attrs = attrs;

        // Whenever a reflected prop changes, we'll update the original props object
        // that was passed in. That'll be referenced when the attrs are rendered later.
        for (const reflectedPropName of reflectedProps) {
            Object.defineProperty(this, reflectedPropName, {
                get() {
                    return props[reflectedPropName];
                },
                set(newValue) {
                    props[reflectedPropName] = newValue;
                },
                enumerable: true,
            });
        }

        Object.defineProperty(this, 'className', {
            get() {
                return props.class ?? '';
            },
            set(newVal) {
                props.class = newVal;
                attrs.class = newVal;
            },
        });
    }

    __classList = null;
    get classList() {
        if (this.__classList) {
            return this.__classList;
        }
        return (this.__classList = new ClassList(this));
    }

    getAttribute(attrName) {
        return this.__attrs[attrName];
    }
}

const escapeAttrVal = (attrVal) => attrVal.replaceAll('"', '&quot;').replaceAll('&', '&amp;');

function renderAttrs(emit, attrs) {
    if (!attrs) {
        return;
    }
    for (const [key, val] of Object.entries(attrs)) {
        if (val) {
            if (typeof val === 'string') {
                emit(` ${key}="${escapeAttrVal(val)}"`);
            } else {
                emit(` ${key}`);
            }
        }
    }
}

function fallbackTmpl(emit, _props, attrs, _slotted, Cmp, _instance) {
    if (Cmp.renderMode !== 'light') {
        emit('<template shadowroot="open">');
    }
    if (Cmp.renderMode !== 'light') {
        emit('</template>');
    }
}

// eslint-disable-next-line no-undef
var runtimeNoYield = {
    LightningElement,
    fallbackTmpl,
    renderAttrs,
};

Object.defineProperty(compiled, '__esModule', { value: true });

var runtime = runtimeNoYield;

var defaultStylesheets = undefined;

async function tmpl(emit, props, attrs, slotted, Cmp, instance, stylesheets) {
  if (Cmp.renderMode !== 'light') {
    emit(`<template shadowroot="open"${Cmp.delegatesFocus ? ' shadowrootdelegatesfocus' : ''}>`);
  }
  for (const stylesheet of stylesheets ?? []) {
    const token = null;
    const useActualHostSelector = true;
    const useNativeDirPseudoclass = null;
    emit('<style type="text/css">');
    await stylesheet(emit, token, useActualHostSelector, useNativeDirPseudoclass);
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
          await generateMarkup(emit, "x-component", childProps, childAttrs, childSlottedContentGenerators);
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
        await generateMarkup(emit, "x-component", childProps, childAttrs, childSlottedContentGenerators);
      }
      emit("</div>");
    } else {
      {
        const childProps = {
          remaining: instance.minusOne
        };
        const childAttrs = {};
        const childSlottedContentGenerators = {};
        await generateMarkup(emit, "x-component", childProps, childAttrs, childSlottedContentGenerators);
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
async function generateMarkup(emit, tagName, props, attrs, slotted) {
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
  await tmplFn(emit, props, attrs, slotted, Component, instance, defaultStylesheets);
  emit(`</${tagName}>`);
}

const tagName = 'x-component';

compiled.default = Component;
compiled.generateMarkup = generateMarkup;
compiled.tagName = tagName;

(function (module) {
	const compiledModule = compiled;

	async function serverSideRenderComponent(tagName, compiledGenerateMarkup, props) {
	  let markup = '';
	  const emit = (segment) => markup += segment;
	  await compiledGenerateMarkup(emit, tagName, props, null, null);
	  return markup;
	}

	module.exports = async (remaining) => serverSideRenderComponent(
	  compiledModule.tagName,
	  compiledModule.generateMarkup,
	  { remaining },
	);
} (asyncNoYield));

var asyncNoYieldExports = asyncNoYield.exports;
var index = /*@__PURE__*/getDefaultExportFromCjs(asyncNoYieldExports);

module.exports = index;
