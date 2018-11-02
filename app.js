
// buget controller
var bugetController = (function () {

})();

// UI controller
var UIController = (function () {
  // make DOM classes configurable - make a DOMstrings object
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  };

  // return object
  return {
    // get input method
    getInput: function () {
      return {
          type: document.querySelector(DOMstrings.inputType).value,
          description: document.querySelector(DOMstrings.inputDescription).value,
          value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    // get DOM strings method
    getDOMstrings: function () {
      return DOMstrings;
    }
  };

})();

// global app controller
var controller = (function (bugetCtrl, UICtrl) {

  // init event listener for all event -- highest level
  var setupEventListeners = function () {
    // get DOM classes
    var DOM = UICtrl.getDOMstrings();

    // add a new item event handler
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    // keyboard enter
    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  }

  // add item callback function
  var ctrlAddItem = function () {
    console.log('button is clicked');
    // get filed input date
    console.log(UICtrl.getInput());
    // add item to budget controller
    // add item to UI controller
    // calculate budget
    // display budget on UI
  }

  // return object
  return {
    // controller init method - listenting to all event
    init: function () {
      console.log('event listener starts!');
      setupEventListeners();
    }
  }

})(bugetController, UIController);

controller.init();
