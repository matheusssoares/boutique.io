import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Produtos } from 'src/app/models/produtos.model';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Categorias } from 'src/app/models/categorias.models';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { AngularFireAuth } from '@angular/fire/auth';
import { Departamentos } from 'src/app/models/departamentos.model';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { FirebaseApp } from 'angularfire2';

@Component({
  selector: 'app-produtos-novo',
  templateUrl: './produtos-novo.component.html',
  styleUrls: ['./produtos-novo.component.css'],
  providers: [MessageService]
})
export class ProdutosNovoComponent implements OnInit {
  matheus: any;
  uploadedFiles: any[] = [];
  data: any = {};
  display_cat: boolean = false;
  display_dep: boolean = false;
  public loading = false;
  public achou = true;
  barcode: string = '';
  produto: Produtos = {
    nome: '',
    categoria: '',
    qtde: 1,
    qtde_min: 1,
    status: true
  }
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
  uplo: File;
  constructor(
    private db: AngularFirestore,
    public toast: ToastrManager,
    private auth: AngularFireAuth,
    private messageService: MessageService,
    private firebaseApp: FirebaseApp,
    private router: Router
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

  buscar() {
    this.loading = true;
    this.db.collection('produtos', ref => ref.orderBy('barcode', 'desc').limit(1)).valueChanges().subscribe(dados => {
      if (dados.length) {
        dados.forEach(a => {
          this.matheus = a;
          let barcode = this.matheus.barcode;
          console.log(barcode);
          this.loading = false;
          this.produto.barcode = barcode + 1;
        })
      } else {
        this.loading = false;
        this.produto.barcode = 10000001;
      }

      this.achou = false;

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
  submited(produto: Produtos) {
    this.loading = true;
    this.produto.qtde_atual = produto.qtde;
    this.produto.key = this.db.createId();
    this.produto.data_cadastro = moment().format('LLL');
    this.produto.movimento = 1; //1 entrada, 2 saída.

    let nome = this.produto.nome.toLocaleUpperCase();

    this.produto.nome = nome;
    

    let uploadTask = this.firebaseApp.storage().ref().child(`images/produtos/${this.produto.key}`)
      .put(this.uplo);

    uploadTask.then((snapshot) => {
      snapshot.ref.getDownloadURL().then(download => {
        this.produto.foto = download;

        this.db.collection(`produtos`).doc(`${this.produto.key}`).set(produto).then(() => {
          this.loading = false;
          this.toast.successToastr('Produto cadastrado com sucesso!', 'Parabéns!');
          this.router.navigate(['admin/produtos']);
        }).catch((err) => {
          this.loading = false;
          console.log(err);
          this.toast.errorToastr('Desculpe! Não conseguimos cadastrar este produto.', ' Aviso!');

        })
      })
    }).catch(err => {
      this.loading = false;
      console.log(err);
      this.toast.errorToastr('Desculpe! Erro no upload de imagem.', ' Aviso!');

    })

  }

}
