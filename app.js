
// buget controller
var bugetController = (function () {

  // expense object/class constructor
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }
  // income object/class constructor
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  // data object to store all useful data
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  // return object
  return {
    // add new item method - from input to data storage
    addItem: function (type, description, value) {
      var newItem, ID;
      if (data.allItems[type].length === 0) {
        ID = 0;
      } else {
        // get the id of the last item obj in the array
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }

      if (type === 'exp') {
        newItem = new Expense(ID, description, value);
      } else {
        newItem = new Income(ID, description, value);
      }

      // store new item into date
      data.allItems[type].push(newItem);

      // return new item object
      return newItem;
    },
    // testing method
    testing: function () {
      console.log(data);
    }
  };

})();


// UI controller
var UIController = (function () {
  // make DOM classes configurable - make a DOMstrings object
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    expensesContainer: '.expenses__list',
    incomeContainer: '.income__list'
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
    // add item to the list UI method
    addListItem: function (obj, type) {
      var html, newHtml, element;
      // create HTMl strings with placeholder text
      if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="expense-%id%">\
                    <div class="item__description">%description%</div>\
                    <div class="right clearfix">\
                        <div class="item__value">%value%</div>\
                        <div class="item__percentage">21%</div>\
                        <div class="item__delete">\
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\
                        </div>\
                    </div>\
                </div>';
      } else {
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%">\
                    <div class="item__description">%description%</div>\
                    <div class="right clearfix">\
                        <div class="item__value">%value%</div>\
                        <div class="item__delete">\
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\
                        </div>\
                    </div>\
                </div>';
      }
      // replace the placeholder with actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);
      // insert HTML into DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
    var input, newItem;
    // get filed input data
    console.log(UICtrl.getInput());
    input = UICtrl.getInput();
    // add item to budget controller - store input data
    newItem = bugetCtrl.addItem(input.type, input.description, input.value);
    // add item to UI controller
    UICtrl.addListItem(newItem, input.type);
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
