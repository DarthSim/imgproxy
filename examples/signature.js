const crypto = require('crypto')

const KEY = '943b421c9eb07c830af81030552c86009268de4e532ba2ee2eab8247c6da0881'
const SALT = '520f986b998545b4785e0defbc4f3c1203f22de2374a3d53cb7a7fe9fea309c5'
const SIGNATURE_SIZE = 32 // should correspond to IMGPROXY_SIGNATURE_SIZE on the server. Default: 32

const urlSafeBase64 = (string) => {
  return new Buffer(string).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

const hexDecode = (hex) => Buffer.from(hex, 'hex')

const sign = (salt, target, secret, size) => {
  const hmac = crypto.createHmac('sha256', hexDecode(secret))
  hmac.update(hexDecode(salt))
  hmac.update(target)
  return urlSafeBase64(hmac.digest().slice(0, size || 32))
}

const url = 'http://img.example.com/pretty/image.jpg'
const resizing_type = 'fill'
const width = 300
const height = 300
const gravity = 'no'
const enlarge = 1
const extension = 'png'
const encoded_url = urlSafeBase64(url)
const path = `/${resizing_type}/${width}/${height}/${gravity}/${enlarge}/${encoded_url}.${extension}`

const signature = sign(SALT, path, KEY, SIGNATURE_SIZE)
const result = `/${signature}${path}`
console.log(result)
