import { Router } from "express"

const router = Router()

router.get("/", async (req, res) => {
  const posts = await req.context.models.Post.findAll()
  return res.send(posts)
})

router.get("/:postId", async (req, res) => {
  const post = await req.context.models.Post.findByPk(req.params.postId)
  return res.send(post)
})

router.post("/", async (req, res) => {
  const post = await req.context.models.Post.create({
    text: req.body.text,
    title: req.body.title,
    userId: req.context.me.id,
  })
  return res.send(message)
})

router.delete("/:messageId", async (req, res) => {
  const result = await req.context.models.Post.destroy({
    where: { id: req.params.messageId },
  })
  return res.send(true)
})

export default router
