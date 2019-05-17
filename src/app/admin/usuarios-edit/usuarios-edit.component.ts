import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FirebaseApp } from 'angularfire2';
import { Users } from 'src/app/models/users.model';

@Component({
  selector: 'app-usuarios-edit',
  templateUrl: './usuarios-edit.component.html',
  styleUrls: ['./usuarios-edit.component.css']
})
export class UsuariosEditComponent implements OnInit {
  public loading = false;
  users: any;
  uploadPercent: Observable<number>;
  selectedFile: File;
  updatefotoperfil: Observable<string>;
  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    public toast: ToastrManager,
    private firebaseApp: FirebaseApp,
  ) {

  }

  ngOnInit() {
    $(document).ready(() => {
      const trees: any = $('[data-widget="tree"]');
       if (trees) {        
         trees.tree();
       }
       
     });
    let id = this.route.snapshot.paramMap.get('key');
    const docRef = this.db.doc(`users/${id}`);
    this.users = docRef.valueChanges();
  }

  onFileChanged(event) {
    this.loading = true;
    let id = this.route.snapshot.paramMap.get('key');
    this.storage.ref(`images/users/${id}`).delete();

    this.selectedFile = event.target.files[0];
    let type = event.target.files[0].type;

    if (type == 'image/jpeg' || type == 'image/png') {
      let uploadTask = this.firebaseApp.storage().ref()
        .child(`images/users/${id}`)
        .put(this.selectedFile);
      uploadTask.on('state_changed', (carr) => {
        console.log('carregando: ', carr);
      }, (error: Error) => {
        console.log(error);
      })
      var porcentagem = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
      uploadTask.then((snapshot) => {
        snapshot.ref.getDownloadURL().then(download => {
          let foto = download;
          this.db.doc(`users/${id}`).update({ imagePath: foto })
            .then(() => {
              this.loading = false;
              this.toast.successToastr('Foto atualizada com sucesso.', 'Parabéns!');
            }).catch((err) => {
              this.loading = false;
              console.log(err);
              this.toast.errorToastr('Desculpe, houve um erro na operação solicitada.', 'Aviso!');
            })
        });
      });
    } else {
      console.log('formato não aceito');
      this.toast.errorToastr('Formato de arquivo não aceito.', 'Aviso!');
    }
  }
  submited(user: Users) {
    this.loading = true;
    this.db.doc(`users/${user.key}`).update(user)
      .then(() => {
        this.loading = false;
        this.toast.successToastr('Dados atualizados com sucesso.', 'Parabéns!');
      }).catch((err) => {
        this.loading = false;
        console.log(err);
        this.toast.errorToastr('Desculpe, houve um erro na operação solicitada.', 'Aviso!');
      })

  }
}
