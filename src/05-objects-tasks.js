/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
const PS_NO_SELECTOR = 'noPrevSelector';
const PS_ELM = 'element';
const PS_ID = 'id';
const PS_CLASS = 'class';
const PS_ATTR = 'attr';
const PS_P_CLASS = 'pseudoClass';
const PS_P_ELM = 'pseudoElement';

const PS_ARR = [PS_CLASS, PS_ATTR, PS_P_CLASS, PS_P_ELM];

const ERR_ONE_ELM_ID_P_ELM = 'Element, id and pseudo-element should not occur more then one time inside the selector';
const ERR_WRONG_ORDER = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';

class MakeCssSelector {
  constructor() {
    this.store = '';
    this.prevSelector = PS_NO_SELECTOR;
  }

  element(value) {
    // console.log(value);
    if (this.prevSelector === PS_ELM) { throw new Error(ERR_ONE_ELM_ID_P_ELM); }
    if (this.prevSelector !== PS_NO_SELECTOR) throw new Error(ERR_WRONG_ORDER);

    this.prevSelector = PS_ELM;
    this.store += value;
    return this;
  }

  id(value) {
    // console.log(this.store);
    if (this.prevSelector === PS_ID) { throw new Error(ERR_ONE_ELM_ID_P_ELM); }
    if (PS_ARR.includes(this.prevSelector)) throw new Error(ERR_WRONG_ORDER);
    this.prevSelector = PS_ID;
    this.store += `#${value}`;
    return this;
  }

  class(value) {
    if (PS_ARR.slice(1).includes(this.prevSelector)) throw new Error(ERR_WRONG_ORDER);
    this.prevSelector = PS_CLASS;
    this.store += `.${value}`;
    return this;
  }

  attr(value) {
    if (PS_ARR.slice(2).includes(this.prevSelector)) throw new Error(ERR_WRONG_ORDER);
    this.prevSelector = PS_ATTR;
    this.store += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    if (PS_ARR.slice(3).includes(this.prevSelector)) throw new Error(ERR_WRONG_ORDER);
    this.prevSelector = PS_P_CLASS;
    this.store += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    if (this.prevSelector === PS_P_ELM) { throw new Error(ERR_ONE_ELM_ID_P_ELM); }
    this.prevSelector = PS_P_ELM;
    this.store += `::${value}`;
    return this;
  }

  combine(selector1, combinator, selector2) {
    // console.log(selector1.stringify(), selector2.stringify())
    // debugger
    this.store = `${selector1.toString()} ${combinator} ${selector2.toString()}`;
    return this;
  }

  toString() {
    return this.store;
  }

  stringify() {
    return this.store.trim();
  }
}

const cssSelectorBuilder = {

  element(value) {
    return new MakeCssSelector().element(value);
  },

  id(value) {
    return new MakeCssSelector().id(value);
  },

  class(value) {
    return new MakeCssSelector().class(value);
  },

  attr(value) {
    return new MakeCssSelector().attr(value);
  },

  pseudoClass(value) {
    return new MakeCssSelector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new MakeCssSelector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new MakeCssSelector().combine(selector1, combinator, selector2);
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
