import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirebaseApp } from 'angularfire2';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  public loading = false;
  uploadPercent: Observable<number>;
  selectedFile: File;
  config: any = {};
  constructor(
    private db: AngularFirestore,
    public toast: ToastrManager,
    private storage: AngularFireStorage,
    private firebaseApp: FirebaseApp,
  ) {
    var key = '5ogPSqqGRAFvIoOsbjcM';
    const docRef = this.db.doc(`config/${key}`);
    docRef.valueChanges().subscribe(data => {
      this.config = data;
    });


  }

  ngOnInit() {
    $(document).ready(() => {
      const trees: any = $('[data-widget="tree"]');
      if (trees) {
        trees.tree();
      }

    });
  }

  onFileChanged(event) {
    this.loading = true;
    let id = '5ogPSqqGRAFvIoOsbjcM';
    this.storage.ref(`images/config/${id}`).delete();

    this.selectedFile = event.target.files[0];
    let type = event.target.files[0].type;

    if (type == 'image/jpeg' || type == 'image/png') {
      let uploadTask = this.firebaseApp.storage().ref()
        .child(`images/config/${id}`)
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
          this.db.doc(`config/${id}`).update({ logotipo_path: foto })
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

  submited(config) {
    this.loading = true;
    let id = '5ogPSqqGRAFvIoOsbjcM';
    this.db.doc(`config/${id}`).set(config)
      .then(() => {
        this.loading = false;
        this.toast.successToastr('Configurações atualizadas com sucesso.', 'Parabéns!');
      }).catch((err) => {
        console.log(err);
        this.toast.errorToastr('Desculpe, houve um erro na operação solicitada.', 'Aviso!');
      })

  }

}
