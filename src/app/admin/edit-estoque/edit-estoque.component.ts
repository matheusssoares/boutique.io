import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoCompra } from 'src/app/models/pedidoCompra.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MyPedidoCompra } from 'src/app/models/mypedidocompra.class';
import { AngularFireAuth } from '@angular/fire/auth';
import { PedidoCompraTemp } from 'src/app/models/pedidoCompraTemp.model';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { Movimentacao } from 'src/app/models/movimentacao.model';

@Component({
  selector: 'app-edit-estoque',
  templateUrl: './edit-estoque.component.html',
  styleUrls: ['./edit-estoque.component.css']
})
export class EditEstoqueComponent implements OnInit {
  display: boolean = false;
  public loading: boolean = false;
  produtos: MyPedidoCompra[] = [];
  data: any = {};
  results: any[] = [];
  pedido_temp: PedidoCompraTemp = {};
  pedidoCompra: PedidoCompra = {
    solicitante: '',
    data_emissao: '',
    atualizar: false,
    qtde: 1,
    produto: '',
    custo: 0
  }
  total: number;
  dados: any = {};
  itensProdutos: any = [];
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
  teste: any = [];
  teste2: any = [];
  constructor(
    private router: ActivatedRoute,
    private route: Router,
    private db: AngularFirestore,
    public toast: ToastrManager,
    private auth: AngularFireAuth,
  ) {
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

  ngOnInit() {
    $(document).ready(() => {
      const trees: any = $('[data-widget="tree"]');
      if (trees) {
        trees.tree();
      }

    });

    this.db.collection('produtos', ref => ref.where('status', '==', true).orderBy('nome', 'asc')).valueChanges()
      .subscribe(data => {
        this.results = data;
      })

    let id = this.router.snapshot.paramMap.get('key');
    this.db.collection('pedido_de_compra').doc(id).valueChanges().subscribe(data => {
      //console.log(data);
      this.data = data;
      this.total = this.data.total;
      this.pedidoCompra.solicitante = this.data.solicitante;
      this.pedidoCompra.data_emissao = this.data.data_emissao;
      this.produtos = this.data.item;
    })
  }

  onChange(event) {
    this.db.collection('produtos').doc(event).valueChanges().subscribe(data => {
      this.data = data;
      this.pedidoCompra.custo = this.data.custo;
    })

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

        let found = this.produtos.find((ret) => ret['key'] === pedidoCompra.produto);
        if (found) {
          found['qtde'] = found['qtde'] + pedidoCompra.qtde;
          this.getTotal()
        } else {
          this.produtos.push(this.itensProdutos);
          this.getTotal()
          this.itensProdutos = [];
        }
      })
    }
  }

  delete(item: MyPedidoCompra) {
    this.produtos.splice(this.produtos.indexOf(item), 1);

    this.getTotal();

  }

  salvar_temp() {
    this.loading = true;
    let id_user = this.auth.auth.currentUser.uid;
    this.db.collection('users').doc(id_user).valueChanges().subscribe(data => {
      this.dados = data;
      this.pedido_temp.solicitante = this.dados.name;
      this.pedido_temp.key_solicitante = id_user;
      this.pedido_temp.data_emissao = moment().format('LLL');
      this.pedido_temp.total = this.total;
      this.pedido_temp.status = false;
      this.pedido_temp.item = this.produtos.map((obj) => { return Object.assign({}, obj) });

      let id = this.router.snapshot.paramMap.get('key');
      this.pedido_temp.key = id;
      this.db.collection('pedido_de_compra').doc(id).delete().then(() => {
        this.db.collection('pedido_de_compra').doc(id).set(this.pedido_temp).then(() => {
          this.produtos = [];
          this.loading = false;
          this.toast.infoToastr('Pedido de compra salvo temporariamente...', 'Informação!');
          this.route.navigate(['admin/entrada-estoque']);
        }).catch((err) => {
          this.loading = false;
          console.log(err);
          this.toast.errorToastr('Desculpe, não conseguimos finalizar a operação!', 'Aviso!');
          this.route.navigate(['admin/entrada-estoque']);
        })
      })
    })
  }

  getTotal() {
    var soma = 0;
    this.produtos.forEach(ret => {
      this.dados = ret;
      soma += this.dados.custo * this.dados.qtde;
    })

    this.total = soma;
  }

  gettotal() {
    var soma = 0;
    this.produtos.forEach(ret => {
      this.dados = ret;
      soma += this.dados.custo * this.dados.qtde;
    })

    return this.total = soma;
  }

  salvar_pedido() {
    this.mov.valor = this.gettotal();
    this.display = true;
  }

  movimentar(mov: Movimentacao) {
    this.loading = true;
    let id = this.router.snapshot.paramMap.get('key');
    this.db.collection('pedido_de_compra').doc(id).valueChanges().subscribe(data => {
      this.data = data;
      this.total = this.data.total;
      this.pedidoCompra.solicitante = this.data.solicitante;
      this.pedidoCompra.data_emissao = this.data.data_emissao;
      this.produtos = this.data.item;

      this.produtos.forEach(data => {
        this.debugg(data);

      })
    })

    if (mov.valor <= 0) {
      this.display = false;
    } else {
       const id = this.auth.auth.currentUser.uid;
 
       this.db.collection('users').doc(id).valueChanges().subscribe(data => {
         this.retorno = data;
         mov.criado_por = this.retorno.name;
         mov.key = this.db.createId();
         this.db.collection('movimento').doc(mov.key).set(mov).then(() => {          
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

  saved(status) {
    let id_user = this.auth.auth.currentUser.uid;
    this.db.collection('users').doc(id_user).valueChanges().subscribe(data => {
      this.dados = data;
      this.pedido_temp.solicitante = this.dados.name;
      this.pedido_temp.key_solicitante = id_user;
      this.pedido_temp.data_emissao = moment().format('LLL');
      this.pedido_temp.total = this.total;
      this.pedido_temp.status = status;
      this.pedido_temp.item = this.produtos.map((obj) => { return Object.assign({}, obj) });

      let id = this.router.snapshot.paramMap.get('key');
      this.pedido_temp.key = id;
      this.db.collection('pedido_de_compra').doc(id).delete().then(() => {
        this.db.collection('pedido_de_compra').doc(id).set(this.pedido_temp).then(() => {
          this.produtos = [];
          this.loading = false;
          this.toast.successToastr('Entrada de produtos realizada com sucesso...', 'Parabéns!');
          this.route.navigate(['admin/entrada-estoque']);
        }).catch((err) => {
          this.loading = false;
          console.log(err);
          this.toast.errorToastr('Desculpe, não conseguimos finalizar a operação!', 'Aviso!');
          this.route.navigate(['admin/entrada-estoque']);
        })
      })
    })
  }
}
