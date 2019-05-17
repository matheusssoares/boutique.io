import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ContaGe } from '../models/contaGe.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import 'moment/locale/pt-br';

@Component({
  selector: 'app-conta-gerencial',
  templateUrl: './conta-gerencial.component.html',
  styleUrls: ['./conta-gerencial.component.css'],
  providers: [ConfirmationService]
})
export class ContaGerencialComponent implements OnInit {
  data: any = {};
  public loading = false;
  display: boolean = false;
  display2: boolean = false;
  conta: ContaGe = {
    nome: '',
    tipo: 1,
    classi: '',
    compras: false,
    status: true
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
    this.db.collection('conta_gerencial', ref => ref.orderBy('nome', 'asc')).valueChanges().subscribe(data => {
      this.listUsers = data;
    })
    this.cols = [
      { field: 'nome', header: 'Descrição', width: '30%' },
      { field: 'tipo', header: 'Tipo', width: '10%' },
      { field: 'classi', header: 'Grupo', width: '20%' },
      { field: 'compras', header: 'Compras', width: '10%' },
      { field: 'status', header: 'Status', width: '10%' },
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

  aceitar(conta) {
    this.display = false;
    this.loading = true;
    if (conta.nome == "") {
      this.toast.warningToastr('Você precisa preencher a descrição da conta.', 'Aviso!');
    } else {
      this.db.collection(`conta_gerencial`, ref => ref.where('nome', '==', conta.nome)).get()
        .subscribe(data => {
          let a = data.docs;
          if (a.length == 1) {
            this.toast.errorToastr('Descrição da conta já utilizada.', 'Aviso!');
          } else {
            this.conta.data_cadastro = moment().format('LLL');
            this.db.collection(`users/`).doc(this.auth.auth.currentUser.uid).valueChanges()
              .subscribe(data => {
                this.data = data;
                this.conta.user_cad = this.data.name;
                this.conta.key = this.db.createId();

                this.db.collection(`conta_gerencial/`).doc(`${this.conta.key}`).set(this.conta)
                  .then(() => {
                    this.conta = {
                      nome: '',
                      tipo: 1,
                      classi: '',
                      compras: false,
                      status: true,
                    }

                    this.loading = false;
                    this.toast.successToastr('Conta cadastrada com sucesso.', 'Parabéns!');
                  }).catch(err => {
                    console.log(err);
                    this.loading = false;
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
  atualizar(item, compras, status){
    item.compras = compras;
    item.status = status;
    this.display2 = false;
    this.loading = true;
    this.db.collection('conta_gerencial').doc(`${item.key}`).update(item).then(() => {
      this.loading = false;
      this.toast.successToastr('Conta atualizada com sucesso.', 'Parabéns!');
    }).catch((err) => {
      console.log(err);
      this.loading = false;
      this.toast.errorToastr('Desculpe, não conseguimos realizar esta operação.', 'Aviso!');
    })

  }

  delete(user) {
    this.confirmationService.confirm({
      message: 'Você deseja excluir este registro?',
      accept: () => {
        this.loading = true;
        this.db.collection('conta_gerencial/').doc(`${user.key}`).delete().then(() => {
          this.loading = false;
          this.toast.successToastr('Conta excluída com sucesso!', 'Parabéns!');
        }).catch((err) => {
          console.log(err);
          this.loading = false;
          this.toast.errorToastr('Desculpe, houve um erro na operação solicitada.', 'Aviso!');
        })
      }
    })
  }

}
