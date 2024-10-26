"use strict";
const { Model } = require("sequelize");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static isPasswordRegexValid(value) {
      // validate password format
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*-_.,]*$/;
      return regex.test(value);
    }

    static generateToken({ id, email, access_role }) {
      return jwt.sign({ id, email, access_role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "30d",
      });
    }

    static async authUser(value) {}
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { args: true, msg: "Nama tidak boleh kosong!" },
          notEmpty: { args: true, msg: "Nama tidak boleh kosong!" },
          len: {
            args: [4, 255],
            msg: "Jumlah karakter nama antara 4 sampai 255 karakter.",
          },
          is: {
            args: /^[a-zA-Z.\s]*$/,
            msg: "Nama hanya boleh berisi huruf!",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { args: true, msg: "Email sudah digunakan." },
        validate: {
          notNull: { args: true, msg: "Email tidak boleh kosong!" },
          notEmpty: { args: true, msg: "Email tidak boleh kosong!" },
          isEmail: { args: true, msg: "Format email tidak sesuai!" },
          len: {
            args: [4, 255],
            msg: "Jumlah karakter email antara 4 sampai 255 karakter.",
          },
        },
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { args: true, msg: "Nomor telepon sudah digunakan." },
        validate: {
          notNull: { args: true, msg: "Nomor telepon tidak boleh kosong!" },
          notEmpty: { args: true, msg: "Nomor telepon tidak boleh kosong!" },
          len: {
            args: [10, 15],
            msg: "Nomor telepon harus antara 10 sampai 15 karakter.",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { args: true, msg: "Password tidak boleh kosong!" },
          notEmpty: { args: true, msg: "Password tidak boleh kosong!" },
          len: {
            args: [8, 255],
            msg: "Password harus terdiri dari 8 sampai 255 karakter!",
          },
          is: {
            args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*-_.,]*$/,
            msg: "Password harus mengandung kombinasi huruf besar, huruf kecil dan angka!",
          },
        },
      },
      profile_picture: { type: DataTypes.STRING, allowNull: true },
      access_role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "USER",
        validate: {
          notNull: { args: true, msg: "Hak akses tidak boleh kosong!" },
          notEmpty: { args: true, msg: "Hak akses tidak boleh kosong!" },
          isIn: {
            args: ["USER", "ADMIN", "ROOT"],
            msg: "Hak akses yang dipilih tidak valid",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "users",
    }
  );
  return User;
};
