require("dotenv").config()

module.exports = {
  development: {
    url:
      "postgres://zswedyeqhelshk:1bc5cc10c960ccd1332fb9f88d62c8ca26206924c73218042046ca03422f2964@ec2-52-23-14-156.compute-1.amazonaws.com:5432/d6755ua88nvmus",
    dialect: "postgres",
  },
  test: {
    url:
      "postgres://zswedyeqhelshk:1bc5cc10c960ccd1332fb9f88d62c8ca26206924c73218042046ca03422f2964@ec2-52-23-14-156.compute-1.amazonaws.com:5432/d6755ua88nvmus",
    dialect: "postgres",
  },
  production: {
    url:
      "postgres://zswedyeqhelshk:1bc5cc10c960ccd1332fb9f88d62c8ca26206924c73218042046ca03422f2964@ec2-52-23-14-156.compute-1.amazonaws.com:5432/d6755ua88nvmus",
    dialect: "postgres",
  },
}
