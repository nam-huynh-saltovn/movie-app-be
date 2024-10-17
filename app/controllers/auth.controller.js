require("dotenv").config();
const { sequelize } = require('../config/connectDB');
const db = require("../models");
const { Op } = require("sequelize");

const User = db.User;
const Role = db.Role;

var bcrypt = require("bcryptjs");
const { generateToken } = require("../helpers/jwt.helper");
const tokenService = require("../service/token.service");
const userValidator = require("../validator/user.validator");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const accessTokenLife = parseInt(process.env.ACCESS_TOKEN_LIFE) || 24*60*60;
const refreshTokenLife = parseInt(process.env.REFRESH_TOKEN_LIFE) || 30*24*60*60;

exports.signup = async (req, res) => {
    const data = req.body;

    const isDatavalid = userValidator.validateRegisterData(data);
    const isUserNamevalid = userValidator.validUsername(data.user_name);
    const isPasswordvalid = userValidator.validatePassword(data.password);

    if(isDatavalid){
        return res.status(400).send({ message: isDatavalid });
    }
    if(isUserNamevalid){
        return res.status(400).send({ message: isUserNamevalid });
    }
    if(isPasswordvalid){
        return res.status(400).send({ message: isPasswordvalid });
    }

    const transaction = await sequelize.transaction();
    try {
        // Save User to Database
        const user =  await User.create({
            name: req.body.name,
            user_name: req.body.user_name,
            status: req.body.status||true,
            password: bcrypt.hashSync(req.body.password, 8)
        }, {transaction});

        if (req.body.roles){
            // assign roles to users
            const roles = await Role.findAll({ 
                where: { role_name: { [Op.or]: req.body.roles }}
            }, { transaction });
            await user.setRoles(roles, { transaction });
        }else{
            // assign default role
            await user.setRoles([2], { transaction });
        }

        await transaction.commit();
        res.status(201).json({ message: "Đăng ký người dùng thành công", user});
    } catch (error) {
        await transaction.rollback();
        //error
        res.status(500).json({ message: "Đăng ký người dùng không thành công. Có lỗi xảy ra." });
    }
};

exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({ where: { user_name: req.body.user_name } });
        if (!user) {
            return res.status(404).send({ message: "Người dùng không tồn tại." });
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ message: "Mật khẩu không đúng!" });
        }

        const transaction = await sequelize.transaction();
        
        const currentDate = new Date();
        const accessToken = generateToken(user, accessTokenSecret, accessTokenLife);
        const refreshToken = generateToken(user, refreshTokenSecret, refreshTokenLife);

        const expirationAccessTokenDate = new Date(currentDate.getTime() + accessTokenLife * 1000);
        const expirationRefreshTokenDate = new Date(currentDate.getTime() + refreshTokenLife * 1000);

        try {
            await tokenService.createToken({
                access_token: accessToken,
                refresh_token: refreshToken,
                expired: false,
                invoked: false,
                acc_token_date: expirationAccessTokenDate,
                ref_token_date: expirationRefreshTokenDate,
                user_id: user.user_id,
                status: true
            }, transaction);

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ message: "Lỗi khi lưu token." });
        }

        const roles = await user.getRoles();
        const authorities = roles.map(role => "ROLE_" + role.role_name.toUpperCase());

        return res.status(200).json({
            user_id: user.user_id,
            user_name: user.user_name,
            roles: authorities,
            accessToken,
            expiresDate: expirationAccessTokenDate,
            refreshToken,
            message: "Đăng nhập thành công."
        });

    } catch (err) {
        console.log("🚀 ~ exports.signin= ~ err:", err)
        return res.status(500).send({ message: "Không thể đăng nhập" });
    }
};

exports.signout = async (req, res) => {
    let token = req.headers["x-access-token"];
  
    if (!token) {
      return res.status(400).send({ message: "Không có token nào được cung cấp!" });
    }
  
    try {
      // Find token in database
      const tokenRecord = await db.Token.findOne({ where: { access_token: token } });
  
      if (!tokenRecord) {
        return res.status(404).send({ message: "Token không tồn tại!" });
      }
  
      // Update token status to 'invoked'
      tokenRecord.invoked = true;
      await tokenRecord.save();
  
      res.status(200).send({ message: "Đăng xuất thành công!" });
    } catch (err) {
      console.error("Lỗi khi đăng xuất:", err);
      res.status(500).send({ message: "Có lỗi xảy ra khi đăng xuất." });
    }
  };