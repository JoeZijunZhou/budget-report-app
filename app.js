
// budget controller
var budgetController = (function () {

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
    },
    budget: 0,
    percentage: -1
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum = sum + cur.value;
    });
    data.totals[type] = sum;
  }

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
    // calculate total budget and percentage
    calculateBudget: function () {
      //calculate total expense and income
      calculateTotal('exp');
      calculateTotal('inc');
      //calculate budget: income - expense
      data.budget = data.totals.inc - data.totals.exp;
      //calculate percentage: expense/income
      if (data.totals.inc === 0) {
        data.percentage = -1;
      } else {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      }

    },
    // get total budget and percentage
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
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
          value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
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
    clearFields: function() {
      var fields, fieldArr;
      // get description and value as a list
      fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

      fieldArr = Array.prototype.slice.call(fields);
      // set val of elements in arr to ""
      fieldArr.forEach(function(curVal, index, array) {
        curVal.value = "";
      });
      // cursor focus on description class
      fieldArr[0].focus();
    },
    // get DOM strings method
    getDOMstrings: function () {
      return DOMstrings;
    }
  };

})();

// global app controller
var controller = (function (budgetCtrl, UICtrl) {

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

  var updateBudget = function () {
    var budget;
    // calculate total budget
    budgetCtrl.calculateBudget();
    // return budget
    budget = budgetCtrl.getBudget();
    console.log(budget);
    
    // display budget on UI

  };

  // add item callback function
  var ctrlAddItem = function () {
    console.log('button is clicked');
    var input, newItem;
    // get filed input data
    console.log(UICtrl.getInput());
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // add item to budget controller - store input data
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // add item to UI controller
      UICtrl.addListItem(newItem, input.type);
      // clear input fields
      UICtrl.clearFields();
      // calculate & update budget
      updateBudget();
      // display budget on UI
    }

  }

  // return object
  return {
    // controller init method - listenting to all event
    init: function () {
      console.log('event listener starts!');
      setupEventListeners();
    }
  }

})(budgetController, UIController);

controller.init();
