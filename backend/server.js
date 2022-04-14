let Datastore = require('nedb');
const koa = require('koa');
const koaRouter = require('@koa/router');
const cors = require('@koa/cors');
const ethers = require('ethers');
const PaymentProcessor = require('../frontend/src/contracts/PaymentProcessor.json'); 

let app = new koa();
let router = new koaRouter();

const Payment = new Datastore({ filename: './backend/payment.db', autoload: true  });


// var scott = {
//     name: 'Scott',
//     twitter: '@ScottWRobinson'
// };
// 
// Payment.insert(scott, function(err, doc) {
//     console.log('Inserted', doc.name, 'with ID', doc._id);
// });
// 
// Payment.findOne({ twitter: '@ScottWRobinson' }, function(err, doc) {
//     console.log('Found user:', doc.name);
// });

router.get("/api/paymentId/:itemId", async ctx=>{
    let paymentId = null;
    await Payment.insert({
        id:paymentId,
        itemId: ctx.params.itemId,
        paid: false
    },function(err, doc) {
        console.log('Inserted with ID', doc._id);
        paymentId = doc._id
    })
    ctx.body = {paymentId};
});

router.get("/api/item/:itemId", async ctx=>{
    Payment.findOne({id:ctx.params.itemId},function(err, doc) {
        if (doc && doc.paid){
            ctx.body = {
                url:doc._id
            }
        } else {
            ctx.body = {
                url:""
            }
        }
    })
});

app.use(cors).use(router.routes).use(router.allowedMethods());
app.listen(4000,()=>{
    console.log("server started");
})

const EventLitener = ()=>{
    const provider = new ethers.providers.JsonRpcProvider('http://localhost:9545');
    const networkId = '5777';
    const paymentProcessor = new ethers.Contract(
        PaymentProcessor.networks[networkId].address,
        PaymentProcessor.abi,
        provider
    );
    paymentProcessor.on('payementDone', async (payer, amount, paymentId, date)=>{
        console.log(payer+"="+amount+"="+paymentId+"="+date);
        await Payment.findOne({id: paymentId}, function(err, doc){
            if(doc){
                doc.paid = true
            }
            Payment.insert({
                id:doc_id,
                itemId: doc.itemId,
                paid: true
            },function(err, doc) {
                console.log('Inserted with ID', doc._id);
                paymentId = doc._id
            })
        });

    });
}

