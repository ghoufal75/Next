import { Injectable } from "@angular/core";
import { Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import {take, map, tap } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({providedIn : 'root'})
export class AuthGuard {
    constructor(private authService : AuthService, private router : Router){}
    canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
        return this.authService.connectedUser$.pipe(take(1),map((user : any)=>{
            return !!user;
        }),tap(isUser=>{
          if(!isUser){
            this.router.navigateByUrl('/authentication');
            return false;
          }
          return true;
        }))
  }
}
