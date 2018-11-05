
// budget controller
var budgetController = (function () {

  // expense object/class constructor
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  }
  // use prototype to add method to exp object/class
  Expense.prototype.calculatePercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }

  };
  
  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

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
    // delete item method
    deleteItem: function (type, id) {
      var ids, index;
      // elements in allItems[type] are all inc/exp objects
      // need to get ids in these objects
      ids = data.allItems[type].map(function (curVal) {
        return curVal.id;
      });
      // get idex of ids array
      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }

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
    // calculate percentages
    calculatePercentages: function () {
      data.allItems.exp.forEach(function (cur) {
        cur.calculatePercentage(data.totals.inc);
      });
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
    // get percentages
    getPercentages: function () {
      var allPerc = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },
    // testing method - check data
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
    incomeContainer: '.income__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage'
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
        html = '<div class="item clearfix" id="exp-%id%">\
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
        html = '<div class="item clearfix" id="inc-%id%">\
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
    // delete item from list
    deleteListItem: function (selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);

    },
    // clear input fields
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
    // display budget and percentage
    displayBudget: function (obj) {
      // set DOM label/UI value
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      // display % sign or ---
      if (obj.percentage <= 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      }
    },
    // display percentage
    displayPercentages: function (percentages) {
      // get node list of exp percentage labels
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
    
      // either change node list to array, then use forEach; or customize forEach for node list
      // customize iterator forEach for node list
      var nodeListForEach = function (nodeList, callback) {
        for (let i = 0; i < nodeList.length; i++) {
          callback(nodeList[i], i);
        }
      };

      nodeListForEach(fields, function (curVal, index) {
        if (percentages[index] !== 0) {
          curVal.textContent = percentages[index] + '%'; 
        } else {
          curVal.textContent = '---'; 
        }
      });
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

    // delete an item event handler
    // listen to Lowest common ancester(LCA) of the delete items
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

  };

  var updateBudget = function () {
    var budget;
    // calculate total budget
    budgetCtrl.calculateBudget();
    // return budget
    budget = budgetCtrl.getBudget();
    console.log(budget);
    // display budget on UI
    UICtrl.displayBudget(budget);
  };

  // update percentages
  var updatePercentages = function () {
    // calculate percentages
    budgetCtrl.calculatePercentages();
    // read percentages from budget controller
    var percentages = budgetCtrl.getPercentages();
    console.log(percentages);
    
    // update&diaplay new percentages
    UICtrl.displayPercentages(percentages);
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
      // calculate & display & update budget
      updateBudget();
      // calculate & update percentages
      updatePercentages();
    }

  };

  // delete item callback function
  var ctrlDeleteItem = function (event) {
    var itemID;

    // DOM traversal to find target element
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    console.log(itemID);
    
    if (itemID) {
      // parse type and ID 'inc-1'
      parseID = itemID.split('-');
      type = parseID[0];
      ID = parseInt(parseID[1]);
      
      // delete item from data structure
      budgetCtrl.deleteItem(type, ID);
      // delete item from UI
      UICtrl.deleteListItem(itemID);
      // update&display budget
      updateBudget();
      // calculate & update percentages
      updatePercentages();
    }

    
  };

  // return object
  return {
    // controller init method - listenting to all event
    init: function () {
      console.log('event listener starts!');
      // init UI display
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      // set up all event listener
      setupEventListeners();
    }
  }

})(budgetController, UIController);

controller.init();
