import { Component, OnInit } from '@angular/core';
import { Categorias } from 'src/app/models/categorias.models';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
  providers: [ConfirmationService]
})
export class CategoriasComponent implements OnInit {
  data: any = {};
  public loading = false;
  display: boolean = false;
  display2: boolean = false;
  categorias: Categorias = {
    nome: '',
    status: true,
    data_cadastro: '',
    user_cad: ''
  }
  item: any = {};
  listUsers: any[];
  cols: any[];

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    public toast: ToastrManager,
    private confirmationService: ConfirmationService
  ) {
    this.db.collection("categorias", ref => ref.orderBy('nome', 'asc')).valueChanges().subscribe(data => {
      this.listUsers = data;
    })

    this.cols = [
      { field: 'nome', header: 'Nome', width: '25%' },
      { field: 'data_cadastro', header: 'Data de Cadastro', width: '30%' },
      { field: 'user_cad', header: 'Cadastrado por', width: '25%' },
      { field: 'status', header: 'status', width: '20%' },
    ];
  }

  ngOnInit() {
    $(document).ready(() => {
      const trees: any = $('[data-widget="tree"]');
      if (trees) {
        trees.tree();
      }

    });
  }

  add() {
    this.display = true;
  }

  aceitar(categorias) {
    this.display = false;
    if (categorias.nome == "") {
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
  reject() {
    this.display = false;
  }
  update(user) {
    this.item = user;
    this.display2 = true;
  }
  reject2() {
    this.item = {};
    this.display2 = false;
  }

  atualizar(item, status) {
    item.status = status;
    this.db.collection(`categorias/`).doc(`${item.key}`).update(item)
      .then(() => {
        this.display2 = false;
        this.toast.successToastr('Categoria atualizada com sucesso.', 'Parabéns!');
      }).catch(err => {
        console.log(err);
        this.toast.errorToastr('Desculpe, não conseguimos realizar esta operação.', 'Aviso!');
      })

  }

  delete(user) {
    this.confirmationService.confirm({
      message: 'Você deseja excluir este registro?',
      accept: () => {
        this.loading = true;
        this.db.collection('categorias/').doc(`${user.key}`).delete().then(() => {
          this.loading = false;
          this.toast.successToastr('Categoria excluída com sucesso!', 'Parabéns!');
        }).catch((err) => {
          console.log(err);
          this.loading = false;
          this.toast.errorToastr('Desculpe, houve um erro na operação solicitada.', 'Aviso!');
        })
      }
    })
  }

}
