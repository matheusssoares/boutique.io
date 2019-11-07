import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ConfirmationService } from 'primeng/api';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { DialogService } from 'primeng/api';
import { Produtos } from '../models/produtos.model';
import { MyPedidoCompra } from '../models/mypedidocompra.class';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pdv',
  templateUrl: './pdv.component.html',
  styleUrls: ['./pdv.component.css'],
  providers: [ConfirmationService, DialogService]
})
export class PdvComponent implements OnInit {
  total: number = 0;
  vendas_fin: any = {
    desc_din: '',
    desc_por: 0,
    acresc_din: '',
    acresc_por: 0,
    forma_pg: 'Dinheiro à Vista',
    qtde_parc: 1,
    descontos: 0,
    pagamentos: 0,
    troco: 0,
    valor_final: this.total,
    total_pago: 0,
    entrada: 'SIM',
    valor_entrada: 0
  };
  listUsers2: any[];
  cols2: any[];
  loading: boolean = false;
  pes: string = '';
  pes2: string = '';
  listUsers: any[];
  cols: any[];
  display: boolean = true;
  display2: boolean = false;
  ret: any;
  caixa: any;
  users: any = [];
  resultado: any[] = [];
  dados: any = {};
  pdv: any = {
    caixa: '',
    data_abertura: moment().format('lll'),
    valor_abertura: '',
    valor_caixa: 0,
    obs: ''
  }

  produto: Produtos = {
    barcode: '',
    nome: '',
    qtde: 1,
    categoria: '',
    status: true
  };
  produtos: MyPedidoCompra[] = [];
  itensProdutos: any = [];
  vendas: any = {
    qtde: 1,
    produto: ''
  }
  cliente: string = 'Cliente Padrão';
  qtde: number = 1;
  retorno_nome: string[];
  search: any;
  form_pg: boolean = false;
  constructor(
    public toast: ToastrManager,
    private confirmationService: ConfirmationService,
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router,
    private location: Location,
  ) {
    this.db.collection('caixas').valueChanges().subscribe(data => {
      this.caixa = data;

    });

    this.db.collection('produtos').valueChanges().subscribe(data2 => {
      this.resultado = data2;
      this.listUsers = this.resultado;

    })
  }

  ngOnInit() {
    //this.display = true;
    this.cols = [
      { field: 'barcode', header: 'Código', width: '13%' },
      { field: 'nome', header: 'Nome', width: '30%' },
      { field: 'categoria', header: 'Categoria', width: '20%' },
      { field: 'qtde_atual', header: 'Qtde', width: '7%' },
      { field: 'vista', header: 'A Vista', width: '15%' },
      { field: 'prazo', header: 'A Prazo', width: '15%' },
    ];

    this.db.collection("clientes", ref => ref.orderBy('nome', 'asc')).valueChanges().subscribe(data => {
      this.listUsers2 = data;
    })

    this.cols2 = [
      { field: 'nome', header: 'Nome', width: '30%' },
      { field: 'email', header: 'Email', width: '30%' },
      { field: 'cpf', header: 'CPF', width: '15%' },
      { field: 'limite_fiado', header: 'Lim. Déb.', width: '10%' },
    ];
  }

  fechar() {
    this.location.back()
  }

  alterou(e) {
    this.db.collection('caixas/').doc(e).valueChanges().subscribe((data) => {
      this.ret = data;
      if (this.ret.status == true) {
        console.log('é true');
      } else {
        this.db.collection('users/').doc(this.auth.auth.currentUser.uid).valueChanges()
          .subscribe(data => {
            this.users = data;
            this.pdv.operador = this.users.name;
          })
        this.display = false;
        this.display2 = true;
        this.pdv.caixa = this.ret.nome;
      }
    })
  }

  abrir(pdv) {
    this.db.collection('caixas', ref => ref.where('nome', '==', pdv.caixa)).valueChanges().subscribe(data => {
      data.forEach(dat => {
        this.ret = dat;
      })
    })
    var id = this.db.createId();
    this.db.collection('movimentacao_caixa').doc(this.ret.key).collection(id).doc(id).set(pdv).then(() => {
      this.db.collection('caixas').doc(this.ret.key).update({ status: true }).then(z => {
        this.toast.successToastr('Caixa aberto!', 'Parabéns!');
      })
    }).catch((err) => {
      console.log(err);
      this.toast.successToastr('Desculpe, houve um problema ao abrir o caixa!', 'Aviso!');
    })

  }


  pesquisar(event) {
    if (event.target.value.length >= 3) {
      var nome: string = event.target.value;
      var st: string = nome.toLowerCase();
      var fi: string = st.toUpperCase();
      this.search = this.resultado.find(x => x.nome == fi);

      if (this.search) {
        this.loading = true;
        this.produto = this.search;
        this.qtde = 1;
        $('#codebar').prop('readonly', true);
        $('#nome').prop('readonly', true);
        $('#qtde').focus();
        this.pes = '';
        this.loading = false;
      } else {
        var code = event.target.value;
        this.search = this.resultado.find(x => x.barcode == code);
        if (this.search) {
          this.loading = true;
          this.produto = this.search;
          this.qtde = 1;
          $('#codebar').prop('readonly', true);
          $('#nome').prop('readonly', true);
          $('#qtde').focus();
          this.pes = '';
          this.loading = false;
        } else {
          this.carregarPesquisas(event.target.value);
        }
      }
    } else {
      console.log('menor que 3, não buscar')
    }
  }

  carregarPesquisas(query) {
    this.pes2 = query;
    document.getElementById("openModalButton").click();
  }

  select(prod) {
    this.loading = true;
    this.produto = prod;
    this.qtde = 1;
    $('#codebar').prop('readonly', true);
    $('#nome').prop('readonly', true);
    $('#qtde').focus();
    this.pes = '';
    this.loading = false;

  }

  select_cliente() {
    document.getElementById("openModalButton2").click();
  }

  add_cart(produto2, qtde) {
    if (produto2.barcode != "") {
      console.log(produto2);
      if (qtde > produto2.qtde_atual) {
        console.log('Quantidade não disponível em estoque');
        Swal.fire({
          title: 'Atenção!',
          width: 500,
          html: "<p style='font-size: 15px;'> Quantidade não disponível em estoque, estoque atual tem somente: <b>" + produto2.qtde_atual + "</b></p>",
          type: 'warning',
          confirmButtonText: 'OK'
        })
        this.qtde = produto2.qtde_atual;
      } else {
        if (this.produtos.length == 0) {
          this.itensProdutos = produto2;
          this.itensProdutos.qtde = qtde;
          this.produtos.push(new MyPedidoCompra(this.itensProdutos));

          this.itensProdutos = [];
          this.produto = {
            barcode: '',
            nome: '',
            categoria: '',
            status: true
          };
          this.qtde = 1;
          $('#codebar').prop('readonly', false);
          $('#nome').prop('readonly', false);
          $('#pesq_nb').focus();
        } else {
          let found = this.produtos.find((ret) => ret.item['key'] === produto2.key);
          if (found) {
            var ver = found.item['qtde'] + qtde;
            if (ver > produto2.qtde_atual) {
              Swal.fire({
                title: 'Atenção!',
                width: 500,
                html: "<p style='font-size: 15px;'> Quantidade não disponível em estoque, estoque atual tem somente: <b>" + produto2.qtde_atual + "</b></p>",
                type: 'warning',
                confirmButtonText: 'OK'
              }).then(() => {
                this.itensProdutos = [];
                this.produto = {
                  barcode: '',
                  nome: '',
                  categoria: '',
                  status: true
                };
                this.qtde = 1;
                $('#codebar').prop('readonly', false);
                $('#nome').prop('readonly', false);
                $('#pesq_nb').focus();
              });
            } else {
              found.item['qtde'] = found.item['qtde'] + qtde;
              this.itensProdutos = [];
              this.produto = {
                barcode: '',
                nome: '',
                categoria: '',
                status: true
              };
              this.qtde = 1;
              $('#codebar').prop('readonly', false);
              $('#nome').prop('readonly', false);
              $('#pesq_nb').focus();
            }
          } else {
            this.itensProdutos = produto2;
            this.itensProdutos.qtde = qtde;
            this.produtos.push(new MyPedidoCompra(this.itensProdutos));

            this.itensProdutos = [];
            this.produto = {
              barcode: '',
              nome: '',
              categoria: '',
              status: true
            };
            this.qtde = 1;
            $('#codebar').prop('readonly', false);
            $('#nome').prop('readonly', false);
            $('#pesq_nb').focus();
          }
        }
      }

      this.getTotal();
    } else {
      Swal.fire({
        title: 'Atenção!',
        html: "<p style='font-size: 15px;'> Nenhum produto adicionado.</p>",
        type: 'warning',
        confirmButtonText: 'OK'
      })
    }


  }

  select_cliente2(user2) {
    this.cliente = user2.nome;

  }

  getTotal() {
    var soma = 0;
    this.produtos.forEach(ret => {
      this.dados = ret;
      soma += this.dados.item.prazo * this.dados.item.qtde;
    })
    this.total = soma;
  }

  del(item: MyPedidoCompra) {
    this.produtos.splice(this.produtos.indexOf(item), 1);
    this.getTotal();

  }

  cancelar() {
    this.produtos = [];
    this.getTotal();
    this.itensProdutos = [];
    this.produto = {
      barcode: '',
      nome: '',
      categoria: '',
      status: true
    };
    this.qtde = 1;
    $('#codebar').prop('readonly', false);
    $('#nome').prop('readonly', false);
    $('#pesq_nb').focus();
  }

  finalizar() {
    this.vendas_fin.valor_final = this.total;
    document.getElementById("openModalButton3").click();
  }

  app_desc(vendas) {
    //console.log(vendas);
    var porcentagem = vendas.desc_por;
    var desc = this.total * (porcentagem / 100);
    var desc_f = vendas.desc_din + desc;
    this.vendas_fin.valor_final = desc_f;
    console.log('valor final do desconto: ', desc_f);

  }

  app_desc_din(value) {
    var acrescimo = this.vendas_fin.acresc_din;
    this.vendas_fin.valor_final = this.total + acrescimo - value;
  }

  app_acresc_din(value) {
    var desconto = this.vendas_fin.desc_din;
    this.vendas_fin.valor_final = this.total - desconto + value;
  }

  alter_fp(value) {
    //console.log('aletrou forma: ', value);
    if (value == 'Dinheiro à Vista') {
      this.form_pg = false;
    } else {
      this.form_pg = true;
    }

  }

  entrada_fp(value) {
    if (value == 'NÃO') {
      $('#entrada_value').prop('readonly', true);
      $('#entrada_value').val('R$ 0,00');
    } else {
      $('#entrada_value').prop('readonly', false);
      $('#entrada_value').val('R$ 0,00');
    }

  }

  finalizar_pedido() {
    if (this.vendas_fin.forma_pg == 'Dinheiro à Vista') {
      this.vender_by_dinheiro();
    }
  }

  vender_by_dinheiro() {
    if (this.vendas_fin.total_pago < this.vendas_fin.valor_final) {
      Swal.fire({
        title: 'Atenção!',
        html: "<b style='font-size: 15px;'> Impossível receber valor menor que o TOTAL do pedido.</b>",
        type: 'warning',
        confirmButtonText: 'OK'
      })
    } else {
      console.log('finalizar venda');
      if(this.vendas_fin.total_pago == this.vendas_fin.valor_final){
        document.getElementById("openModalButton4").click();
      } else {
        document.getElementById("openModalButton5").click();
      }
    }
  }

  print() {

  }

}
