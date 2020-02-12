const post = (sequelize, DataTypes) => {
  const Post = sequelize.define("post", {
    text: DataTypes.STRING,
    title: DataTypes.STRING,
  })

  Post.associate = models => {
    Post.belongsTo(models.User)
  }

  return Post
}

export default post
