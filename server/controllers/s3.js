const { S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
const aws = require("aws-sdk");

module.exports = {
  sign: async (req, res) => {
    aws.config = {
      region: "us-west-2",
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    };

    const { fileName, fileType } = req.query;

    const s3 = new aws.S3();
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: "public-read"
    };

    s3.getSignedUrl("putObject", s3Params, (err, data) => {
      if (err) {
        console.log(err);
        return res.end();
      }
      return res.send({
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3-us-west-2.amazonaws.com/${fileName}`
      });
    });
  }
};
