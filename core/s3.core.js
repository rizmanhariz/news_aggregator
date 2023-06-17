const fs = require("fs");
const { S3Client, ListBucketsCommand, ListObjectsV2Command, PutObjectCommand } = require("@aws-sdk/client-s3");
const client = new S3Client({ region: process.env.AWS_REGION });

// get buckes
async function testS3() {
  const data = await client.send(new ListBucketsCommand({}));
  console.log(data);
}

async function getObj() {
  const data = await client.send(new ListObjectsV2Command({
    Bucket: process.env.AWS_BUCKET_NAME,
    encodingType: "url"
  }));
  console.log(data);
}

async function uploadObj(key, fileStream) {
  const upload = await client.send(new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: fileStream,
  }));
  return upload;
}

async function uploadObjFromLocal(key, localPath) {
  const upload = await client.send(new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: fs.createReadStream(localPath),
  }));
  return upload;
}

module.exports = {
  testS3,
  getObj,
  uploadObj,
  uploadObjFromLocal,
};
