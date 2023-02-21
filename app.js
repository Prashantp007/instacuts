const express = require('express');
const app = express();
const bodyParser = require('body-parser')
require('dotenv').config();
require('./models/index')
const PORT = process.env.PORT;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const clientRouter = require('./routers/clientRouter');
const serviceProvider = require('./routers/serviceProviderRouter');
const orderRouter = require('./routers/orderRouter');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/client', clientRouter);
app.use('/serviceProvider', serviceProvider);
app.use('/order', orderRouter);

app.get("/", (req, res) => res.send("home page...."))
    .listen(PORT, () => console.log(`Server is up and running on ${PORT} ...`));






let newArr = [
    {
        "section_id": 43,
        "item_id": 159,
        "rough": false,
        "order_items_addon": [],
        "special_notes": "",
        "ar_special_notes": "some random notes",
        "amount": 2,
        "quantity": 1
    },
    {
        "section_id": 43,
        "item_id": 159,
        "rough": false,
        "order_items_addon": [],
        "ar_special_notes": "some random notes",
        "amount": 4,
        "quantity": 1
    },
    {
        "section_id": 19,
        "item_id": 167,
        "order_items_addon": [
            {
                "option_group_id": 51,
                "option_item_id": 106,
                "price": 0,
                "quantity": 1
            },
            {
                "option_group_id": 51,
                "option_item_id": 107,
                "price": 0,
                "quantity": 1
            },
            {
                "option_group_id": 51,
                "option_item_id": 110,
                "price": 0,
                "quantity": 1
            }
        ],
        "ar_special_notes": "some random notes",
        "amount": 70,
        "quantity": 1
    },
    {
        "section_id": 19,
        "item_id": 167,
        "order_items_addon": [
            {
                "option_group_id": 51,
                "option_item_id": 106,
                "price": 0,
                "quantity": 1
            },
            {
                "option_group_id": 51,
                "option_item_id": 107,
                "price": 0,
                "quantity": 1
            },
            {
                "option_group_id": 51,
                "option_item_id": 110,
                "price": 0,
                "quantity": 1
            }

        ],
        "ar_special_notes": "some random notes",
        "amount": 70,
        "quantity": 1
    },
    {
        "section_id": 19,
        "item_id": 167,
        "order_items_addon": [
            {
                "option_group_id": 51,
                "option_item_id": 106,
                "price": 0,
                "quantity": 1
            },
            {
                "option_group_id": 51,
                "option_item_id": 107,
                "price": 0,
                "quantity": 1
            },
            {
                "option_group_id": 51,
                "option_item_id": 110,
                "price": 0,
                "quantity": 1
            }

        ],
        "ar_special_notes": "some random notes",
        "amount": 70,
        "quantity": 1
    },
    {
        "section_id": 19,
        "item_id": 167,
        "order_items_addon": [
            {
                "option_group_id": 51,
                "option_item_id": 106,
                "price": 0,
                "quantity": 1
            },
            {
                "option_group_id": 51,
                "option_item_id": 107,
                "price": 0,
                "quantity": 1
            }
        ],
        "ar_special_notes": "some random notes",
        "amount": 70,
        "quantity": 1
    },
    {
        "section_id": 19,
        "item_id": 169,
        "order_items_addon": [
            {
                "option_group_id": 51,
                "option_item_id": 106,
                "price": 0,
                "quantity": 1
            },
            {
                "option_group_id": 51,
                "option_item_id": 107,
                "price": 0,
                "quantity": 1
            }
        ],
        "ar_special_notes": "some random notes",
        "amount": 70,
        "quantity": 1
    },
    {
        "section_id": 19,
        "item_id": 167,
        "order_items_addon": [
            {
                "option_group_id": 51,
                "option_item_id": 106,
                "price": 0,
                "quantity": 1
            },
            {
                "option_group_id": 51,
                "option_item_id": 107,
                "price": 0,
                "quantity": 1
            }
        ],
        "ar_special_notes": "some random notes",
        "amount": 70,
        "quantity": 1
    },
]

let finalArray = [],countArray = []
for (const iteration of newArr) {
  let flag = 0,flag1 = 0,finalCheck =0,itemCheck = 0
  for (const iteration1 of newArr) {
      if (iteration.item_id == iteration1.item_id && newArr.indexOf(iteration) != newArr.indexOf(iteration1)) {
        if(iteration.order_items_addon.length == iteration1.order_items_addon.length) {
          itemCheck++
          iteration['item_id'] = iteration['item_id']
          iteration['quantity'] = iteration['quantity'] + iteration1['quantity']
          iteration['amount'] = iteration['amount'] + iteration1['amount']
          iteration['section_id'] = iteration1['section_id']
            if(iteration.order_items_addon.length> 0 && iteration1.order_items_addon.length>0) {
              for(const check of iteration.order_items_addon) {
                for(const check1 of iteration1.order_items_addon) {
                  if(check.option_item_id == check1.option_item_id) {
                    flag1++
                  }
                }
              }
            } 
            if(flag1 == iteration.order_items_addon.length && flag1 == iteration1.order_items_addon.length){
              flag++
              for(let iteration2 of iteration.order_items_addon) {
                for(let iteration3 of iteration1.order_items_addon) {
                  if(iteration2.option_item_id == iteration3.option_item_id) {
                    iteration2.price +=  iteration2.price + iteration3.price
                    iteration2.quantity +=  iteration2.quantity + iteration3.quantity 
                  }
                }
              }
            }  
        }
        else {
          if(countArray.includes(iteration.item_id)) {
            finalCheck++
          }
        }
       }
  }
//console.log("-------------->>>",iteration,"------------>>>>")
    if(flag>0  && !countArray.includes(iteration.item_id)) {
      finalArray.push(iteration)
    }
    else {
      // for(const value2 of finalArray) {
      //   if(value2.item_id == iteration.item_id && iteration.quantity == value2.quantity ) {

      //   }
      // }
      
      if(finalCheck>0 && itemCheck == 0){
        finalArray.push(iteration)
      }
      if(!countArray.includes(iteration.item_id)) {
        finalArray.push(iteration)
      }
    }
  countArray.push(iteration.item_id)
}

for(const f4 of finalArray) {
//   console.log("Final ARray ------------->>>>>>>>>>>",f4)
}






// function reverseString(str) {
//   return str.split("").reverse().join("");
// }
// console.log(reverseString("prashant"))

// let str='prashant',newString="";
// for (var i = str.length - 1; i >= 0; i--) { 
//   newString += str[i]; // or newString = newString + str[i];
// }
// console.log(newString)

// function reverseString(str) {
//   if (str === "")
//     return "";
//   else
//     return reverseString(str.substr(1)) + str.charAt(0);
// }
// console.log(reverseString("hello"));


// function aa(a,b){
//   // let a =8888
//  let sum =a+b
//   return sum
// }
// function aa(a,b,c){
//   // let a =8888
//  let sum =a+b+c
//   return sum
// }
// console.log(aa(15,16))
// console.log(aa(1,4,6))


