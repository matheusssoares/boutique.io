import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { PedidoCompra } from 'src/app/models/pedidoCompra.model';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MyPedidoCompra } from 'src/app/models/mypedidocompra.class';
import { PedidoCompraTemp } from 'src/app/models/pedidoCompraTemp.model';
import { Router } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Movimentacao } from 'src/app/models/movimentacao.model';

@Component({
  selector: 'app-pedido-compra-novo',
  templateUrl: './pedido-compra-novo.component.html',
  styleUrls: ['./pedido-compra-novo.component.css']
})
export class PedidoCompraNovoComponent implements OnInit {
  display: boolean = false;
  data3: any = {};
  public loading: boolean = false;
  pedido_temp: PedidoCompraTemp = {};
  total: number;
  public adicionar: boolean = false;
  produtoIndex: any;
  pedidoCompra: PedidoCompra = {
    solicitante: '',
    qtde: 1,
    custo: 0,
    atualizar: false,
    data_emissao: moment().format('LLL'),
    produto: ''
  }
  produtos: MyPedidoCompra[] = [];
  itensProdutos: any = [];
  itemPedido: MyPedidoCompra;
  results: any[] = [];
  dados: any = {};
  teste: any = [];
  teste2: any = [];
  en: any;
  mov: any = {
    tipo: 2,
    classificacao: 'Mercadoria para Revenda',
    conta_corrente: 'Conta Padrão',
    forma_de_pg: 'DINHEIRO',
    obs: '',
    paga: true,
    data_pg: moment().toDate(),
    vencimento: moment().toDate()

  }
  retorno: any;
  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    public toast: ToastrManager,
    private route: Router,
    protected localStorage: LocalStorage
  ) {
    let id = this.auth.auth.currentUser.uid;
    this.db.collection('users').doc(id).valueChanges().subscribe(data => {
      this.dados = data;
      this.pedidoCompra.solicitante = this.dados.name;
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

    this.db.collection('produtos', ref => ref.where('status', '==', true).orderBy('nome', 'asc')).valueChanges()
      .subscribe(data => {
        this.results = data;
      })
  }
  gettotal() {
    var soma = 0;
    this.produtos.forEach(ret => {
      this.dados = ret;
      soma += this.dados.item.custo * this.dados.item.qtde;
    })

    return this.total = soma;
  }
  add(pedidoCompra: PedidoCompra) {
    if (pedidoCompra.produto == "") {
      this.toast.errorToastr('Você precisa selecionar um produto', 'Aviso!');
    } else {
      this.db.collection('produtos').doc(pedidoCompra.produto).valueChanges().subscribe(data => {
        this.dados = data;

        this.itensProdutos.nome = this.dados.nome;
        this.itensProdutos.key = pedidoCompra.produto;
        this.itensProdutos.custo = pedidoCompra.custo;
        this.itensProdutos.atualizar = pedidoCompra.atualizar;
        this.itensProdutos.qtde = pedidoCompra.qtde;
        if (this.produtos.length == 0) {
          this.produtos.push(new MyPedidoCompra(this.itensProdutos));
          //console.log(this.produtos);
          this.itensProdutos = [];
        } else {

          let found = this.produtos.find((ret) => ret.item['key'] === pedidoCompra.produto);
          if (found) {
            found.item['qtde'] = found.item['qtde'] + pedidoCompra.qtde;
          } else {
            this.produtos.push(new MyPedidoCompra(this.itensProdutos));
            //console.log(this.produtos);
            this.itensProdutos = [];
          }

        }

        var soma = 0;
        this.produtos.forEach(ret => {
          this.dados = ret;
          soma += this.dados.item.custo * this.dados.item.qtde;
        })

        this.total = soma;
      })
    }
  }

  onChange(event) {
    this.db.collection('produtos').doc(event).valueChanges().subscribe(data => {
      this.dados = data;
      this.pedidoCompra.custo = this.dados.custo;
    })

  }

  delete(item: MyPedidoCompra) {
    this.produtos.splice(this.produtos.indexOf(item), 1);

    var soma = 0;
    this.produtos.forEach(ret => {
      this.dados = ret;
      soma += this.dados.item.custo * this.dados.item.qtde;
    })

    this.total = soma;

  }

  salvar_temp() {
    this.loading = true;
    var status: boolean = false;
    this.saved(status);
  }
  debugg(data: any) {
    var docRef = this.db.collection("produtos").doc(data.key).get().toPromise();
    docRef.then(data2 => {
      this.teste = data2.data();
      //console.log(this.teste);

      this.getMarkup(this.teste, data);

    })

  }
  getMarkup(teste, data) {
    var key = teste.key;
    var qtde_atual = data.qtde + teste.qtde_atual;
    var custo = data.custo;

    var doc = '5ogPSqqGRAFvIoOsbjcM';
    this.db.collection('config').doc(doc).valueChanges().subscribe(ret2 => {
      this.teste2 = ret2;
      var parcial = custo * this.teste2.markup;
      var cal = parcial / 100;
      var final = custo + cal;
      var prazo = final * 1.1;

      this.updateproducts(key, qtde_atual, custo, final, prazo);
    })
  }
  updateproducts(key, qtde_atual, custo, final, prazo) {

    this.db.collection('produtos').doc(key).update({
      custo: custo,
      prazo: prazo,
      qtde_atual: qtde_atual,
      vista: final
    }).then(() => {
      console.log('atualizado!');
    }).catch((err) => {
      console.log(err);
    })


  }
  salvar_pedido() {
    this.mov.valor = this.gettotal();
    this.display = true;
    /*  */
  }

  movimentar(mov: Movimentacao) {
    this.loading = true;
    this.produtos.forEach(data => {
      this.debugg(data.item);
    })

    if (mov.valor <= 0) {
      this.display = false;
    } else {
      var id = this.auth.auth.currentUser.uid;

      this.db.collection('users').doc(id).valueChanges().subscribe(data => {
        this.retorno = data;
        mov.criado_por = this.retorno.name;
        mov.key = this.db.createId();
        this.db.collection('movimento').doc(mov.key).set(mov).then(() => {
          /* this.loading = false;
          this.toast.successToastr('Movimentação realizada com sucesso!', 'Parabéns!');
          this.display = false; */          
          var status = true;
          this.saved(status);
        }).catch(err => {
          console.log(err);
          this.loading = false;
          this.toast.errorToastr('Não foi possível concluir a operação', 'Desculpe!');
        })
      })
    }
  }

  saved(status) {
    let id = this.auth.auth.currentUser.uid;
    this.db.collection('users').doc(id).valueChanges().subscribe(data => {
      this.dados = data;
      this.pedido_temp.solicitante = this.dados.name;
      this.pedido_temp.key_solicitante = id;
      this.pedido_temp.data_emissao = moment().format('LLL');
      this.pedido_temp.total = this.total;
      this.pedido_temp.status = status;
      this.pedido_temp.key = this.db.createId();

      this.pedido_temp.item = this.produtos.map((obj) => { return Object.assign({}, obj.item) });
      console.log(this.pedido_temp.item);

      this.db.collection('pedido_de_compra').doc(this.pedido_temp.key).set(this.pedido_temp)
        .then(() => {
          this.produtos = [];
          this.loading = false;
          if (status) {
            this.toast.successToastr('Entrada de Produtos registrada com sucesso...', 'Parabéns!');
          } else {
            this.toast.infoToastr('Pedido de compra salvo temporariamente...', 'Informação!');
          }
          this.route.navigate(['admin/entrada-estoque']);
        }).catch((err) => {
          this.loading = false;
          console.log(err);
          this.toast.errorToastr('Desculpe, não conseguimos finalizar a operação!', 'Aviso!');
          this.route.navigate(['admin/entrada-estoque']);
        })
    })
  }

}
