import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  users: any = [];
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
  ) { }

  ngOnInit() {
    this.db.collection('users/').doc(this.auth.auth.currentUser.uid).valueChanges()
    .subscribe(data => {
      this.users = data
    })
  }

}
