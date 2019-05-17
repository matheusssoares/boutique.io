import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { ContasAPagar } from '../models/contasAPagar.model';

@Component({
  selector: 'app-contas-pagas',
  templateUrl: './contas-pagas.component.html',
  styleUrls: ['./contas-pagas.component.css'],
  providers: [ConfirmationService],
})
export class ContasPagasComponent implements OnInit {
  cols: any[];
  listUsers: any[];
  data: any = {};

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    public toast: ToastrManager,
    private confirmationService: ConfirmationService,
    private router: Router,
    ) {
      this.db.collection('contas_pagar', ref => ref.where('paga', '==', true).orderBy('processoupg', 'desc')).valueChanges().subscribe(data => {
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

    this.cols = [
      { field: 'vencimento', header: 'Vencimento', width: '15%' },
      { field: 'beneficiario', header: 'Beneficiário', width: '35%' },
      { field: 'classificacao', header: 'Classificação', width: '20%' },
      { field: 'total', header: 'Total', width: '15%' },
      { field: 'data_pagamento', header: 'Pagamento Em', width: '15%' },
    ];
  }

  delete(conta: ContasAPagar){
    console.log(conta);
     this.confirmationService.confirm({
      message: 'Você deseja excluir esta conta? Lembre-se, esta ação não poderá ser desfeita.',
      accept: () => {
        this.db.collection('contas_pagar').doc(conta.key).delete()
        .then(() => {
          this.toast.successToastr('Conta excluída com sucesso!', 'Parabéns!');
        }).catch((err) => {
          console.log(err);
          this.toast.errorToastr('Não foi possível concluir a operação', ' Desculpe!');
          
        })

      }
    });
  }

}
