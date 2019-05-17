import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-estoque-baixo',
  templateUrl: './estoque-baixo.component.html',
  styleUrls: ['./estoque-baixo.component.css']
})
export class EstoqueBaixoComponent implements OnInit {
  produtoteste: any[] = [];
  produtos: any[] = [];
  teste: any;
  teste2: any = {};
  cols: any[];
  constructor(
    private db: AngularFirestore
  ) {
    this.db.collection('produtos/', ref => ref.where('status', '==', true))
    .snapshotChanges().subscribe(data => {
      if(data.length > 0){
        for(let i = 0; i < data.length; i++){
          let qtde = data[i].payload.doc.get('qtde_min');
          let id = data[i].payload.doc.get('key');
          
          let ret = this.db.collection('produtos/').doc(id).valueChanges();
          ret.subscribe(data2 => {
            this.teste2 = data2;
            if(this.teste2.qtde_atual < this.teste2.qtde_min){
              this.produtoteste.push(this.teste2);
            }
            
            
          })
          
          
          /* this.db.collection('produtos', ref => ref.where('qtde_atual', '<', qtde))
          .valueChanges().subscribe(data2 => {
            data2.forEach(a => {
              this.teste2 = a;
              console.log(this.teste.qtde_min);
              
              
            })
            
          }) */
          
        }
        
      }
      
    })

    this.cols = [
      { field: 'barcode', header: 'Cód Barras', width: '13%' },
      { field: 'nome', header: 'Nome', width: '48%' },
      { field: 'qtde_atual', header: 'Qtde', width: '7%' },
      { field: 'dif', header: 'Qtde Comp', width: '7%' },
      { field: 'vista', header: 'Preço', width: '15%' },
      { field: 'status', header: 'Status', width: '10%' },
    ];

  }

  ngOnInit() {
    this.db.collection('produtos').valueChanges().subscribe(teste => {
      this.teste = teste;
    })
    $(document).ready(() => {
      const trees: any = $('[data-widget="tree"]');
      if (trees) {
        trees.tree();
      }

    });
  }

  /* getHelper(): Promise<[]>{
    return new Promise<Produtos[]>((resolve, reject)=>{
      this.db.collection('produtos').snapshotChanges().subscribe(res=>{
        let produtos: Produtos[] = []
        for (let i =0; i<res.length; i++){
          this.db.collection('produtos', ref=>{
            return ref.where('qtde_atual', '<', res[i].payload.doc.get('qtde_min'))
          }).snapshotChanges().subscribe(prod=>{
            for (let x = 0; x<prod.length; x++){
              let produto = new Produtos();
              produto.descricao = prod[x].payload.doc.get('descricao');
              produtos.push(produto);
            }
          })
        }
        resolve(produtos);
      }, (err)=>{
        reject(err)
      })
    })
  } */

}
