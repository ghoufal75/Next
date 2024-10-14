import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, Observable, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({providedIn : 'root'})
export class AuthInterceptor implements HttpInterceptor{
    constructor(private authService : AuthService){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.connectedUser$.pipe(take(1),exhaustMap(user=>{
            if(user && user.token && !req.url.includes("signin") ){
                let headers = new HttpHeaders().append("Authorization",`Bearer ${(user!).token}`);
                // .append('ngrok-skip-browser-warning','false');
                let newReq = req.clone({headers});
                return next.handle(newReq);
            }
            let headers = new HttpHeaders().append('ngrok-skip-browser-warning','false');
            let newReq = req.clone({headers});
            return next.handle(newReq);
        }))
    }
}
