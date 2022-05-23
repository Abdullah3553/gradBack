import crypto, {createHash} from "crypto";

export class EncryptionService {

    rsaEncrypt(rowData:string){
        // accepts 190 length rowData
        // return 344 length data
        const envKey = process.env.RSA_PRIVATE_KEY.split('\\n')
        envKey.pop()
        let key = '-----BEGIN RSA PRIVATE KEY-----\n'
        envKey.forEach(obj => key+= (obj+'\n'))
        key +='-----END RSA PRIVATE KEY-----\n'
        const privateKey = crypto.createPrivateKey({
            // key: fs.readFileSync(path.resolve(__dirname, "../../../RSA_Key/private.pem")),
            key: key, // for a higher security
            format:'pem',
            type:'pkcs1'
        });
        const publicKey = crypto.createPublicKey({
            key:privateKey.export({format:'pem', type:'pkcs1'}),
            format:'pem',
            type:'pkcs1'
        })
        const encryptedData = crypto.publicEncrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            },
            // We convert the data string to a buffer using `Buffer.from`
            Buffer.from(rowData)
        )
        return encryptedData.toString('base64')
    }

    rsaDecrypt(encryptedData:string){
        const envKey = process.env.RSA_PRIVATE_KEY.split('\\n')
        envKey.pop()
        let key = '-----BEGIN RSA PRIVATE KEY-----\n'
        envKey.forEach(obj => key+= (obj+'\n'))
        key +='-----END RSA PRIVATE KEY-----\n'
        const privateKey = crypto.createPrivateKey({
            // key: fs.readFileSync(path.resolve(__dirname, "../../../RSA_Key/private.pem")),
            key: key, // for a higher security
            format:'pem',
            type:'pkcs1'
        });
        const decryptedData = crypto.privateDecrypt(
            {
                key: privateKey,
                // In order to decrypt the data, we need to specify the
                // same hashing function and padding scheme that we used to
                // encrypt the data in the previous step
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            },
            Buffer.from(encryptedData, 'base64')
        )
        return {
            decryptedData:decryptedData.toString()
        }
    }

    sha256Encrypt(rowData:string){
        return createHash('sha256').update(rowData).digest('hex');
    }
}
