import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Movimentacao } from '../models/movimentacao.model';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-mov-caixa',
  templateUrl: './mov-caixa.component.html',
  styleUrls: ['./mov-caixa.component.css'],
  providers: [ConfirmationService]
})
export class MovCaixaComponent implements OnInit {

  pg: boolean = false;
  mov: any = {
    tipo: 1,
    classificacao: 'Conta Gerencial',
    conta_corrente: 'Conta Padrão',
    valor: 0,
    forma_de_pg: 'DINHEIRO',
    obs: '',
    paga: true,
    data_pg: moment().toDate(),
    vencimento: moment().toDate()

  }
  display: boolean = false;
  display_erros: boolean = false;
  display_editar: boolean = false;
  loading: boolean = false;
  en: any;
  retorno: any;
  retorno2: any;
  listUsers: any;
  entrada: number;
  saida: number;

  constructor(
    public toast: ToastrManager,
    private confirmationService: ConfirmationService,
    private db: AngularFirestore,
    private auth: AngularFireAuth,
  ) {

    this.db.collection('movimento', ref => ref.orderBy('data_pg', 'desc')).valueChanges().subscribe(data => {
      this.listUsers = data;
    });
    this.entradas();
    this.saidas();

  }

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
  }

  entradas() {
    this.entrada = 0;
    this.db.collection('movimento', ref => ref.where('tipo', '==', 1)).valueChanges().subscribe(data1 => {
      data1.forEach(data2 => {
        this.retorno = data2;
        this.entrada += this.retorno.valor;

      })

    })
  }

  saidas() {
    this.saida = 0;
    this.db.collection('movimento', ref => ref.where('tipo', '==', 2)).valueChanges().subscribe(data2 => {
      data2.forEach(data3 => {
        this.retorno2 = data3;
        this.saida += this.retorno2.valor;
      })
    })
  }
  showModal() {
    this.display = true;
  }

  movimentar(mov: Movimentacao) {
    if (mov.valor <= 0) {
      this.display = false;
      this.display_erros = true;
    } else {
      this.loading = true;
      var id = this.auth.auth.currentUser.uid;

      this.db.collection('users').doc(id).valueChanges().subscribe(data => {
        this.retorno = data;
        mov.criado_por = this.retorno.name;
        mov.key = this.db.createId();
        this.db.collection('movimento').doc(mov.key).set(mov).then(() => {
          this.loading = false;
          this.toast.successToastr('Movimentação realizada com sucesso!', 'Parabéns!');
          this.entradas();
          this.saidas();
          this.display = false;
          this.mov = {
            tipo: 1,
            classificacao: 'Conta Gerencial',
            conta_corrente: 'Conta Padrão',
            valor: 0,
            forma_de_pg: 'DINHEIRO',
            obs: '',
            paga: true,
            data_pg: moment().toDate(),
            vencimento: moment().toDate()
          }
        }).catch(err => {
          console.log(err);
          this.loading = false;
          this.toast.errorToastr('Não foi possível concluir a operação', 'Desculpe!');
        })
      })
    }
    /* */
  }

  changed(event) {
    console.log(event.target.value);
    if (event.target.value == '1: 2') {
      this.mov.classificacao = 'Abatimentos';
      console.log('pagamento');
      this.pg = true;

    }

    if (event.target.value == '0: 1') {
      this.pg = false;
      console.log('recebimento');
      this.mov.classificacao = 'Conta Gerencial';
    }

  }

  update(mov: Movimentacao) {
    console.log(mov);
    this.mov = mov;
    this.mov.classificacao = mov.classificacao;
    this.mov.vencimento = this.mov.vencimento.toDate();
    this.display_editar = true;


  }

  atualizar(mov: Movimentacao) {
    console.log(mov);

  }

  fechar() {
    console.log('fechar');
  }

  delete(mov: Movimentacao) {
    //console.log(conta);
    this.confirmationService.confirm({
      message: 'Você deseja excluir este movimento? Lembre-se, esta ação não poderá ser desfeita.',
      accept: () => {
        this.db.collection('movimento').doc(mov.key).delete()
          .then(() => {
            this.toast.successToastr('Movimento excluído com sucesso!', 'Parabéns!');
            this.entradas();
            this.saidas();
          }).catch((err) => {
            console.log(err);
            this.toast.errorToastr('Não foi possível concluir a operação', ' Desculpe!');

          })

      }
    });
  }

}
