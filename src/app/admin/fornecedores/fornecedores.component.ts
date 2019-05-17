import { Component, OnInit } from '@angular/core';
import { Fornecedores } from 'src/app/models/fornecedores.model';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AngularFirestore } from '@angular/fire/firestore';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fornecedores',
  templateUrl: './fornecedores.component.html',
  styleUrls: ['./fornecedores.component.css'],
  providers: [ConfirmationService]
})
export class FornecedoresComponent implements OnInit {
  public loading = false;
  fornecedor: Fornecedores = {
    nome: '',
    email: '',
    cnpj: '',
    contato: '',
    data_cadastro: ''
  }
  listUsers: any[];
  cols: any[];

  constructor(
    public toast: ToastrManager,
    private db: AngularFirestore,
    private confirmationService: ConfirmationService,
    private router: Router,
  ) {
    this.db.collection("fornecedores", ref => ref.orderBy('nome', 'asc')).valueChanges().subscribe(data => {
      this.listUsers = data;
    })

    this.cols = [
      { field: 'nome', header: 'Nome', width: '30%' },
      { field: 'email', header: 'Email', width: '30%' },
      { field: 'cnpj', header: 'CPF/CNPJ', width: '20%' },
      { field: 'contato', header: 'Contato', width: '20%' },
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

  submited(fornecedor: Fornecedores) {
    this.loading = true;
    if (fornecedor.nome == "") {
      this.loading = false;
      this.toast.warningToastr('Você precisa preencher o campo nome.', 'Aviso!');
    } else {
      this.db.collection(`fornecedores`, ref => ref.where('nome', '==', fornecedor.nome)).get()
        .subscribe(data => {
          let a = data.docs;
          if (a.length == 1) {
            this.loading = false;
            this.toast.errorToastr('Já há um Fornecedor cadastrado com este nome.', 'Aviso!');
          } else {
            fornecedor.key = this.db.createId();
            fornecedor.data_cadastro = moment().format('LLL');
            this.db.collection('fornecedores/').doc(`${fornecedor.key}`).set(fornecedor)
              .then(() => {
                this.loading = false;
                this.toast.successToastr('Fornecedor cadastrado com sucesso.', 'Parabéns!');
                this.fornecedor = {
                  nome: '',
                  email: '',
                  cnpj: '',
                  contato: '',
                  data_cadastro: ''
                }
              }).catch((err) => {
                this.loading = false;
                console.log(err);
                this.toast.errorToastr('Desculpe, não conseguimos realizar esta operação.', 'Aviso!');
              })
          }
        })
    }
  }
  update(user: Fornecedores) {
    let key = user.key
    this.router.navigate([`admin/fornecedores/${key}`]);
  }

  delete(user) {
    this.confirmationService.confirm({
      message: 'Você deseja excluir este registro?',
      accept: () => {
        this.loading = true;
        this.db.collection('fornecedores/').doc(`${user.key}`).delete().then(() => {
          this.loading = false;
          this.toast.successToastr('Fornecedor excluído com sucesso!', 'Parabéns!');
        }).catch((err) => {
          console.log(err);
          this.loading = false;
          this.toast.errorToastr('Desculpe, houve um erro na operação solicitada.', 'Aviso!');
        })
      }
    })
  }

}
