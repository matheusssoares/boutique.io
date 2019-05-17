import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Categorias } from 'src/app/models/categorias.models';
import { Departamentos } from 'src/app/models/departamentos.model';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { AngularFireAuth } from '@angular/fire/auth';
import { Produtos } from 'src/app/models/produtos.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirebaseApp } from 'angularfire2';

@Component({
  selector: 'app-edit-produtos',
  templateUrl: './edit-produtos.component.html',
  styleUrls: ['./edit-produtos.component.css'],
  providers: [MessageService]
})
export class EditProdutosComponent implements OnInit {
  data: any = {};
  display_cat: boolean = false;
  display_dep: boolean = false;
  public loading = false;
  produto: any = [];
  categorias: Categorias = {
    nome: '',
    status: true,
    data_cadastro: '',
    user_cad: ''
  }
  departamentos: Departamentos = {
    nome: '',
    status: true,
    data_cadastro: '',
    user_cad: ''
  }

  Itenscategorias: any[] = [];
  Itensdepartamentos: any[] = [];
  Itensfornecedor: any[] = [];

  uploadedFiles: any[] = [];
  uplo: File;
  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    public toast: ToastrManager,
    private router: Router,
    private auth: AngularFireAuth,
    private messageService: MessageService,
    private storage: AngularFireStorage,
    private firebaseApp: FirebaseApp,
  ) {
    this.db.collection('categorias', ref => ref.where('status', '==', true).orderBy('nome', 'asc')).valueChanges()
      .subscribe(data => {
        this.Itenscategorias = data;
      })
    this.db.collection('departamentos', ref => ref.where('status', '==', true).orderBy('nome', 'asc')).valueChanges()
      .subscribe(data => {
        this.Itensdepartamentos = data;
      })
    this.db.collection('fornecedores', ref => ref.orderBy('nome', 'asc')).valueChanges()
      .subscribe(data => {
        this.Itensfornecedor = data;
      })
  }

  ngOnInit() {
    $(document).ready(() => {
      const trees: any = $('[data-widget="tree"]');
      if (trees) {
        trees.tree();
      }

    });

    let id = this.route.snapshot.paramMap.get('key');
    this.db.collection('produtos/').doc(`${id}`).valueChanges()
      .subscribe(data => {
        this.produto = data
      })
  }

  add_cat() {
    this.display_cat = true;
  }
  add_dep() {
    this.display_dep = true;
  }
  reject_cat() {
    this.categorias.nome = '';
    this.display_cat = false;
  }
  reject_dep() {
    this.departamentos.nome = '';
    this.display_dep = false;
  }
  aceitar_cat(categorias) {
    this.display_cat = false;
    if (categorias == "") {
      this.toast.warningToastr('Você precisa preencher o nome da categoria.', 'Aviso!');
    } else {
      this.db.collection(`categorias`, ref => ref.where('nome', '==', categorias.nome)).get()
        .subscribe(data => {
          let a = data.docs;
          if (a.length == 1) {
            this.toast.errorToastr('Nome de categoria já utilizada.', 'Aviso!');
          } else {
            this.categorias.data_cadastro = moment().format('LLL');
            this.db.collection(`users/`).doc(this.auth.auth.currentUser.uid).valueChanges()
              .subscribe(data => {
                this.data = data;
                this.categorias.user_cad = this.data.name;
                this.categorias.key = this.db.createId();
                this.produto.categoria = categorias.nome;
                this.db.collection(`categorias/`).doc(`${this.categorias.key}`).set(this.categorias)
                  .then(() => {
                    this.categorias = {
                      nome: '',
                      status: true,
                      data_cadastro: '',
                      user_cad: ''
                    }
                    this.toast.successToastr('Categoria cadastrada com sucesso.', 'Parabéns!');
                  }).catch(err => {
                    console.log(err);
                    this.toast.errorToastr('Desculpe, não conseguimos realizar esta operação.', 'Aviso!');
                  })
              })
          }
        })
    }
  }
  aceitar_dep(departamentos) {
    this.display_dep = false;
    if (departamentos == "") {
      this.toast.warningToastr('Você precisa preencher o nome do departamento.', 'Aviso!');
    } else {
      this.db.collection(`departamentos`, ref => ref.where('nome', '==', departamentos.nome)).get()
        .subscribe(data => {
          let a = data.docs;
          if (a.length == 1) {
            this.toast.errorToastr('Nome do departamento já utilizado.', 'Aviso!');
          } else {
            this.departamentos.data_cadastro = moment().format('LLL');
            this.db.collection(`users/`).doc(this.auth.auth.currentUser.uid).valueChanges()
              .subscribe(data => {
                this.data = data;
                this.departamentos.user_cad = this.data.name;
                this.departamentos.key = this.db.createId();
                this.produto.departamento = departamentos.nome;
                this.db.collection(`departamentos/`).doc(`${this.departamentos.key}`).set(this.departamentos)
                  .then(() => {
                    this.departamentos = {
                      nome: '',
                      status: true,
                      data_cadastro: '',
                      user_cad: ''
                    }
                    this.toast.successToastr('Departamento cadastrado com sucesso.', 'Parabéns!');
                  }).catch(err => {
                    console.log(err);
                    this.toast.errorToastr('Desculpe, não conseguimos realizar esta operação.', 'Aviso!');
                  })
              })
          }
        })
    }
  }

  gerarPrecos(produto: Produtos) {
    var custo = produto.custo
    if (custo == null) {
      custo = 0;
    } else {
      var doc = '5ogPSqqGRAFvIoOsbjcM';
      this.db.collection(`config/`).doc(`${doc}`).valueChanges().subscribe(data => {
        this.data = data;
        var parcial = custo * this.data.markup;
        var cal = parcial / 100;
        var final = custo + cal;
        this.produto.vista = final;
        this.produto.prazo = final * 1.1;
      })

    }

  }

  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }
  onSelect(event) {
    console.log('select');
    for (let file of event.files) {
      this.uplo = file;
      console.log(this.uplo);

    }
  }

  submited(produto: Produtos) {
    this.loading = true;
    if (this.uplo) {
      this.storage.ref(`images/produtos/${produto.key}`).delete();

      let uploadTask = this.firebaseApp.storage().ref().child(`images/produtos/${produto.key}`)
        .put(this.uplo);

      uploadTask.then((snapshot) => {
        snapshot.ref.getDownloadURL().then(download => {
          produto.foto = download;

          this.db.doc(`produtos/${produto.key}`).update(produto).then(() => {
            this.loading = false;
            this.toast.successToastr('Produto atualizado com sucesso.', 'Parabéns!');
            this.router.navigate(['admin/produtos']);
          }).catch((err) => {
            this.loading = false;
            console.log(err);
            this.toast.errorToastr('Desculpe! Não conseguimos atualizar este produto.', ' Aviso!');
          })
        })
      }).catch(err => {
        this.loading = false;
        console.log(err);
        this.toast.errorToastr('Desculpe! Erro no upload de imagem.', 'Aviso!');
      })

    } else {
      this.loading = false;
      this.db.doc(`produtos/${produto.key}`).update(produto).then(() => {
        this.toast.successToastr('Produto atualizado com sucesso.', 'Parabéns!');
        this.router.navigate(['admin/produtos']);
      }).catch(err => {
        console.log(err);
        this.toast.errorToastr('Desculpe! não conseguimos concluir a operação.', 'Aviso!');
      })
    }
  }
}
