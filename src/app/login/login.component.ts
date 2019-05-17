import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signinForm: FormGroup;
  public loading = false;
  constructor(
    public toastr: ToastrManager,
    public authService: AuthService,
    private router: Router,
    public formBuilder: FormBuilder,
    private db: AngularFirestore
  ) {

    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.signinForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
  }

  onSubmit(): void {
    this.loading = true;
    let a = this.db.collection('users', ref => ref.where('email', '==', this.signinForm.value.email))
      .get();
    a.subscribe(dados => {
      if (dados.docs.length == 1) {
        this.authService.auth.auth
          .signInWithEmailAndPassword(this.signinForm.value.email, this.signinForm.value.password)
          .then(() => {
            this.loading = false;
            this.router.navigate(['admin/dashboard']);
          }, error => {
            console.log(error);
            this.loading = false;
            switch (error.code) {
              case 'auth/wrong-password':
                this.toastr.errorToastr('Senha incorreta! Tente novamente...', 'Oops!');
                break;

              case 'auth/user-not-found':
                this.toastr.warningToastr('Email incorreto! Tente novamente...', 'Oops!');
                break;
            }
          })
      } else {
        this.loading = false;
        this.toastr.warningToastr('Email incorreto! Tente novamente...', 'Oops!');
      }

    })

    /* */

  }
}
