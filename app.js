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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/client', clientRouter);
app.use('/serviceProvider', serviceProvider);

app.get("/", (req, res) => res.send("home page...."))
  .listen(PORT, () => console.log(`Server is up and running on ${PORT} ...`));




// let arr = [
//   {
//     id: 10, qty: 5, total: 10,
//     modifiers: [{ mid: "16", mqty: 55, mtotal: 150 }, { mid: "1", mqty: 45, mtotal: 19 }],
//   },
//   {
//     id: 3, qty: 5, total: 10,
//     modifiers: [{ mid: "5", mqty: 4, mtotal: 120 }],
//   },
//   {
//     id: 1, qty: 5, total: 10,
//     modifiers: [{ mid: "1", mqty: 8, mtotal: 150 }],
//   },
//   {
//     id: 3, qty: 54, total: 10,
//     modifiers: [{ mid: "5", mqty: 55, mtotal: 150 }],
//   },
//   {
//     id: 1, qty: 9, total: 10,
//     modifiers: [{ mid: "1", mqty: 5, mtotal: 189 }],
//   },
// ];

// let finalArray = [], countArray = []
// for (const iteration of arr) {
//   let obj = {
//     id: iteration['id'],
//     qty: iteration['qty'],
//     total: iteration['total'],
//     Modifiers: iteration.modifiers
//   }
//   for (var check1 of iteration.modifiers) {

   
//   }
//   for (const iteration1 of arr) {
//     for (var check2 of iteration1.modifiers) {
//     }
//     if (iteration.id == iteration1.id && arr.indexOf(iteration) != arr.indexOf(iteration1)&&check1.mid==check2.mid) {
//       var mcheck =iteration.id;
//       obj['id'] = iteration['id']
//       obj['qty'] = obj['qty'] + iteration1['qty']
//       obj['total'] = obj['total'] + iteration1['total']


//       let Mod = []
//       for (const val of iteration.modifiers) {
//         var MObj = {
//           mid: val.mid,
//           mqty: val.mqty,
//           mtotal: val.mtotal
//         }
//         for (const val1 of iteration1.modifiers) {
//           if (val.mid == val1.mid) {
//             val.mid = val1.mid,
//               val.mqty = val1.mqty + val.mqty,
//               val.mtotal = val1.mtotal + val.mtotal

//             Mod.push(val)
//           }
//           else {
//             //iteration.modifiers.push(val1)
//             Mod.push(val1)
//             Mod.push(val)
//           }
//         }
//       }
//       obj.Modifiers = Mod
//     }
//   }
//   // console.log("Iteration---------->>>",iteration.modifiers)

//   if (!countArray.includes(iteration.id)) {
//       // console.log("Object-------->>>>>>>>",obj)
//     finalArray.push(obj)
//   }
//   // if(mcheck){
//   countArray.push(iteration.id)
//   // }


// }
// //    console.log("Final Result ------------------->>>>>>>>>>>>",finalArray)
// for (let key of finalArray) {
//   // console.log("Final Result ------------------->>>>>>>>>>>>", key)
// }
