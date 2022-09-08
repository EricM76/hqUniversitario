
require('dotenv').config();

const bucketName=process.env.AWS_BUCKET_NAME;
const bucketRegion=process.env.AWS_BUCKET_REGION;
const publicKey=process.env.AWS_PUBLIC_KEY;
const secretKey=process.env.AWS_SECRET_KEY;

module.exports = {
    bucketName,
    bucketRegion,
    publicKey,
    secretKey
}