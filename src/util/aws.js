import AWS from "aws-sdk"
import "dotenv/config"
import multer from "multer"

export const fileParser = multer().any()

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
})

export const uploadParams = (file, user) => ({
  Bucket: "alexpreiss.com",
  Key: user.username + Date.now() + file.originalname,
  Body: file.buffer,
  ACL: "public-read",
})
