import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {LoginDto} from "./dto/Login.dto";
import {RegisterDto} from "./dto/register.dto";
import {CreateAuthenticatorDto} from "../authenticator/dto/create-authenticator.dto";
import {TokenService} from "../token/token.service";
import {AuthenticatorService} from "../authenticator/authenticator.service";
import {AuthenticationMethodSelectorService} from "../authentication_method/authentication-method-selector.service";
import {UserService} from "./user.service";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class GuestService{
    constructor(private readonly prisma : PrismaService,
                private readonly tokenService: TokenService,
                private readonly authenticatorService: AuthenticatorService,
                private readonly authenticationMethodSelector: AuthenticationMethodSelectorService,
                private readonly userService:UserService
    ) {}

    async login(userData:LoginDto){
        const userChecker = await this.userService.findOneByUsername(userData.username)
        //return userChecker // for API testing ...
        userChecker.Authenticator.sort((obj1, obj2)=>{
            return obj1.priority - obj2.priority  // sort by priority
        })
        userData.authenticators.sort((obj1, obj2)=>{
            return obj1.priority - obj2.priority  // sort by priority
        })

        let isUserValid = 0;// 1 -> valid user , 0 -> invalid user
        for(let i=0, arr=userData.authenticators;i<arr.length;i++){
            // For each method we should execute that method module to validate signatures data
            //1)Sequence checking
            if(arr[i].authentication_methodId === userChecker.Authenticator[i].authentication_methodId){
                // the [i] method is in the right sequence
                // so we must check the signature data
                const isAuthenticated = this.authenticationMethodSelector.methodSelector(
                    userChecker.Authenticator[i],
                    userChecker.username,
                    userChecker.Authenticator[i].signature,
                    userData.authenticators[i].signature
                )
                if(!isAuthenticated){
                    // the authenticator sent by the user doesn't match the stored data
                    isUserValid = 0;
                    throw new BadRequestException({message:"Wrong credentials"})
                }
                // line after this comment means that the user authenticators are valid
                isUserValid = 1;
            }else{
                throw new BadRequestException({message:"Wrong Sequence"})
            }
        }
        if(isUserValid === 1){
            // we should generate tokens for the user and return them
            const refreshToken = await this.tokenService.createRefreshToken(userChecker.id)
            const accessToken = this.tokenService.generateAccessToken(userChecker.id)
            return {
                refreshToken:refreshToken.hashedToken,
                accessToken
            }
        }
    }

    async registerNewUser(user:RegisterDto){
        /*
        to register a user we need to do 3 things :
         1) Create and store a new user with the sent user data and the default role -
         2) use the generated userId to create and store all sent authenticators
         3) Generate the access token and refresh token and send it as a response to that user (in other words login for that user)
        */
        const newUser = await this.userService.create(user)//step 1
        for(let i =0, arr=user.authenticators;i<arr.length;i++){
            const auth_method = arr[i];
            let authenticator = new CreateAuthenticatorDto()
            authenticator = {...auth_method, userId:newUser.id}
            await this.authenticatorService.create(authenticator)//step 2
        }
        const refreshToken = await this.tokenService.createRefreshToken(newUser.id)
        const accessToken = this.tokenService.generateAccessToken(newUser.id)

        return{
            refreshToken:refreshToken.hashedToken,
            accessToken:accessToken
        }
    }

    async checkUserIdentifiers(username:string, email:string){
        const response ={
            message:'',
            valid:false
        }
        const check1 = await this.checkGuestUsername(username)
        const check2 = await this.checkGuestEmail(email)
        response.message = `${check1.message} ${check2.message}`
        response.valid = check1.valid && check2.valid
        return response
    }

    async checkGuestUsername(username:string){
        const userChecker = await this.prisma.user.findUnique({
            where:{username}
        })
        if(userChecker){
            // the username is used
            throw new BadRequestException({valid:false,message:"The username is used"})
        }
        //else means return true which means the username is valid
        return {
            valid:true,
            message:"username is available"
        }
    }
    async checkGuestEmail(email:string){
        const userChecker = await this.prisma.user.findUnique({
            where:{email}
        })
        if(userChecker){
            // the email is used
            throw new BadRequestException({valid:false,message:"The email is used"})
        }
        //else means return true which means the email is valid
        return {
            valid:true,
            message:"email is available"
        }
    }

}
