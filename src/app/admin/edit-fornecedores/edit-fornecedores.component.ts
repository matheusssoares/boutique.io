import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Fornecedores } from 'src/app/models/fornecedores.model';

@Component({
  selector: 'app-edit-fornecedores',
  templateUrl: './edit-fornecedores.component.html',
  styleUrls: ['./edit-fornecedores.component.css']
})
export class EditFornecedoresComponent implements OnInit {
  public loading = false;
  fornecedor: any = [];
  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    public toast: ToastrManager,
    private router: Router,
  ) {
    let id = this.route.snapshot.paramMap.get('key');
    this.db.collection('fornecedores/').doc(`${id}`).valueChanges()
      .subscribe(data => {
        this.fornecedor = data
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
  submited(fornecedor: Fornecedores){
    this.loading = true;
    this.db.doc(`fornecedores/${fornecedor.key}`).update(fornecedor)
      .then(() => {
        this.loading = false;
        this.toast.successToastr('Dados atualizados com sucesso.', 'Parabéns!');
        this.router.navigate(['admin/fornecedores']);
      }).catch((err) => {
        this.loading = false;
        console.log(err);
        this.toast.errorToastr('Desculpe, houve um erro na operação solicitada.', 'Aviso!');
      })
  }

}
