import { S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'

const S3_REGION = process.env.S3_REGION as string
const S3_BUCKET = process.env.S3_BUCKET_NAME as string
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID as string
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY as string

// Use explicit credentials only if both are provided; otherwise fall back to
// default credential provider chain (EC2 role/IMDS, ECS, env, etc.)
export const s3 = new S3Client({
  region: S3_REGION,
  ...(S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY
    ? { credentials: { accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY } }
    : {}),
})

export async function createAvatarPresignedPost(key: string, contentType: string) {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const presigned = await createPresignedPost(s3, {
    Bucket: S3_BUCKET,
    Key: key,
    Conditions: [
      ['content-length-range', 0, maxSize],
      ['starts-with', '$Content-Type', contentType.split('/')[0] + '/'],
    ],
    Fields: {
      'Content-Type': contentType,
    },
    Expires: 60, // seconds
  })

  const publicBase = process.env.NEXT_PUBLIC_S3_PUBLIC_BASE_URL || `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com`
  const publicUrl = `${publicBase}/${key}`

  return { ...presigned, key, publicUrl }
}


