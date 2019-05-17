import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'moment/locale/pt-br';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-entrada-estoque',
  templateUrl: './entrada-estoque.component.html',
  styleUrls: ['./entrada-estoque.component.css'],
  providers: [ConfirmationService]
})

export class EntradaEstoqueComponent implements OnInit {
  listUsers: any[];
  cols: any[];
  public loading: boolean = false;
  constructor(
    private db: AngularFirestore,
    public toast: ToastrManager,
    private route: Router,
    private confirmationService: ConfirmationService
  ) {
    this.db.collection("pedido_de_compra", ref => ref.orderBy('data_emissao', 'asc')).valueChanges().subscribe(data => {
      this.listUsers = data;
    })
    this.cols = [
      { field: 'solicitante', header: 'Solicitante', width: '30%' },
      { field: 'data_emissao', header: 'Data de Emissão', width: '30%' },
      { field: 'status', header: 'Situação', width: '10%' },
      { field: 'total', header: 'Total', width: '20%' },
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

  mostrar() {
    this.route.navigate(['admin/entrada-estoque/novo']);
  }
  update(user) {
    let id = user.key;
    this.route.navigate([`admin/entrada-estoque/${id}`]);
  }

  delete(user) {
    this.confirmationService.confirm({
      message: 'Você deseja excluir este registro?',
      accept: () => {
        this.loading = true;
        let id = user.key;
        this.db.collection('pedido_de_compra').doc(id).delete().then(() => {
          this.toast.errorToastr('Pedido de compra excluído...', 'Aviso!');
          this.loading = false;
        }).catch((err) => {
          console.log(err);
          this.loading = false;
          this.toast.errorToastr('Desculpe, houve um erro na operação solicitada.', 'Aviso!');
        })
      }
    })
  }


}
