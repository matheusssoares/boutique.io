import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseApp } from 'angularfire2';
@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate{
  
  constructor(private router: Router, public auth: AngularFireAuth, public firebaseApp: FirebaseApp,) { 
    
  }
 canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged((user: firebase.User) => {
          if(user) {
            resolve(true);
          } else {
            console.log('acesso proibido!');
            this.router.navigate(['/login']);
            resolve(false);
          }
        });
      })
    }
    uploadfoto_perfil(foto: File){
      return this.firebaseApp.storage()
      .ref()
      .child(`imagens/users/`)
      .put(foto);
    }
    

}
