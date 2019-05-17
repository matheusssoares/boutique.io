import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ConfirmationService } from 'primeng/api';
import * as moment from 'moment';
import 'moment/locale/pt-br';

@Component({
  selector: 'app-caixas',
  templateUrl: './caixas.component.html',
  styleUrls: ['./caixas.component.css'],
  providers: [ConfirmationService]
})
export class CaixasComponent implements OnInit {
  caixas: any = {
    nome: '',
    status: false,
  }
  public loading = false;
  display: boolean = false;
  display2: boolean = false;
  listUsers: any[];
  data: any = {};
  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    public toast: ToastrManager,
    private confirmationService: ConfirmationService) {
    this.db.collection("caixas", ref => ref.orderBy('nome', 'asc')).valueChanges().subscribe(data => {
      this.listUsers = data;
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
  add() {
    this.display = true;
  }

  aceitar(caixas) {
    this.display = false;
    if (caixas.nome == "") {
      this.toast.warningToastr('Você precisa preencher o nome do caixa.', 'Aviso!');
    } else {
      this.db.collection(`caixas`, ref => ref.where('nome', '==', caixas.nome)).get()
        .subscribe(data => {
          let a = data.docs;
          if (a.length == 1) {
            this.toast.errorToastr('Nome de caixa já utilizado.', 'Aviso!');
          } else {
            this.caixas.data_cadastro = moment().format('LLL');
            this.db.collection(`users/`).doc(this.auth.auth.currentUser.uid).valueChanges()
              .subscribe(data => {
                this.data = data;
                this.caixas.user_cad = this.data.name;
                this.caixas.key = this.db.createId();

                this.db.collection(`caixas/`).doc(`${this.caixas.key}`).set(this.caixas)
                  .then(() => {
                    this.caixas = {
                      nome: '',
                      status: false,
                      data_cadastro: '',
                      user_cad: ''
                    }
                    this.toast.successToastr('Caixa cadastrado com sucesso.', 'Parabéns!');
                  }).catch(err => {
                    console.log(err);
                    this.toast.errorToastr('Desculpe, não conseguimos realizar esta operação.', 'Aviso!');
                  })
              })
          }
        })
    }
  }

  update(caixa) {
    this.caixas = caixa;
    this.display2 = true;
  }

  atualizar(caixas) {
    if (caixas.nome == "") {
      this.toast.warningToastr('Você precisa preencher o nome do caixa.', 'Aviso!');
    } else {
      this.db.collection(`caixas`, ref => ref.where('nome', '==', caixas.nome)).get()
        .subscribe(data => {
          let a = data.docs;
          if (a.length == 1) {
            this.toast.errorToastr('Nome de caixa já utilizado.', 'Aviso!');
          } else {
            this.db.collection(`caixas/`).doc(`${caixas.key}`).update(caixas)
              .then(() => {
                this.display2 = false;
                this.toast.successToastr('Caixa atualizado com sucesso.', 'Parabéns!');
              }).catch(err => {
                console.log(err);
                this.toast.errorToastr('Desculpe, não conseguimos realizar esta operação.', 'Aviso!');
              })
          }
        })
    }

  }

  delete(user) {
    this.confirmationService.confirm({
      message: 'Você deseja excluir este registro?',
      accept: () => {
        this.loading = true;
        this.db.collection('caixas/').doc(`${user.key}`).delete().then(() => {
          this.loading = false;
          this.toast.successToastr('Caixa excluído com sucesso!', 'Parabéns!');
        }).catch((err) => {
          console.log(err);
          this.loading = false;
          this.toast.errorToastr('Desculpe, houve um erro na operação solicitada.', 'Aviso!');
        })
      }
    })
  }
}
