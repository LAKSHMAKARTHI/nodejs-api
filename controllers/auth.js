const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require('config');

//load model
const Auth = require("../models/auth");
const jwtkey = config.get('env.JWT_KEY');

exports.phoneVerification = (req, res, next) => {  
  Auth.find({phone: req.body.phone, is_verified: false})
  .exec()
  .then((user) => {
    if (user.length > 0){
      Auth.findOneAndUpdate({_id:user[0]._id}, {is_verified:true})
      .exec()
      .then(isupdate => {
        return res.status(200).json({
          status: "success",
          message: "verified successfully.",
        });
      })
      .catch(err => {
        res.status(500).json({
          status:"error",
          message: "Something went wrong."
        });
      })
    } else {
      res.status(500).json({
        status:"error",
        message: "Something went wrong."
      });
    }
  }).catch(err => {
    res.status(500).json({
      status:"error",
      message: "Something went wrong."
    });
  });
};

exports.login = (req, res, next) => {  
  Auth.find({phone: req.body.phone, is_verified: true})
  .exec()
  .then((user) => {
    if (user.length > 0){
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            status:"error",
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              phone: user[0].phone,
              _id: user[0]._id
            },
            jwtkey,
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            status: "success",
            message: "Authenticated successfully.",
            data: {
              name:user[0].name,
              phone:user[0].phone,
              gender:user[0].gender,
              is_verified:user[0].is_verified,
              token: token,
            }
          });
        } else {
          res.status(401).json({
            status: "error",
            message: "Auth failed"
          });
        }
      });
    } else {
      res.status(500).json({
        status:"error",
        message: "Something went wrong."
      });
    }
  }).catch(err => {
    res.status(500).json({
      status:"error",
      message: "Something went wrong."
    });
  });
};

exports.register = (req, res, next) => {
  if (req.body.password.length < 6){
    res.status(403).json({
      status:"error",
      message: "Password must be greater than six."
    });
  } else {
    Auth.find({ phone: req.body.phone })
    .exec()
    .then(auth => {
      if (auth.length > 0) {
        if (auth[0].is_verified){
          res.status(409).json({
            status:"error",
            message: "Mobile number already exists."
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              res.status(500).json({
                status:"error",
                message: "Something went wrong."
              });
            } else {
              Auth.findOneAndUpdate({_id:auth[0]._id}, {name:req.body.name}, {password:hash})
              .exec()
              .then(result => {
                res.status(200).json({
                  status: "success",
                  message: "Register successfully."
                });
              })
              .catch(err => {
                res.status(500).json({
                  status:"error",
                  message: "Something went wrong."
                });
              })                  
            }
          });
        }
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              status:"error",
              message: "Something went wrong."
            });
          } else {
            const auth = new Auth({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              phone: req.body.phone,
              password: hash,
            });
            auth.save()
            .then(result => {
              res.status(200).json({
                status: "success",
                message: "Register successfully."
              });
            })
            .catch(err => {
              res.status(500).json({
                status:"error",
                message: "Something went wrong."
              });
            });
          }
        });
      }
    });
  }
  };