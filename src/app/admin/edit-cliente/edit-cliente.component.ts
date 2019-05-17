import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Clientes } from 'src/app/models/clientes.model';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.css']
})
export class EditClienteComponent implements OnInit {
  public loading = false;
  clientes: any = [];
  en: any;
  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    public toast: ToastrManager,
    private router: Router,
  ) { }

  ngOnInit() {
    $(document).ready(() => {
      const trees: any = $('[data-widget="tree"]');
      if (trees) {
        trees.tree();
      }

    });
    this.en = {
      firstDayOfWeek: 0,
      dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
      monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
        'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      today: 'Hoje',
      clear: 'Limpar',
    };

    let id = this.route.snapshot.paramMap.get('key');
    this.db.collection('clientes/').doc(`${id}`).valueChanges()
      .subscribe(data => {
        this.clientes = data
      })

  }

  submited(clientes: Clientes){
    this.loading = true;
    this.db.doc(`clientes/${clientes.key}`).update(clientes)
      .then(() => {
        this.loading = false;
        this.toast.successToastr('Dados atualizados com sucesso.', 'Parabéns!');
        this.router.navigate(['admin/clientes']);
      }).catch((err) => {
        this.loading = false;
        console.log(err);
        this.toast.errorToastr('Desculpe, houve um erro na operação solicitada.', 'Aviso!');
      })
  }

}
