const user = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      unique: {
        args: "true",
        msg: "username is already in use",
      },
    },
    hash: DataTypes.STRING,
    salt: DataTypes.BLOB,
    profilePicture: DataTypes.STRING,
  })

  User.associate = models => {
    User.hasMany(models.Post, { onDelete: "CASCADE" })
  }

  User.findByLogin = async login => {
    const user = await User.findOne({
      where: { username: login },
    }).then(user => {
      if (user) return user
    })
    return user
  }

  return User
}
export default user
