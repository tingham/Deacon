"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function DOMparseChildren(children) {
    return children.map(function (child) {
        if (typeof child === 'string') {
            return document.createTextNode(child);
        }
        return child;
    });
}
function nonNull(val, fallback) { return Boolean(val) ? val : fallback; }
;
function DOMparseNode(element, properties, children) {
    var el = document.createElement(element);
    Object.keys(nonNull(properties, {})).forEach(function (key) {
        el[key] = properties[key];
    });
    DOMparseChildren(children).forEach(function (child) {
        el.appendChild(child);
    });
    return el;
}
function DOMcreateElement(element, properties) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    if (typeof element === 'function') {
        return element(__assign(__assign({}, nonNull(properties, {})), { children: children }));
    }
    return DOMparseNode(element, properties, children);
}
var Button = function (_a) {
    var msg = _a.msg;
    return DOMcreateElement.createElement("button", { onclick: function () { return alert(msg); } },
        DOMcreateElement.createElement("strong", null, "Click me"));
};
var el = DOMcreateElement.createElement("div", null,
    DOMcreateElement.createElement("h1", { className: "what" }, "Hello world"),
    DOMcreateElement.createElement("p", null, "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae sed consectetur placeat veritatis illo vitae quos aut unde doloribus, minima eveniet et eius voluptatibus minus aperiam sequi asperiores, odio ad?"),
    DOMcreateElement.createElement(Button, { msg: 'Yay' }),
    DOMcreateElement.createElement(Button, { msg: 'Nay' }));
document.body.appendChild(el);
//# sourceMappingURL=index.js.map