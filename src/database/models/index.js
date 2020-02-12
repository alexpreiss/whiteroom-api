import Sequelize from "sequelize"
import "dotenv/config"
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: true,
  },
})
//   {
//   process.env.DATABASE_URL,
// database:  process.env.DATABASE,
//   username: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASSWORD,
//
//     dialect: "postgres",
//   }
const models = {
  User: sequelize.import("./user"),
  Post: sequelize.import("./post"),
}
Object.keys(models).forEach(key => {
  if ("associate" in models[key]) {
    models[key].associate(models)
  }
})
export { sequelize }
export default models
