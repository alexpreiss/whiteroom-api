import { Router } from "express"
import { argon2i } from "argon2-ffi"
import crypto from "crypto-promise"
import Sequelize from "sequelize"
const router = Router()

router.get("/", async (req, res) => {
  const users = await req.context.models.User.findAll()
  return res.send(users)
})

router.get("/:userId", async (req, res) => {
  const user = await req.context.models.User.findByPk(req.params.userId)
  return res.send(user)
})

router.post("/signup", async (req, res, next) => {
  if (!req.body.password || !req.body.username) {
    return res.status(400).send("Missing required fields")
  }

  try {
    //create a salt
    const salt = await crypto.randomBytes(32)

    //create a hash with given password and generated salt
    const hash = await argon2i.hash(req.body.password, salt)

    //create new user
    const user = await req.context.models.User.create({
      username: req.body.username,
      hash,
      salt,
    })
    return res.status(201).json({
      user,
    })
  } catch (error) {
    return res.status(500).json({ error })
  }
})

router.post("/signin", async (req, res) => {
  if (!req.body.password || !req.body.username) {
    return res.status(400).send("Missing required fields")
  }

  try {
    // find user based on username
    const user = await req.context.models.User.findByLogin(req.body.username)

    argon2i.hash(req.body.password, user.salt).then(hash => {
      if (hash === user.hash) {
        return res.status(200).send({ id: user.id, username: user.username })
      } else {
        return res.status(400).send({ error: "Incorrect password" })
      }
    })
  } catch (error) {
    return res.status(500).json({ error: "User not found" })
  }
})

export default router
