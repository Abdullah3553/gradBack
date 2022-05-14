export interface BaseMethod {
    compare( hashedStoredSignature, sentSignature, authenticator?, username?:string, filePath?): Object
}
