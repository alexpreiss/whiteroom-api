import { Router } from "express"
import { argon2i } from "argon2-ffi"
import crypto from "crypto-promise"
import { fileParser, s3, uploadParams } from "../util/aws"

import jwt from "../auth/jwt"

const router = Router()

router.get("/", async (req, res) => {
  const users = await req.context.models.User.findAll()
  return res.send(users)
})

router.get("/fromUsername/:username", async (req, res) => {
  const user = await req.context.models.User.findOne({
    where: { username: req.params.username },
  })
  return res.send({
    username: user.username,
    id: user.id,
    profilePicture: user.profilePicture,
  })
})

router.get("/fromId/:id", async (req, res) => {
  const user = await req.context.models.User.findByPk(req.params.id)
  return res.send({ username: user.username, id: user.id })
})

router.post("/fromToken", async (req, res) => {
  const token = req.body.token

  if (!token) {
    return res.status(401).send("JWT Required")
  }

  const payload = jwt.verify(token)

  if (!payload) return res.status(400).send("Invalid JWT")

  const user = await req.context.models.User.findByPk(payload.id)

  if (!user) {
    return res.status(404).send("user not found")
  } else {
    return res.status(200).send({ username: user.username, id: user.id })
  }
})

router.post("/signup", fileParser, async (req, res, next) => {
  if (!req.body.password || !req.body.username) {
    return res.status(400).send("Missing required fields")
  }

  try {
    //create a salt
    const salt = await crypto.randomBytes(32)

    //create a hash with given password and generated salt
    const hash = await argon2i.hash(req.body.password, salt)

    let postData = {
      username: req.body.username,
      hash,
      salt,
    }

    if (req.files[0]) {
      const file = req.files[0]

      // Uploading files to the bucket
      s3.upload(
        uploadParams(file, { username: req.body.username }),
        async function(err, data) {
          if (err) {
            throw err
          }
          postData.profilePicture = data.Location
          const user = await req.context.models.User.create(postData)
          return res.status(201).json({
            user,
          })
        }
      )
    } else {
      console.log("didnt upload prof pic")
      return res.status(201).json({
        user,
      })
    }

    //create new user
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

    const token = jwt.sign({ id: user.id, username: user.username })

    argon2i.hash(req.body.password, user.salt).then(hash => {
      if (hash === user.hash) {
        return res.status(200).json({ token, user })
      } else {
        return res.status(400).send({ error: "Incorrect password" })
      }
    })
  } catch (error) {
    return res.status(500).json({ error: "User not found" })
  }
})

export default router
