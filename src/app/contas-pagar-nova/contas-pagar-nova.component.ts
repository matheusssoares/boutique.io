import { Component, OnInit } from '@angular/core';
import { ContasAPagar } from '../models/contasAPagar.model';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { ConfirmationService } from 'primeng/api';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contas-pagar-nova',
  templateUrl: './contas-pagar-nova.component.html',
  styleUrls: ['./contas-pagar-nova.component.css'],
  providers: [ConfirmationService]
})
export class ContasPagarNovaComponent implements OnInit {
  data: any = {};
  salvar: boolean = true;
  meuarray: any[] = [];
  results: any[] = [];
  teste: any = {};
  public loading: boolean = false;
  public isGerada: boolean = false;
  contas: ContasAPagar = {
    classificacao: '',
    beneficiario: '',
    observacao: '',
    vencimento: '',
    recorrente: false,
    num_parcelas: 1,
    juros: 0,
    descontos: 0

  }
  en: any;
  constructor(
    public toast: ToastrManager,
    private confirmationService: ConfirmationService,
    private db: AngularFirestore,
    private auth: AngularFireAuth,
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
  }
  select(e) {
    this.salvar = false;

  }
  gerar_parcelas(contas: ContasAPagar) {
    this.loading = true;
    this.salvar = true;
    if (contas.classificacao == '') {
      this.toast.warningToastr('Você precisa preencher a classificação', 'Aviso!');
      this.loading = false;
    } else {
      if (contas.beneficiario == '') {
        this.toast.warningToastr('Você precisa preencher o Beneficiário', 'Aviso!');
        this.loading = false;
      } else {
        if (contas.vencimento == '') {
          this.toast.warningToastr('Você precisa preencher a data de vencimento', 'Aviso!');
          this.loading = false;
        } else {
          if (!contas.total) {
            this.toast.warningToastr('Você precisa preencher o valor do documento', 'Aviso!');
            this.loading = false;
          } else {
            if (contas.recorrente) {
              this.isGerada = true;
              if (contas.num_parcelas != 1) {
                this.criar_parcelas(contas);
              } else {
                console.log('Apenas uma parcela.');

              }

            }
          }
        }
      }
    }

  }
  debugg(contas: ContasAPagar) {
    this.loading = true;
    if (contas.classificacao == '') {
      this.toast.warningToastr('Você precisa preencher a classificação', 'Aviso!');
      this.loading = false;
    } else {
      if (contas.beneficiario == '') {
        this.toast.warningToastr('Você precisa preencher o Beneficiário', 'Aviso!');
        this.loading = false;
      } else {
        if (contas.vencimento == '') {
          this.toast.warningToastr('Você precisa preencher a data de vencimento', 'Aviso!');
          this.loading = false;
        } else {
          if (!contas.total) {
            this.toast.warningToastr('Você precisa preencher o valor do documento', 'Aviso!');
            this.loading = false;
          } else {
            if (this.results.length) {
              console.log('fazer foreach');
              var id = this.auth.auth.currentUser.uid;
              this.db.collection('users').doc(id).valueChanges().subscribe(a => {
                this.data = a;
                this.results.forEach(data => {
                  this.teste = data;
                  contas.key = this.db.createId();
                  if (this.teste.obs != undefined) {
                    contas.observacao = this.teste.obs;
                  } else {
                    contas.observacao = "";
                  }
                  contas.num_parcelas = this.results.length;
                  contas.vencimento = this.teste.data_vencimento;
                  contas.total = this.teste.total;
                  contas.resto = 0;
                  contas.data_emissao = moment().format('LLL');
                  contas.criado_por = this.data.name;
                  contas.paga = false;
                  this.db.collection('contas_pagar').doc(contas.key).set(contas).finally(() => {
                    console.log('incluida com sucesso!');

                  })
                })

                this.loading = false;
                this.toast.successToastr('Conta incluída com sucesso!', 'Parabéns!');
                this.router.navigate(['admin/financeiro/contas-a-pagar']);
              })
            } else {
              console.log('conta única');
              var id = this.auth.auth.currentUser.uid;
              this.db.collection('users/').doc(id).valueChanges().subscribe(b => {
                this.data = b;
                contas.key = this.db.createId();
                contas.resto = 0;
                contas.data_emissao = moment().format('LLL');
                contas.criado_por = this.data.name;
                contas.paga = false;
                
                this.db.collection('contas_pagar').doc(contas.key).set(contas).then(() => {
                  console.log('incluida com sucesso!');
                  this.loading = false;
                  this.toast.successToastr('Conta incluída com sucesso!', 'Parabéns!');
                  this.router.navigate(['admin/financeiro/contas-a-pagar']);
                }).catch((err) => console.log(err)
                )

              })
            }

          }
        }
      }
    }
  }
  remove(item) {
    if (item == this.results[0]) {
      this.confirmationService.confirm({
        message: 'Você deseja excluir a primeira fatura? <b>Lembre-se</b>, se houver mais faturas também serão excluídas.',
        accept: () => {
          this.results = [];
          this.contas.recorrente = false;
          this.isGerada = false;
        }
      });

    } else {
      this.results.splice(this.results.indexOf(item), 1);
      if (this.results.length == 0) {
        this.isGerada = false;
      }
      if (this.results.length == 1) {
        this.results = [];
        this.contas.num_parcelas = 1;
        this.contas.recorrente = false;
        this.isGerada = false;
      }

    }

  }
  criar_parcelas(contas: ContasAPagar) {
    if (contas.num_parcelas == 2) {
      var array = [];
      array['data_vencimento'] = moment(contas.vencimento).toDate();
      array['obs'] = contas.observacao;
      array['total'] = contas.total;
      this.results.push(array);

      var array2 = [];
      array2['data_vencimento'] = moment(contas.vencimento).add(1, 'months').toDate();
      array2['total'] = contas.total;
      this.results.push(array2);
      this.loading = false;
    }
    if (contas.num_parcelas == 3) {
      var array = [];
      array['data_vencimento'] = moment(contas.vencimento).toDate();
      array['obs'] = contas.observacao;
      array['total'] = contas.total;
      this.results.push(array);

      var array2 = [];
      array2['data_vencimento'] = moment(contas.vencimento).add(1, 'months').toDate();
      array2['total'] = contas.total;
      this.results.push(array2);

      var array3 = [];
      array3['data_vencimento'] = moment(contas.vencimento).add(2, 'months').toDate();
      array3['total'] = contas.total;
      this.results.push(array3);

      this.loading = false;

    }
    if (contas.num_parcelas == 4) {
      var array = [];
      array['data_vencimento'] = moment(contas.vencimento).toDate();
      array['obs'] = contas.observacao;
      array['total'] = contas.total;
      this.results.push(array);

      var array2 = [];
      array2['data_vencimento'] = moment(contas.vencimento).add(1, 'months').toDate();
      array2['total'] = contas.total;
      this.results.push(array2);

      var array3 = [];
      array3['data_vencimento'] = moment(contas.vencimento).add(2, 'months').toDate();
      array3['total'] = contas.total;
      this.results.push(array3);

      var array4 = [];
      array4['data_vencimento'] = moment(contas.vencimento).add(3, 'months').toDate();
      array4['total'] = contas.total;
      this.results.push(array4);

      this.loading = false;

    }

    if (contas.num_parcelas == 5) {
      var array = [];
      array['data_vencimento'] = moment(contas.vencimento).toDate();
      array['obs'] = contas.observacao;
      array['total'] = contas.total;
      this.results.push(array);

      var array2 = [];
      array2['data_vencimento'] = moment(contas.vencimento).add(1, 'months').toDate();
      array2['total'] = contas.total;
      this.results.push(array2);

      var array3 = [];
      array3['data_vencimento'] = moment(contas.vencimento).add(2, 'months').toDate();
      array3['total'] = contas.total;
      this.results.push(array3);

      var array4 = [];
      array4['data_vencimento'] = moment(contas.vencimento).add(3, 'months').toDate();
      array4['total'] = contas.total;
      this.results.push(array4);

      var array5 = [];
      array5['data_vencimento'] = moment(contas.vencimento).add(4, 'months').toDate();
      array5['total'] = contas.total;
      this.results.push(array5);

      this.loading = false;

    }
    if (contas.num_parcelas == 6) {
      var array = [];
      array['data_vencimento'] = moment(contas.vencimento).toDate();
      array['obs'] = contas.observacao;
      array['total'] = contas.total;
      this.results.push(array);

      var array2 = [];
      array2['data_vencimento'] = moment(contas.vencimento).add(1, 'months').toDate();
      array2['total'] = contas.total;
      this.results.push(array2);

      var array3 = [];
      array3['data_vencimento'] = moment(contas.vencimento).add(2, 'months').toDate();
      array3['total'] = contas.total;
      this.results.push(array3);

      var array4 = [];
      array4['data_vencimento'] = moment(contas.vencimento).add(3, 'months').toDate();
      array4['total'] = contas.total;
      this.results.push(array4);

      var array5 = [];
      array5['data_vencimento'] = moment(contas.vencimento).add(4, 'months').toDate();
      array5['total'] = contas.total;
      this.results.push(array5);

      var array6 = [];
      array6['data_vencimento'] = moment(contas.vencimento).add(5, 'months').toDate();
      array6['total'] = contas.total;
      this.results.push(array6);

      this.loading = false;

    }

    if (contas.num_parcelas == 7) {
      var array = [];
      array['data_vencimento'] = moment(contas.vencimento).toDate();
      array['obs'] = contas.observacao;
      array['total'] = contas.total;
      this.results.push(array);

      var array2 = [];
      array2['data_vencimento'] = moment(contas.vencimento).add(1, 'months').toDate();
      array2['total'] = contas.total;
      this.results.push(array2);

      var array3 = [];
      array3['data_vencimento'] = moment(contas.vencimento).add(2, 'months').toDate();
      array3['total'] = contas.total;
      this.results.push(array3);

      var array4 = [];
      array4['data_vencimento'] = moment(contas.vencimento).add(3, 'months').toDate();
      array4['total'] = contas.total;
      this.results.push(array4);

      var array5 = [];
      array5['data_vencimento'] = moment(contas.vencimento).add(4, 'months').toDate();
      array5['total'] = contas.total;
      this.results.push(array5);

      var array6 = [];
      array6['data_vencimento'] = moment(contas.vencimento).add(5, 'months').toDate();
      array6['total'] = contas.total;
      this.results.push(array6);

      var array7 = [];
      array7['data_vencimento'] = moment(contas.vencimento).add(6, 'months').toDate();
      array7['total'] = contas.total;
      this.results.push(array7);

      this.loading = false;

    }
    if (contas.num_parcelas == 8) {
      var array = [];
      array['data_vencimento'] = moment(contas.vencimento).toDate();
      array['obs'] = contas.observacao;
      array['total'] = contas.total;
      this.results.push(array);

      var array2 = [];
      array2['data_vencimento'] = moment(contas.vencimento).add(1, 'months').toDate();
      array2['total'] = contas.total;
      this.results.push(array2);

      var array3 = [];
      array3['data_vencimento'] = moment(contas.vencimento).add(2, 'months').toDate();
      array3['total'] = contas.total;
      this.results.push(array3);

      var array4 = [];
      array4['data_vencimento'] = moment(contas.vencimento).add(3, 'months').toDate();
      array4['total'] = contas.total;
      this.results.push(array4);

      var array5 = [];
      array5['data_vencimento'] = moment(contas.vencimento).add(4, 'months').toDate();
      array5['total'] = contas.total;
      this.results.push(array5);

      var array6 = [];
      array6['data_vencimento'] = moment(contas.vencimento).add(5, 'months').toDate();
      array6['total'] = contas.total;
      this.results.push(array6);

      var array7 = [];
      array7['data_vencimento'] = moment(contas.vencimento).add(6, 'months').toDate();
      array7['total'] = contas.total;
      this.results.push(array7);

      var array8 = [];
      array8['data_vencimento'] = moment(contas.vencimento).add(7, 'months').toDate();
      array8['total'] = contas.total;
      this.results.push(array8);

      this.loading = false;

    }
    if (contas.num_parcelas == 9) {
      var array = [];
      array['data_vencimento'] = moment(contas.vencimento).toDate();
      array['obs'] = contas.observacao;
      array['total'] = contas.total;
      this.results.push(array);

      var array2 = [];
      array2['data_vencimento'] = moment(contas.vencimento).add(1, 'months').toDate();
      array2['total'] = contas.total;
      this.results.push(array2);

      var array3 = [];
      array3['data_vencimento'] = moment(contas.vencimento).add(2, 'months').toDate();
      array3['total'] = contas.total;
      this.results.push(array3);

      var array4 = [];
      array4['data_vencimento'] = moment(contas.vencimento).add(3, 'months').toDate();
      array4['total'] = contas.total;
      this.results.push(array4);

      var array5 = [];
      array5['data_vencimento'] = moment(contas.vencimento).add(4, 'months').toDate();
      array5['total'] = contas.total;
      this.results.push(array5);

      var array6 = [];
      array6['data_vencimento'] = moment(contas.vencimento).add(5, 'months').toDate();
      array6['total'] = contas.total;
      this.results.push(array6);

      var array7 = [];
      array7['data_vencimento'] = moment(contas.vencimento).add(6, 'months').toDate();
      array7['total'] = contas.total;
      this.results.push(array7);

      var array8 = [];
      array8['data_vencimento'] = moment(contas.vencimento).add(7, 'months').toDate();
      array8['total'] = contas.total;
      this.results.push(array8);

      var array9 = [];
      array9['data_vencimento'] = moment(contas.vencimento).add(8, 'months').toDate();
      array9['total'] = contas.total;
      this.results.push(array9);

      this.loading = false;

    }
    if (contas.num_parcelas == 10) {
      var array = [];
      array['data_vencimento'] = moment(contas.vencimento).toDate();
      array['obs'] = contas.observacao;
      array['total'] = contas.total;
      this.results.push(array);

      var array2 = [];
      array2['data_vencimento'] = moment(contas.vencimento).add(1, 'months').toDate();
      array2['total'] = contas.total;
      this.results.push(array2);

      var array3 = [];
      array3['data_vencimento'] = moment(contas.vencimento).add(2, 'months').toDate();
      array3['total'] = contas.total;
      this.results.push(array3);

      var array4 = [];
      array4['data_vencimento'] = moment(contas.vencimento).add(3, 'months').toDate();
      array4['total'] = contas.total;
      this.results.push(array4);

      var array5 = [];
      array5['data_vencimento'] = moment(contas.vencimento).add(4, 'months').toDate();
      array5['total'] = contas.total;
      this.results.push(array5);

      var array6 = [];
      array6['data_vencimento'] = moment(contas.vencimento).add(5, 'months').toDate();
      array6['total'] = contas.total;
      this.results.push(array6);

      var array7 = [];
      array7['data_vencimento'] = moment(contas.vencimento).add(6, 'months').toDate();
      array7['total'] = contas.total;
      this.results.push(array7);

      var array8 = [];
      array8['data_vencimento'] = moment(contas.vencimento).add(7, 'months').toDate();
      array8['total'] = contas.total;
      this.results.push(array8);

      var array9 = [];
      array9['data_vencimento'] = moment(contas.vencimento).add(8, 'months').toDate();
      array9['total'] = contas.total;
      this.results.push(array9);

      var array10 = [];
      array10['data_vencimento'] = moment(contas.vencimento).add(9, 'months').toDate();
      array10['total'] = contas.total;
      this.results.push(array10);

      this.loading = false;

    }
    if (contas.num_parcelas == 11) {
      var array = [];
      array['data_vencimento'] = moment(contas.vencimento).toDate();
      array['obs'] = contas.observacao;
      array['total'] = contas.total;
      this.results.push(array);

      var array2 = [];
      array2['data_vencimento'] = moment(contas.vencimento).add(1, 'months').toDate();
      array2['total'] = contas.total;
      this.results.push(array2);

      var array3 = [];
      array3['data_vencimento'] = moment(contas.vencimento).add(2, 'months').toDate();
      array3['total'] = contas.total;
      this.results.push(array3);

      var array4 = [];
      array4['data_vencimento'] = moment(contas.vencimento).add(3, 'months').toDate();
      array4['total'] = contas.total;
      this.results.push(array4);

      var array5 = [];
      array5['data_vencimento'] = moment(contas.vencimento).add(4, 'months').toDate();
      array5['total'] = contas.total;
      this.results.push(array5);

      var array6 = [];
      array6['data_vencimento'] = moment(contas.vencimento).add(5, 'months').toDate();
      array6['total'] = contas.total;
      this.results.push(array6);

      var array7 = [];
      array7['data_vencimento'] = moment(contas.vencimento).add(6, 'months').toDate();
      array7['total'] = contas.total;
      this.results.push(array7);

      var array8 = [];
      array8['data_vencimento'] = moment(contas.vencimento).add(7, 'months').toDate();
      array8['total'] = contas.total;
      this.results.push(array8);

      var array9 = [];
      array9['data_vencimento'] = moment(contas.vencimento).add(8, 'months').toDate();
      array9['total'] = contas.total;
      this.results.push(array9);

      var array10 = [];
      array10['data_vencimento'] = moment(contas.vencimento).add(9, 'months').toDate();
      array10['total'] = contas.total;
      this.results.push(array10);

      var array11 = [];
      array11['data_vencimento'] = moment(contas.vencimento).add(10, 'months').toDate();
      array11['total'] = contas.total;
      this.results.push(array11);

      this.loading = false;

    }
    if (contas.num_parcelas == 12) {
      var array = [];
      array['data_vencimento'] = moment(contas.vencimento).toDate();
      array['obs'] = contas.observacao;
      array['total'] = contas.total;
      this.results.push(array);

      var array2 = [];
      array2['data_vencimento'] = moment(contas.vencimento).add(1, 'months').toDate();
      array2['total'] = contas.total;
      this.results.push(array2);

      var array3 = [];
      array3['data_vencimento'] = moment(contas.vencimento).add(2, 'months').toDate();
      array3['total'] = contas.total;
      this.results.push(array3);

      var array4 = [];
      array4['data_vencimento'] = moment(contas.vencimento).add(3, 'months').toDate();
      array4['total'] = contas.total;
      this.results.push(array4);

      var array5 = [];
      array5['data_vencimento'] = moment(contas.vencimento).add(4, 'months').toDate();
      array5['total'] = contas.total;
      this.results.push(array5);

      var array6 = [];
      array6['data_vencimento'] = moment(contas.vencimento).add(5, 'months').toDate();
      array6['total'] = contas.total;
      this.results.push(array6);

      var array7 = [];
      array7['data_vencimento'] = moment(contas.vencimento).add(6, 'months').toDate();
      array7['total'] = contas.total;
      this.results.push(array7);

      var array8 = [];
      array8['data_vencimento'] = moment(contas.vencimento).add(7, 'months').toDate();
      array8['total'] = contas.total;
      this.results.push(array8);

      var array9 = [];
      array9['data_vencimento'] = moment(contas.vencimento).add(8, 'months').toDate();
      array9['total'] = contas.total;
      this.results.push(array9);

      var array10 = [];
      array10['data_vencimento'] = moment(contas.vencimento).add(9, 'months').toDate();
      array10['total'] = contas.total;
      this.results.push(array10);

      var array11 = [];
      array11['data_vencimento'] = moment(contas.vencimento).add(10, 'months').toDate();
      array11['total'] = contas.total;
      this.results.push(array11);

      var array12 = [];
      array12['data_vencimento'] = moment(contas.vencimento).add(11, 'months').toDate();
      array12['total'] = contas.total;
      this.results.push(array12);

      this.loading = false;

    }
  }



}
