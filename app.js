var UIcontroller=(function(){
    var Domstring={
        inputBtn: '.add__btn',
        inputType:'.add__type',
        inputDescription: '.add__description',
        inputType: '.add__type',
        inputValue: '.add__value',
        expenseElement: '.expenses__list',
        incomeElement: '.income__list',
        budgetLable: '.budget__value',
        totalExpLable: '.budget__expenses--value',
        totalIncLable: '.budget__income--value',
        percentageLable: '.budget__expenses--percentage',
        container : '.container',
        expPercLable: '.item__percentage',
        date: '.budget__title--month'
    }
    var formatNum= function(num,type){
        num=Math.abs(num);
        num=num.toFixed(2);
        var numsplit=num.split('.');
        var int=numsplit[0];
        var dec=numsplit[1];
        if(int.length>3){
            int=int.substr(0,int.length-3)+','+int.substr(int.length-3,int.length);
        }
        return (type==='exp'? '-': '+')+' '+int+'.'+dec;
    }
    return{
         getInput:function(){
                 return{
                        type:document.querySelector(Domstring.inputType).value,
                        description:document.querySelector(Domstring.inputDescription).value,
                        value: parseFloat(document.querySelector(Domstring.inputValue).value)
                      }
                     },
        getDomstring: function(){
                return Domstring;
                             },
        addlistItem : function(obj,type){
                var html,newHtml,element;
                if (type==='inc'){
                    element=Domstring.incomeElement;
                html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';}
                else if(type==='exp'){
                    element=Domstring.expenseElement;
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';}
                newHtml=html.replace('%id%',obj.id);
                newHtml=newHtml.replace('%description%',obj.description);
                newHtml=newHtml.replace('%value%',formatNum(obj.value,type));
                document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        clearFieldItem : function(){
            var field,fieldArr;
            field=document.querySelectorAll(Domstring.inputDescription+','+Domstring.inputValue);
            fieldArr=Array.prototype.slice.call(field);
            fieldArr.forEach(function(current) {
                current.value='';
            });
            fieldArr[0].focus();
            },
        displayBudget: function(obj){
            var type=(obj.totalExp<=obj.totalInc) ? 'inc':'exp';
            document.querySelector(Domstring.budgetLable).textContent=formatNum(obj.budget,type);
            document.querySelector(Domstring.totalExpLable).textContent=formatNum(obj.totalExp,'exp');
            document.querySelector(Domstring.totalIncLable).textContent=formatNum(obj.totalInc,'inc');
            if(obj.percent===-1)
            document.querySelector(Domstring.percentageLable).textContent='---';
            else
            document.querySelector(Domstring.percentageLable).textContent=obj.percent+'%';
            console.log(obj.percent);
        },
        displayPercentage: function(percentage){
            var field=document.querySelectorAll(Domstring.expPercLable);
            var nodelistForEach=function(list,callBack){
                for(i=0; i<list.length; i++){
                    callBack(list[i],i);
                }
            }
            nodelistForEach(field,function(current,index){
                if(percentage[index]>0){
                    current.textContent=percentage[index]+'%';
                }
                else{
                    current.textContent='---';
                }
            })
        },
       
        deleteListItem: function(selectorID){
            document.getElementById(selectorID).parentNode.removeChild(document.getElementById(selectorID));
        },
        displayMonth: function(){
            var now,month,year;
            now=new Date();
            month =now.getMonth();
            year =now.getFullYear();
            var months=['Jan','Fab','Match','April','May','Jun','July','Aug','Sep','Oct','Nov','Dec'];
            document.querySelector(Domstring.date).textContent=months[month]+','+year;
        }
}
  
})();

var BudgetController=(function(){
    var income=function(id,description,value){
            this.id=id;
            this.description=description;
            this.value=value;
    }

    var expense=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
}
expense.prototype.calcPercentage= function(totalIncome){
    if(totalIncome>0){
        this.percentage= Math.round((this.value/totalIncome)*100);
    }
}
expense.prototype.getPercentage=function(){
    return this.percentage;
}
   var data={
        allitems :{
            exp: [],
            inc: []
        },
        totals :{
            exp :0,
            inc :0
        },
        budget :0,
        percentage : -1
    }
    var calculateTotal=function(type){
        var sum=0;
        data.allitems[type].forEach(function(cur){
            sum+=cur.value;
        })
        data.totals[type]=sum;
    }
    
    

    return {
        additem :function(type,description,value){
            var newitem,ID;
            if(data.allitems[type].length>0){
            ID=data.allitems[type][data.allitems[type].length-1].id+1;}
            else{
            ID=0;}

            if (type==='inc'){
            newitem=new income(ID,description,value);}
            else if (type==='exp'){
            newitem=new expense(ID,description,value);}
            data.allitems[type].push(newitem);
            return newitem;
           
        },
        calculateBudget:function(){
            //1 total income & total expense
            calculateTotal('exp');
            calculateTotal('inc');
            //2 persentage : total expense/total income *100
            data.budget=data.totals.inc-data.totals.exp;
            //3 budget : total income- total expense
            if(data.totals.inc > 0){
            data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);}
            else{
                data.percentage=-1;
            }
        },
        getBudget:function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percent: data.percentage
            }
        },
        deleteItem: function(type,id){
            var ids;
            ids=data.allitems[type].map(function(current){
                return current.id;
            })
            var index = ids.indexOf(id);
            if (index !== -1){
                data.allitems[type].splice(index,1);
            }
        },
        calculatePercentage: function(){
            data.allitems.exp.forEach(function(current){
                current.calcPercentage(data.totals.inc);
            })
        },
        getPercent: function(){
            var allPerc;
           allPerc= data.allitems.exp.map(function(current){
            return current.getPercentage();
            })
            return allPerc;
        },
         testing:function(){
            console.log(data);
        }
    } 
})();

var Controller=(function(UICtrl,BudgetCtrl){
   var input,DOM,newitem,budget;
   DOM=UICtrl.getDomstring();
   
    var upgradeBudget=function(){
        // 1. Calculate Budget
        BudgetCtrl.calculateBudget();
        // 2. Return The Budget
        budget=BudgetCtrl.getBudget();
        console.log(budget);
        // 3. Display at UI
        UICtrl.displayBudget(budget);
    }
    var ctrlAddItem=function(){
        // 1. Get Input 
        input=UICtrl.getInput();

        if(input.description !=='' && !isNaN(input.value) && input.value>0){
        console.log(input);
        // 2. Add item to Budgetctrl
        newitem = BudgetCtrl.additem(input.type,input.description,input.value);
        BudgetCtrl.testing();
        console.log(newitem);
        // 3. Add item to UIcontroller
        UICtrl.addlistItem(newitem,input.type);
        //4.clr field
        UICtrl.clearFieldItem();
        //5. upgrade budget
        upgradeBudget();
        updatePercentage();
        }
      
    }
    var updatePercentage=function(){
        BudgetCtrl.calculatePercentage();
        var percentage=BudgetCtrl.getPercent();
        UICtrl.displayPercentage(percentage);
    }
    var ctrlDeleteItem=function(event){
        var idItem,splidID,type,ID;
            idItem=event.target.parentNode.parentNode.parentNode.parentNode.id;
            if(idItem){
                splidID=idItem.split('-');
                type=splidID[0];
                ID=parseInt(splidID[1]);
            }
            UICtrl.deleteListItem(idItem);
            BudgetCtrl.deleteItem(type,ID);
            BudgetCtrl.testing();
            upgradeBudget();
    }     
   
   var setUpEventListener=function(){   
    document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
    document.addEventListener('keypress',function(event){
        if(event.keyCode===13||event.which===13){
            ctrlAddItem();
        }
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    })}

    return { 
        init: function(){
            UICtrl.displayMonth();
            console.log('application start');
            setUpEventListener();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percent: -1
            });
            
    }
}
     
})(UIcontroller,BudgetController);

Controller.init();