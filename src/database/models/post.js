const post = (sequelize, DataTypes) => {
  const Post = sequelize.define("post", {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    author: DataTypes.STRING,
    category: DataTypes.STRING,
    image: DataTypes.STRING,
    audio: DataTypes.STRING,
  })

  Post.associate = models => {
    Post.belongsTo(models.User)
  }

  Post.findByUserId = async id => {
    const post = await Post.findAll({
      where: { userId: id },
    }).then(post => {
      if (post) return post
    })
    return post
  }

  return Post
}

export default post
