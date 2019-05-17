import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  users: any = [];
  dados: any = [];
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private route: Router,
  ) { }

  ngOnInit() {
    this.db.collection('users/').doc(this.auth.auth.currentUser.uid).valueChanges()
    .subscribe(data => {
      this.users = data
    })

    this.db.collection('pedido_de_compra', ref => ref.where('status', '==', false)).valueChanges()
    .subscribe(ret => {
      this.dados =  ret;
     // console.log(this.dados);
      
    })
  }
  navegar(i){
    let id = i.key;
    this.route.navigate([`admin/entrada-estoque/${id}`]);
    
  }
  logout(){
    this.auth.auth.signOut();
  }

}
