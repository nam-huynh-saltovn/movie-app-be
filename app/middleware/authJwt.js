require("dotenv").config();
const jwt = require("jsonwebtoken");
const db = require("../models");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "Không có token nào được cung cấp!"
    });
  }
  
  try {
    const decoded = jwt.verify(token, accessTokenSecret);
    req.userId = decoded.id;

    // Check the token in see if the DB has been called or expired
    const tokenRecord = await db.Token.findOne({ where: { access_token: token } });

    if (!tokenRecord) {
      return res.status(401).send({ message: "Token không hợp lệ!" });
    }

    if (tokenRecord.expired || tokenRecord.invoked) {
      return res.status(401).send({ message: "Token đã hết hạn hoặc bị vô hiệu hóa!" });
    }

    next();
  } catch (err) {
    console.log("err:", err);
    return res.status(401).send({ message: "Không được phép truy cập!" });
  }
};

const isAdmin = async(req, res, next) => {
    await db.User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].role_name === "admin") {
            next();
            return;
            }
        }

        res.status(403).send({
            message: "Yêu cầu vai trò quản trị!"
        });
        return;
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin
};
module.exports = authJwt;