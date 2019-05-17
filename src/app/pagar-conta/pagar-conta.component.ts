import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ContasAPagar } from '../models/contasAPagar.model';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-pagar-conta',
  templateUrl: './pagar-conta.component.html',
  styleUrls: ['./pagar-conta.component.css'],
  providers: [ConfirmationService]
})
export class PagarContaComponent implements OnInit {
  contas: any = {};
  teste: any = {};
  hist: any = {};
  en: any;
  public loading: boolean = false;
  constructor(private confirmationService: ConfirmationService, private db: AngularFirestore, private route: ActivatedRoute, public toast: ToastrManager, private router: Router, ) {
    let id = this.route.snapshot.paramMap.get('key');
    this.db.collection('contas_pagar').doc(id).valueChanges().subscribe((data) => {
      this.contas = data;
      this.contas.vencimento = this.contas.vencimento.toDate();
      this.contas.data_pagamento = moment().toDate();
      this.contas.total_pago = 0;
      this.contas.forma_de_pagamento = 'DINHEIRO';
      this.contas.conta_corrente = 'Conta Padrão';
      this.db.collection('contas_pagar', ref => ref.where('paga', '==', true).where('beneficiario', '==', this.contas.beneficiario).orderBy('vencimento', 'asc'))
      .valueChanges().subscribe(data2 => {
        console.log(data2);
        this.hist = data2;
      })
    })
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

  atualizar(contas: ContasAPagar) {
    this.loading = true;
    contas.vencimento = moment(contas.vencimento).toDate();
    this.db.collection('contas_pagar').doc(contas.key).update(contas).then(() => {
      this.toast.successToastr('Conta atualizada com sucesso!', 'Parabéns!');
      this.loading = false;
    }).catch((err) => {
      console.log(err);
      this.toast.errorToastr('Não foi possível concluir a operação!', 'Desculpe!');
      this.loading = false;
    })
  }
  /*
    se o valor pago for menor que o total {
      alertar o usuário que o valor é menor
      se ele confirmar o pagamento do valor menor {
        resto = conta.total_pago;
        registrar na tabela de pagamentos
      } senão aceitar {
        cancela
      }
    } senão {
      marcar como paga = true;
      registrar na tabela de pagamentos
    }
      pagamentos/key_contas_pagar/key_pagamentos
  
    */
  pagar(contas: ContasAPagar) {
    if (contas.total_pago < contas.total) {
      this.confirmationService.confirm({
        message: 'Você não pode pagar um valor menor que o valor do débito.',
        accept: () => {
          //Actual logic to perform a confirmation
          /* this.loading = true;
          contas.resto = contas.total_pago;
          contas.processoupg = moment().toDate();
          this.db.collection('contas_pagar').doc(contas.key).update(contas).then(() => {
            let keypg = this.db.createId();
            this.db.collection('pagamentos').doc(contas.key).collection(keypg).add(contas).then(() => {
              this.toast.successToastr('Valores atualizados com sucesso!', 'Parabéns!');
              this.router.navigate([`admin/financeiro/contas-a-pagar`]);
            }).catch((err) => {
              console.log(err);
              this.toast.errorToastr('Não foi possível concluir a operação.', 'Desculpe!');
            }).catch((err) => {
              console.log('erro update: ', err);
            })
          })
          this.loading = false; */

        }
      });
    } else {
      this.loading = true;
      contas.paga = true;
      contas.troco = contas.total_pago - contas.total;
      contas.processoupg = moment().toDate();

      this.db.collection('contas_pagar').doc(contas.key).update(contas).then(() => {
        this.db.collection('pagamentos').doc(contas.key).set(contas).then(() => {
          this.toast.successToastr('Conta paga com sucesso!', 'Parabéns!');
          this.router.navigate([`admin/financeiro/contas-pagas`]);
        }).catch((err) => {
          console.log(err);
          this.toast.errorToastr('Não foi possível concluir a operação.', 'Desculpe!');
        })
      }).catch((err) => {
        console.log('erro update: ', err);
      })
      this.loading = false;
    }
  }
}
