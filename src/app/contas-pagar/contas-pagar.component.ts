import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ContasAPagar } from '../models/contasAPagar.model';

@Component({
  selector: 'app-contas-pagar',
  templateUrl: './contas-pagar.component.html',
  styleUrls: ['./contas-pagar.component.css'],
  providers: [ConfirmationService],
})
export class ContasPagarComponent implements OnInit {
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

    this.db.collection('contas_pagar', ref => ref.where('paga', '==', false).orderBy('vencimento', 'asc')).valueChanges().subscribe(data => {
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
      { field: 'criado_por', header: 'Criado Por', width: '15%' },
    ];

  }
  update(conta: ContasAPagar) {
    console.log(conta);
    let key = conta.key
    this.router.navigate([`admin/financeiro/pagar-conta/${key}`]);
  }

  delete(conta: ContasAPagar){
    //console.log(conta);
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
