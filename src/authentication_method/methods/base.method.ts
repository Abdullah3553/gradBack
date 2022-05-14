export interface BaseMethod {
    compare(username: string, hashedStoredSignature, sentSignature): boolean
}
