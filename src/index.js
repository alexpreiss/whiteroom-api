import express from "express"
import cors from "cors"

import models, { sequelize } from "./database/models"
import routes from "./routes"
import "dotenv/config"

const app = express()
const port = process.env.port

const eraseDatabaseOnSync = true

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
})

app.use(cors())
app.use(express.json())

// req context
app.use(async (req, res, next) => {
  req.context = {
    models,
    me: await models.User.findByLogin("alexpreiss"),
  }
  next()
})

// routing
app.use("/session", routes.session)
app.use("/user", routes.user)
app.use("/post", routes.post)
