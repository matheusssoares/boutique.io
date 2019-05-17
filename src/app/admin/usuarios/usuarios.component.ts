import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Users } from 'src/app/models/users.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseApp } from 'angularfire2';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import * as moment from 'moment';
import 'moment/locale/pt-br';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  providers: [ConfirmationService]
})
export class UsuariosComponent implements OnDestroy, OnInit {
  public loading = false;
  form_valid: FormGroup;
  users: Users = {
    name: '',
    email: '',
    profile: '',
    pass: '',
    confirm_pass: ''
  }
  selectedFile: File;
  fotoperfil: Observable<string>;
  uploadPercent: Observable<number>;
  listUsers: any[];
  cols: any[];

  constructor(
    private router: Router,
    private firebaseApp: FirebaseApp,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    public formBuilder: FormBuilder,
    public toast: ToastrManager,
    private confirmationService: ConfirmationService
  ) {
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.form_valid = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      pass: ['', [Validators.required, Validators.minLength(8)]],
      confirm_pass: ['', [Validators.required, Validators.minLength(8)]],
      profile: ['', [Validators.required]],
    });
    //this.listUsers = this.db.collection("users", ref => ref.orderBy('name', 'asc')).valueChanges();
  }
  ngOnInit() {
    $(document).ready(() => {
      const trees: any = $('[data-widget="tree"]');
       if (trees) {        
         trees.tree();
       }
       
     });
    this.db.collection("users", ref => ref.orderBy('name', 'asc')).valueChanges().subscribe(data => {
      this.listUsers = data;
    })

    this.cols = [
      { field: 'name', header: 'Nome Completo' },
      { field: 'email', header: 'Email de Acesso' },
      { field: 'profile', header: 'Perfil' }
    ];

  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    let type = event.target.files[0].type;
    if (type == 'image/jpeg' || type == 'image/png') {
      const filePath = 'images/users/';
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedFile);
      // observe percentage changes
      this.uploadPercent = task.percentageChanges();

      // get notified when the download URL is available
      task.snapshotChanges().pipe(
        finalize(() => this.fotoperfil = fileRef.getDownloadURL())
      )
        .subscribe()

    } else {
      console.log('formato não aceito');
      this.toast.errorToastr('Formato de arquivo não aceito.', 'Aviso!');
    }

  }
  onSubmit() {
    this.loading = true;
    this.users.name = this.form_valid.value.name;
    this.users.email = this.form_valid.value.email;
    this.users.profile = this.form_valid.value.profile;
    this.users.pass = this.form_valid.value.pass;
    this.users.data_cadastro = moment().format('LLL');
    if (this.form_valid.value.pass === this.form_valid.value.confirm_pass) {
      this.afAuth.auth.createUserWithEmailAndPassword(this.form_valid.value.email, this.form_valid.value.pass)
        .then(credentials => {
          this.users.key = credentials.user.uid;
          let uploadTask = this.firebaseApp.storage().ref()
            .child(`images/users/${this.users.key}`)
            .put(this.selectedFile);
          uploadTask.on('state_changed', (carr) => {
            console.log('carregando: ', carr);
          }, (error: Error) => {
            console.log(error);
          })
          uploadTask.then((snapshot) => {
            snapshot.ref.getDownloadURL().then(download => {
              this.users.imagePath = download;
              this.db.doc(`users/${this.users.key}`).set(this.users)
                .then(() => {
                  this.loading = false;
                  this.form_valid.reset();
                  this.fotoperfil = null;
                  this.uploadPercent = null;
                  this.toast.successToastr('Usuário adicionado com sucesso.', 'Parabéns!');
                }).catch((err) => {
                  this.loading = false;
                  console.log(err);
                  this.toast.errorToastr('Desculpe, houve um erro na operação solicitada.', 'Aviso!');
                })
            });
          });

        }).catch(e => {
          this.loading = false;
          switch (e.code) {
            case 'auth/email-already-in-use':
              this.toast.warningToastr('Email utilizado por outro usuário.', 'Aviso!');
          }
        });

    } else {
      this.loading = false;
      this.toast.errorToastr('Campo senha e confirmação não são iguais.', 'Aviso!');
    }

  }

  update(user: Users) {
    let key = user.key
    this.router.navigate([`admin/usuarios/${key}`]);
  }

  delete(user: Users) {
    this.confirmationService.confirm({
      message: 'Você deseja excluir este registro?',
      accept: () => {
        this.loading = true;
        console.log(user);
        if (user.key == this.afAuth.auth.currentUser.uid) {
          this.loading = false;
          this.toast.errorToastr('Desculpe, não há como remover um usuário que está logado no momento.', 'Aviso!');
        } else {
          this.firebaseApp.storage().ref('images/users/' + user.key).delete()
            .then(() => {
              this.db.doc(`users/${user.key}`).delete().then(() => {
                this.loading = false;
                this.toast.successToastr('Usuário excluído com sucesso!', 'Parabéns!');
              }).catch((err) => {
                console.log(err);
                this.loading = false;
                this.toast.errorToastr('Desculpe, houve um erro na operação solicitada.', 'Aviso!');
              })
            }).catch((err) => {
              this.loading = false;
              console.log(err);
            })
        }

      }
    });

  }

}
