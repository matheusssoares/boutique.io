import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ConfirmationService } from 'primeng/api';
import { Departamentos } from 'src/app/models/departamentos.model';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css'],
  providers: [ConfirmationService]
})

export class DepartamentosComponent implements OnInit {
  data: any = {};
  public loading = false;
  display: boolean = false;
  display2: boolean = false;
  departamento: Departamentos = {
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
    this.db.collection("departamentos", ref => ref.orderBy('nome', 'asc')).valueChanges().subscribe(data => {
      this.listUsers = data;
    })

    this.cols = [
      { field: 'nome', header: 'Nome', width: '35%' },
      { field: 'data_cadastro', header: 'Data de Cadastro', width: '30%' },
      { field: 'user_cad', header: 'Cadastrado por', width: '25%' },
      { field: 'status', header: 'status', width: '10%' },
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
//Adulto - Masculino
  aceitar(departamento) {
    this.display = false;
    if (departamento.nome == "") {
      this.toast.warningToastr('Você precisa preencher o nome do departamento.', 'Aviso!');
    } else {
      this.db.collection(`departamentos`, ref => ref.where('nome', '==', departamento.nome)).get()
        .subscribe(data => {
          let a = data.docs;
          if (a.length == 1) {
            this.toast.errorToastr('Nome de departamento já utilizado.', 'Aviso!');
          } else {
            this.departamento.data_cadastro = moment().format('LLL');
            this.db.collection(`users/`).doc(this.auth.auth.currentUser.uid).valueChanges()
              .subscribe(data => {
                this.data = data;
                this.departamento.user_cad = this.data.name;
                this.departamento.key = this.db.createId();

                this.db.collection(`departamentos/`).doc(`${this.departamento.key}`).set(this.departamento)
                  .then(() => {
                    this.departamento = {
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
    this.db.collection(`departamentos/`).doc(`${item.key}`).update(item)
      .then(() => {
        this.display2 = false;
        this.toast.successToastr('Departamento atualizado com sucesso.', 'Parabéns!');
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
        this.db.collection('departamentos/').doc(`${user.key}`).delete().then(() => {
          this.loading = false;
          this.toast.successToastr('Departamento excluído com sucesso!', 'Parabéns!');
        }).catch((err) => {
          console.log(err);
          this.loading = false;
          this.toast.errorToastr('Desculpe, houve um erro na operação solicitada.', 'Aviso!');
        })
      }
    })
  }

}
