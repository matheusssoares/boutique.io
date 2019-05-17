import { Component, OnInit } from '@angular/core';
import { Clientes } from 'src/app/models/clientes.model';
import { AngularFirestore } from '@angular/fire/firestore';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  providers: [ConfirmationService]
})
export class ClientesComponent implements OnInit {
  public loading = false;
  en: any;
  public deb: number;
  limite: any = {};
  limite_fiado: number = 0;
  clientes: Clientes = {
    nome: '',
    email: '',
    cpf: '',
    sexo: '',
    contato: '',
    data_nascimento: '',
    rua: '',
    cidade: 'Bujaru',
    bairro: '',
    num: '',
    data_cadastro: '',
    status: true,
  }
  display: boolean = false;
  listUsers: any[];
  cols: any[];
  constructor(
    private db: AngularFirestore,
    public toast: ToastrManager,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {
    this.db.collection("clientes", ref => ref.orderBy('nome', 'asc')).valueChanges().subscribe(data => {
      this.listUsers = data;
    })

    this.cols = [
      { field: 'nome', header: 'Nome', width: '30%' },
      { field: 'email', header: 'Email', width: '30%' },
      { field: 'contato', header: 'contato', width: '15%' },
      { field: 'cpf', header: 'CPF', width: '15%' },
      { field: 'limite_fiado', header: 'Lim. Déb.', width: '10%' },
    ];
  }

  ngOnInit() {
    var data = moment().format('LLL');
    console.log(data);

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
    let id = '5ogPSqqGRAFvIoOsbjcM';
    const docRef = this.db.doc(`config/${id}`);
    docRef.valueChanges().subscribe(data => {
      this.limite = data;
      this.deb = this.limite.debito_padrao;
    });

  }
  
  confirm() {
    this.display = true;
  }
  aceitar(limite_fiado) {
    console.log(limite_fiado);
    this.display = false;
    this.limite_fiado = limite_fiado;
  }
  submited(clientes: Clientes) {
    this.loading = true;
    if (clientes.nome == "") {
      this.loading = false;
      this.toast.warningToastr('Você precisa preencher o campo nome.', 'Aviso!');
    } else {
      if (clientes.email == "") {
        this.loading = false;
        this.toast.warningToastr('Você precisa preencher o campo email.', 'Aviso!');
      } else {
        if (clientes.sexo == "") {
          this.loading = false;
          this.toast.warningToastr('Você precisa preencher o campo sexo.', 'Aviso!');
        } else {
          if (clientes.contato == "") {
            this.loading = false;
            this.toast.warningToastr('Você precisa preencher o campo contato.', 'Aviso!');
          } else {
            if (clientes.data_nascimento == "") {
              this.loading = false;
              this.toast.warningToastr('Você precisa preencher o campo data de nascimento.', 'Aviso!');
            } else {
              if (clientes.rua == "") {
                this.loading = false;
                this.toast.warningToastr('Você precisa preencher o campo endereço.', 'Aviso!');
              } else {
                if (clientes.bairro == "") {
                  this.loading = false;
                  this.toast.warningToastr('Você precisa selecionar um bairro.', 'Aviso!');
                } else {
                  if (!clientes.limite_fiado) {
                    this.loading = false;
                    this.toast.warningToastr('Você precisa selecionar um limite de débito.', 'Aviso!');
                  } else {
                    this.db.collection(`clientes/`, ref => ref.where('email', '==', clientes.email))
                      .get().subscribe(data => {
                        let a = data.docs;
                        if (a.length == 1) {
                          this.loading = false;
                          this.toast.errorToastr('Já há um(a) cliente cadastrado(a) com este email', 'Aviso!');
                        } else {
                          if (clientes.limite_fiado == 1) {
                            clientes.limite_fiado = this.deb;

                          }
                          if (clientes.limite_fiado == 2) {
                            clientes.limite_fiado = 0;
                          }
                          if (clientes.limite_fiado == 3) {
                            clientes.limite_fiado = this.limite_fiado;
                          }

                          clientes.data_cadastro = moment().format('LLL');
                          clientes.data_nascimento = moment(`${clientes.data_nascimento}`).format("DD/MM/YYYY");

                          clientes.key = this.db.createId();

                          this.db.collection('clientes/').doc(`${clientes.key}`).set(clientes)
                            .then(() => {
                              this.loading = false;
                              this.toast.successToastr('Cliente cadastrado com sucesso.', 'Parabéns!');
                              this.clientes = {
                                nome: '',
                                email: '',
                                cpf: '',
                                sexo: '',
                                rua: '',
                                cidade: 'Bujaru',
                                bairro: '',
                                num: '',
                                data_cadastro: '',
                                status: true,
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
              }
            }
          }
        }
      }
    }

  }
  reject() {
    this.display = false;
  }

  update(user: Clientes) {
    let key = user.key
    this.router.navigate([`admin/clientes/${key}`]);
  }

  delete(user: Clientes) {
    this.confirmationService.confirm({
      message: 'Você deseja excluir este registro?',
      accept: () => {
        this.loading = true;
        this.db.collection('clientes/').doc(`${user.key}`).delete().then(() => {
          this.loading = false;
          this.toast.successToastr('Cliente excluído(a) com sucesso!', 'Parabéns!');
        }).catch((err) => {
          console.log(err);
          this.loading = false;
          this.toast.errorToastr('Desculpe, houve um erro na operação solicitada.', 'Aviso!');
        })
      }
    })
  }

}
