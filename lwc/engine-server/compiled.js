'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var lwc = require('@lwc/engine-server');

const $fragment1 = lwc.parseFragment`<span${3}>two</span>`;
const stc0 = {
  key: 0
};
const stc1 = {
  key: 5
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {k: api_key, c: api_custom_element, h: api_element, i: api_iterator, fr: api_fragment, st: api_static_fragment, t: api_text} = $api;
  return [api_element("div", stc0, [$cmp.isPositive ? api_fragment(1, [$cmp.isDivisibleByThree ? api_fragment(2, api_iterator($cmp.someChildren, function (child) {
    return api_element("span", {
      key: api_key(3, child)
    }, [api_custom_element("x-component", _xComponent, {
      props: {
        "label": child,
        "remaining": $cmp.minusOne
      },
      key: 4
    })]);
  }), 0) : $cmp.isDivisibleByTwo ? api_fragment(2, [api_element("div", stc1, [api_static_fragment($fragment1(), 7), api_custom_element("x-component", _xComponent, {
    props: {
      "remaining": $cmp.minusOne
    },
    key: 8
  })])], 0) : api_fragment(2, [api_custom_element("x-component", _xComponent, {
    props: {
      "remaining": $cmp.minusOne
    },
    key: 9
  })], 0)], 0) : api_fragment(1, [api_text("terminal node")], 0)])];
  /*LWC compiler v5.1.0*/
}
var _tmpl = lwc.registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-6a8uqob2ku4";
tmpl.legacyStylesheetToken = "x-component_component";
lwc.freezeTemplate(tmpl);

class Component extends lwc.LightningElement {
  constructor(...args) {
    super(...args);
    this.remaining = 9;
    this.label = 'default';
  }
  get someChildren() {
    return ['a', 'b', 'c'];
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
  /*LWC compiler v5.1.0*/
}
lwc.registerDecorators(Component, {
  publicProps: {
    remaining: {
      config: 0
    },
    label: {
      config: 0
    }
  }
});
var _xComponent = lwc.registerComponent(Component, {
  tmpl: _tmpl,
  sel: "x-component",
  apiVersion: 60
});

const tagName = 'x-component';

exports.default = _xComponent;
exports.tagName = tagName;
