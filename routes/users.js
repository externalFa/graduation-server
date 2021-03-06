var express = require("express");
var router = express.Router();
let user = require("../models/user");
let jwt = require("jsonwebtoken");

let jwtTokenSecret = "grajwt";

function errRes(err) {
  return {
    status: "2",
    data: "",
    msg: err.message
  };
}
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/login", (req, res, next) => {
  let userID = req.body.userID;
  let userPwd = req.body.userPwd;
  console.log(req.body)
  console.log(userID,userPwd)
  if (userID == null || userID == "" || userPwd == null || userPwd == "") {
    res.json({
      status: "2",
      data: "",
      msg: "用户名或密码错误"
    });
    return
  }
  user.findOne({
    userID,
    userPwd
  }, (err, doc) => {
    if (err) {
      res.json(errRes(err));
      return
    } else if (doc){
      let token = jwt.sign({
        userID,
        userPwd
      }, jwtTokenSecret, {
        expiresIn: 259200
      });
      res.json({
        status: "1",
        msg: "suc",
        data: token
      });
    } else {
      res.json({
        status:'2',
        msg:'用户名或密码错误',
        data:''
      })
    }
  });
});

router.get("/logout", (req, res, next) => {});

router.post('/authorization', (req, res, next) => {
  let userID = req.body.userID
  let userPwd = req.body.userPwd
  let token = jwt.sign({
    userID,
    userPwd
  }, jwtTokenSecret, {
    expiresIn: 259200
  });
  res.json({
    status: "1",
    msg: "suc",
    data: token
  });
})

router.get("/userInfo", (req, res, next) => {
  let token = req.headers.authorization
  jwt.verify(token, jwtTokenSecret, (err, decode) => {
    if (err) {
      res.json({
        status: "2",
        msg: "faile",
        data: ""
      });
      return
    } else {
      user.findOne({
        userID: decode.userID
      }, (err, doc) => {
        if (err) {
          res.json({
            status: "2",
            data: "",
            msg: err.message
          });
          return
        } else {
          const userInfo = {};
          userInfo.userID = doc.userID;
          userInfo.userName = doc.userName;
          userInfo.type = doc.type;
          userInfo.portrait=doc.portrait;
          res.json({
            status: "1",
            msg: "suc",
            data: userInfo
          });
        }
      });
    }
  });
});

router.get("/autoLogin", (req, res, next) => {
  let token = req.headers.authorization
  jwt.verify(token, jwtTokenSecret, (err, decode) => {
    if (err) {
      res.json({
        status: "2",
        msg: "faile",
        data: ""
      });
      return
    } else {
      user.findOne({
        userID: decode.userID
      }, (err, doc) => {
        if (err) {
          res.json({
            status: "2",
            data: "",
            msg: err.message
          });
        } else {
          const userInfo = {};
          userInfo.userID = doc.userID;
          userInfo.userName = doc.userName;
          userInfo.type = doc.type;
          userInfo.portrait=doc.portrait;
          res.json({
            status: "1",
            msg: "suc",
            data: userInfo
          });
        }
      });
    }
  });
});

router.get("/PaperList", (req, res, next) => {
  let userID=req.query.userID
  user.findOne({userID},(err,doc)=>{
    if (err) {
      res.json({
        status:'2',
        msg:err.message,
        data:''
      })
      return
    } else {
      res.json({
        status:'1',
        msg:'suc',
        data:doc.testList
      })
    }
  })
});




module.exports = router;