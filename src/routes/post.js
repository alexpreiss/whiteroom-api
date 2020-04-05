import { Router } from "express"

import jwt from "../auth/jwt"
import { s3, fileParser, uploadParams } from "../util/aws"

const router = Router()

router.get("/", async (req, res) => {
  const posts = await req.context.models.Post.findAll({
    order: [["createdAt", "DESC"]],
  })
  if (!posts) {
    return res.status(404).send("Unable to fetch posts")
  } else {
    return res.status(200).send(posts)
  }
})

router.get("/fromUser/:userId", async (req, res) => {
  const posts = await req.context.models.Post.findAll({
    where: { userId: req.params.userId },
    order: [["createdAt", "DESC"]],
  })
  return res.send(posts)
})

router.get("/fromCategory/:category", async (req, res) => {
  const posts = await req.context.models.Post.findAll({
    where: { category: req.params.category },
    order: [["createdAt", "DESC"]],
  })
  return res.send(posts)
})

router.get("/:postId", async (req, res) => {
  const post = await req.context.models.Post.findByPk(req.params.postId)
  return res.send(post)
})

router.post("/create", fileParser, async (req, res) => {
  const token = req.body.token
  if (!token) {
    return res.status(401).send("JWT Required")
  }
  const payload = jwt.verify(token)
  if (!payload) return res.status(400).send("Invalid JWT")

  const user = await req.context.models.User.findByPk(payload.id)

  let postData = {
    content: req.body.content,
    title: req.body.title,
    userId: payload.id,
    author: user.username,
    category: req.body.category,
  }

  if (req.body.category === "art") {
    const file = req.files[0]

    // Uploading files to the bucket
    s3.upload(uploadParams(file, user), async function(err, data) {
      if (err) {
        throw err
      }

      postData.image = data.Location
      const post = await req.context.models.Post.create(postData)

      return res.send(post)
    })
  } else if (req.body.category === "music") {
    const file = req.files[0]

    // Uploading files to the bucket
    s3.upload(uploadParams(file, user), async function(err, data) {
      if (err) {
        throw err
      }
      postData.audio = data.Location
      const post = await req.context.models.Post.create(postData)

      return res.send(post)
    })
  } else {
    const post = await req.context.models.Post.create(postData)

    return res.send(post)
  }
})

router.post("/delete/:postId", async (req, res) => {
  const token = req.body.token

  if (!token) {
    return res.status(401).send("JWT Required")
  }

  const payload = jwt.verify(token)

  if (!payload) return res.status(400).send("Invalid JWT")

  const post = await req.context.models.Post.findByPk(req.params.postId)

  if (payload.id !== post.userId) {
    return res.status(400).send("User does not own post")
  } else {
    const result = await req.context.models.Post.destroy({
      where: { id: req.params.postId },
    })
    return res.send(true)
  }
})

export default router
