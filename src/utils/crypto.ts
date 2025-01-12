import * as forge from 'node-forge'

export default class CryptoHelper {
  constructor() {
    this.encryptKey = sessionStorage.getItem('pa-encryptKey') || null // 128位对称密钥
  }

  private encryptKey: string | null

  // 获取对称加密密钥
  getEncryptKey(): string {
    if (!this.encryptKey) {
      throw new Error('No encrypt key found')
    }
    return this.encryptKey
  }

  // 更新对称加密密钥
  updateEncryptKey() {
    this.encryptKey = forge.util.encode64(forge.random.getBytesSync(16))
    sessionStorage.setItem('pa-encryptKey', this.encryptKey)
  }

  // 使用RSA公钥加密AES密钥
  encryptWithPublicKey(publicKeyBase64: string) {
    const publicKey = forge.util.decode64(publicKeyBase64)
    const rsa = forge.pki.publicKeyFromPem(publicKey)
    return forge.util.encode64(
      rsa.encrypt(this.encryptKey as string, 'RSA-OAEP', {
        md: forge.md.sha256.create()
      })
    )
  }

  // 对称加密
  encryptWithSymmetricKey(data: object): {
    data: string
    iv: string
    sign: string
    type: 'AES'
  } {
    if (!this.encryptKey) {
      throw new Error('No encrypt key found')
    }
    const cipher = forge.cipher.createCipher('AES-CBC', this.encryptKey)
    const iv = forge.random.getBytesSync(16) // 生成随机IV
    cipher.start({ iv })
    cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(JSON.stringify(data))))
    cipher.finish()
    return {
      data: forge.util.encode64(cipher.output.getBytes()),
      iv: forge.util.encode64(iv),
      sign: this.hmacSign(data),
      type: 'AES'
    }
  }

  // 使用HMAC-SHA256对数据进行签名
  hmacSign(data: object): string {
    const hmac = forge.hmac.create()
    hmac.start('sha256', this.encryptKey)
    hmac.update(JSON.stringify(data)) // 或者加密后的数据
    const hmacSignature = hmac.digest().toHex()
    return hmacSignature
  }

  // 使用AES-CBC解密数据并验证签名
  decryptWithSymmetricKey(data: string, iv: string, signature: string): object {
    if (!this.encryptKey) {
      throw new Error('No encrypt key found')
    }
    const cipher = forge.cipher.createDecipher('AES-CBC', this.encryptKey)
    cipher.start({ iv: forge.util.decode64(iv) })
    cipher.update(forge.util.createBuffer(forge.util.decode64(data)))
    cipher.finish()
    const dataStr = forge.util.decodeUtf8(cipher.output.bytes())
    const decryptedData = JSON.parse(dataStr)
    const hmacSignature = this.hmacSign(decryptedData)
    if (hmacSignature !== signature) throw new Error('签名验证失败')
    return decryptedData
  }
}
