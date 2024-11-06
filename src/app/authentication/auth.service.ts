import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, throwError } from "rxjs";
import {catchError, tap} from 'rxjs/operators';
import { StorageService } from "../services/storage.service";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";

class User{
  constructor(public _id:string,public fullName : string,public username : string,public profilePic:string, private _token : string, private _expirationDate : Date ){}

  get token(){
    let diff = new Date().getTime() - new Date(this._expirationDate).getTime();
    console.log("Here is the diff : ",diff);
    if(new Date().getTime() - new Date(this._expirationDate).getTime()>0){
      return null;
    }
    return this._token;
  }
}


@Injectable({providedIn : 'root'})
export class AuthService{

  connectedUser$ : BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  connectedUser : User | any;
  constructor(private navCtrl : NavController,private router : Router,private storageService : StorageService,private http : HttpClient){}

  signIn(user:any,provider:string){
    return this.http.post(environment.api+'/api/authentication/'+provider,user).pipe(tap((res:any)=>{
      this.handleAuth(res);
    }),catchError(this.handleError))
  }

  handleAuth(response : any){
    console.log("Here is the res : ",response);
    this.connectedUser = new User(response._id,response.fullName,response.username,response.profilePic,response.access_token,new Date(new Date().getTime()+(response.expiresIn*3600)));
    this.storageService.addToStorage("connectedUser",JSON.stringify(this.connectedUser));
    this.connectedUser$.next(this.connectedUser);
  }

  handleError(httpError : HttpErrorResponse) : Observable<any>{
    console.log("Here is error : ",httpError);
    let error = "An uknown error occured.";
    switch(httpError.status){
      case 404:
        error = "No user with these credentials";
        break;
      case 400:
        error = "Invalid credentials.";
        break;
    }
    return throwError(()=>error);
  }


  async autoLogin(){
    let userHelper : any= await this.storageService.getFromStorage("connectedUser");
    if(userHelper){
      userHelper = JSON.parse(userHelper);
      this.connectedUser = new User(userHelper._id,userHelper.fullName,userHelper.username,userHelper.profilePic,userHelper._token,userHelper._expirationDate);
      this.connectedUser$.next(this.connectedUser);

    }
  }

  logout(){
    this.connectedUser = null;
    this.connectedUser$.next(null);
    this.storageService.removeFromStorage('connectedUser');
    this.navCtrl.navigateBack('/authentication');
  }
}
