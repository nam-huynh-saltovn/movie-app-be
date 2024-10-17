const db = require("../models");
const ROLES = db.ROLES;

const checkDuplicateUsername = async(req, res, next) => {
  // Username
  await db.User.findOne({ where: { user_name: req.body.user_name }})
  .then(user => {
    if (user) {
      res.status(400).send({
        message: "Tên đăng nhập đã được sử dụng!"
      });
      return;
    }
    next();
  });
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Role không tồn tại = " + req.body.roles[i]
        });
        return;
      }
    }
  }
  
  next();
};

const verifySignUp = {
    checkDuplicateUsername: checkDuplicateUsername,
    checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;