window.$ = window.jQuery = function(selectorOrArrayOrTemplate) {
  let elements;
  if (typeof selectorOrArrayOrTemplate === "string") {
    if (selectorOrArrayOrTemplate[0] === "<") {
      elements = [createElement(selectorOrArrayOrTemplate)];
    } else {
      elements = document.querySelectorAll(selectorOrArrayOrTemplate);
    }
  } else if (selectorOrArrayOrTemplate instanceof Array) {
    elements = selectorOrArrayOrTemplate;
  }

  function createElement(string) {
    const container = document.createElement("template");
    container.innerHTML = string.trim();
    return container.content.firstChild;
  }

  const api = Object.create(jQuery.prototype);
  Object.assign(api, {
    elements: elements, //因为把函数放到了原型里，导致调用函数时获取不到elements，
    //所以把elements当作自身属性挂到对象上，然后在原型里通过this.elements获取
    oldApi: selectorOrArrayOrTemplate.oldApi
  });
  return api;
};

jQuery.fn = jQuery.prototype = {
  constructor: jQuery,
  addClass(className) {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].classList.add(className);
    }
    return this;
  },
  find(selector1) {
    let array = [];
    for (let i = 0; i < this.elements.length; i++) {
      array = array.concat(
        Array.from(this.elements[i].querySelectorAll(selector1))
      );
    }
    array.oldApi = this;
    return jQuery(array);
  },
  appendTo(node) {
    this.each(el => node.appendChild(el));
    return this;
  },
  each(fn) {
    for (let i = 0; i < this.elements.length; i++) {
      fn.call(null, this.elements[i], i);
    }
    return this; //this就是当前的api对象！
  },
  parent() {
    const array = []; //容纳爸爸
    this.each(node => {
      if (array.indexOf(node.parentNode) === -1) {
        array.push(node.parentNode);
      } //防止一个爸爸里有三个同名的孩子，这种情况下，如果不做判断，会返回三个一样的爸爸
    });
    return jQuery(array); //返回一个可以操作这些爸爸的对象
  },
  children() {
    const array = [];
    this.each(node => {
      array.push(...node.children); //node.children是一个数组，新语法在数组前边加...，把数组展开成元素的意思
    });
    return jQuery(array);
  },
  next() {
    const array = [];
    this.each(node => {
      array.push(node.nextElementSibling);
    });
    return jQuery(array);
  },
  prev() {
    const array = [];
    this.each(node => {
      array.push(node.previousElementSibling);
    });
    return jQuery(array);
  },
  print() {
    console.log(elements); //elements就是当前对象操作的元素们
  },
  end() {
    return this.oldApi;
  }
};
