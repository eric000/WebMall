var express = require('express');
var router = express.Router();
var User = require('../models/user');
require('./../util/util');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
  //res.send('respond with a resource');
  
  var param = {
    userName : req.body.userName,
    userPwd : req.body.userPwd
  }
  User.findOne(param, function(err, doc){
    if(err){
      res.json({
        status:'1',
        msg: err.message
      });
    }else{
      if(doc){
        console.log('doc',doc)
        res.cookie("userId",doc.userId,{
          path:'/',
          maxAge:1000*60*60
        });
        res.cookie("userName",doc.userName,{
          path:'/',
          maxAge:1000*60*60
        });
        //req.session.user = doc;
        res.json({
          status:'0',
          msg:'success',
          result:{
            userName:doc.userName
          }
        });
      }else{
        res.json({
          status:'1',
          msg:'账号密码错误！',
          result:''
        })
      }
    }
  })
});

//logout 
router.post('/logout',function(req, res, next){
  res.cookie("userId","",{
    path:'/',
    maxAge:-1
  })
  res.json({
    status:"0",
    msg:'logout',
    result:''
  })
});

//check login
router.get('/checkLogin',function(req, res, next){
  if(req.cookies.userId){
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName
    });
  }else{
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    });
  }
});

//cartList
router.get('/cartList',function(req, res, next){
  var userId = req.cookies.userId;
  User.findOne({userId:userId},function(err, doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        })
      }

    }
  })
});
//cartDel
router.post('/cartDel', function(req, res, next){
  var userId = req.cookies.userId,
  productId = req.body.productId;
  User.update({
    userId:userId
  },{
    $pull:{
      'cartList':{
        'productId':productId
      }
    }
  },function(err, doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        
        res.json({
          status:'0',
          msg:'del success',
          result:doc.cartList
        })
      }
    }
  });

});
///cartEdit
router.post('/cartEdit',function(req, res, next){
  var userId = req.cookies.userId,
      productId = req.body.productId,
      productNum = req.body.productNum,
      checked = req.body.checked;
    User.update({"userId":userId,"cartList.productId":productId},{
      "cartList.$.productNum":productNum,
      "cartList.$.checked":checked,
    },function(err, doc){
      if(err){
        res.json({
          status:'1',
          msg: err.message,
          result: ''
        })
      }else{
        res.json({
          status:'0',
          msg:'cartEdit success',
          result:''
        })
      }
    
    });
});
///editCheckAll
router.post('/editCheckAll',function(req, res, next){
  var userId = req.cookies.userId,
      checkAll = req.body.checkAll?'1':'0';
      User.findOne({user:userId},function(err, user){
        if(err){
          res.json({
            status:'1',
            msg: err.message,
            result: ''
          })
        }else{
          if(user){
            user.cartList.forEach((ietm)=>{
              ietm.checked = checkAll;
            });
            user.save(function(err1, doc){
              if(err1){
                res.json({
                  status:'1',
                  msg: err1.message,
                  result: ''
                })
              }else{
                res.json({
                  status:'0',
                  msg:'editCheckAll success',
                  result:''
                })
              }
            })
          }
        }
      })

});
//select address
router.get('/adressList',function(req, res, next){
  var userId = req.cookies.userId;
  User.findOne({userId:userId},function(err, doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'select address success',
        result:doc.addressList
      })
    }
  })
})
//setDefault(addressId)
router.post('/setDefault',function(req, res, next){
  var userId = req.cookies.userId,
  addressId = req.body.addressId;
  console.log('addressId',addressId)
  if(!addressId){
    res.json({
      status:'1003',
      msg:'addressId is null',
      result:''
    })
  }else{
    User.findOne({userId:userId},function(err, doc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });

      }else{
        var addressList =doc.addressList;
        addressList.forEach((item)=>{
          if(item.postCode == addressId){
            item.isDefault = true;
          }else{
            item.isDefault = false;
          }
        });
          doc.save(function(err1, doc1){
            if(err1){
              res.json({
                status:'1',
                msg:err1.message,
                result:''
              })
            }else{
              res.json({
                status:'0',
                msg:'setDefault success',
                result:''
              })
            }
          })
        
      }
    });
  }
  
});

//del address
router.post('/delAddress',function(req, res, next){
  var userId = req.cookies.userId,
  addressId = req.body.addressId;
  User.update({
    userId:userId
  },{
    $pull:{
      'addressList':{
        'postCode':addressId
      }
    }
  },function(err, doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'delAddress success',
        result:''
      });
    }
  });
});

router.post('/payMent',function(req, res, next){
  let userId = req.cookies.userId,
  addressId = req.body.addressId,
  orderTotal = req.body.orderTotal;
  User.findOne({
    userId:userId
  },function(err, doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      var address = ''
      goodsList = [];
      //获取当前用户地址信息
      doc.addressList.forEach((item)=>{
        if(addressId == item.addressId){
          address = item.addressIdl
        }
      })
      //获取用户购物车的购买商品
      doc.cartList.filter((item)=>{
        if(item.checked =='1'){
          goodsList.push(item)
        }
      });
      var platform = '622',
      r1 =Math.floor( Math.random() * 10 ),
      r2 =Math.floor( Math.random() * 10 ),
      sysDate = new Date().Format('yyyyMMddhhmmss'),
      createDate= new Date().Format('yyyy-MM-dd hh:mm:ss'),
      orderId = platform + r1 + sysDate + r2;


      var order = {
        orderId:orderId,
        orderTotal:orderTotal,
        addressInfo:address,
        goodsList:goodsList,
        orderStatus:'1',
        createDate:createDate
      };

      doc.orderList.push(order);
      doc.save(function(err1,doc1){
        if(err1){
          res.json({
            status:'1',
            msg:err1.message,
            result:''
          });
        }else{
          res.json({
            status:'0',
            msg:'',
            result:{
              orderTotal:order.orderTotal,
              orderId:order.orderId
            }
          });
        }
      })
      
    }
  })
});

router.get('/orderDetail',function(req, res, next){
  var userId = req.cookies.userId,
  orderId = req.param("orderId");
  User.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:'0',
        msg:err.message,
        result:''
      });
    }else{
      var orderList = doc.orderList;
      if(orderList.length>0){
        var orderTotal = 0;
        orderList.forEach((item)=>{
          if(item.orderId == orderId){
            orderTotal = item.orderTotal;
          }
        });
        res.json({
          status:'0',
          msg:'',
          result:{
            orderTotal:orderTotal,
            orderId:orderId
          }
        });
      }else{
        res.json({
          status:'120002',
          msg:'无订单',
          result:''
        });
      }
      
    }
  })
});
router.get('/getCartCount',function(req,res, next){
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    User.findOne({
      userId:userId
    },function(err, doc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        var cartList = doc.cartList;
        let cartCount = 0;
        cartList.map((item)=>{
          cartCount += parseInt(item.productNum);
        })
        res.json({
          status:'0',
          msg:'',
          result:cartCount
        })
      }
    })
  }
})
module.exports = router;
