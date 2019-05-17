import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Produtos } from 'src/app/models/produtos.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css'],
  providers: [ConfirmationService]
})
export class ProdutosComponent implements OnInit {
  public loading: boolean = false;
  listUsers: any[];
  cols: any[];
  constructor(
    private router: Router,
    private db: AngularFirestore,
    private confirmationService: ConfirmationService,
    private storage: AngularFireStorage,
    public toast: ToastrManager,
  ) {
    this.db.collection("produtos", ref => ref.orderBy('nome', 'asc')).valueChanges().subscribe(data => {
      this.listUsers = data;
    })

    this.cols = [
      { field: 'barcode', header: 'Cód Barras', width: '13%' },
      { field: 'nome', header: 'Nome', width: '30%' },
      { field: 'categoria', header: 'Categoria', width: '25%' },
      { field: 'qtde_atual', header: 'Qtde', width: '7%' },
      { field: 'vista', header: 'Preço', width: '15%' },
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
    this.router.navigate([`admin/produtos/novo`]);
  }

  update(user: Produtos) {
    let key = user.key
    this.router.navigate([`admin/produtos/${key}`]);
  }

  delete(user: Produtos) {
    this.confirmationService.confirm({
      message: 'Você deseja excluir este produto?',
      accept: () => {
        this.loading = true;
        console.log(user);

        this.storage.ref(`images/produtos/${user.key}`).delete();
        this.db.doc(`produtos/${user.key}`).delete().then(() => {
          this.loading = false;
          this.toast.successToastr('Produto excluído com sucesso!', 'Parabéns!');
        }).catch((err) => {
          console.log(err);
          this.loading = false;
          this.toast.errorToastr('Desculpe, houve um erro na operação solicitada.', 'Aviso!');
        })

      }
    });

  }


}
