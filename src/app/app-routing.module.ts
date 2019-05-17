import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AuthService } from './auth-service.service';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { UsuariosEditComponent } from './admin/usuarios-edit/usuarios-edit.component';
import { ConfigComponent } from './admin/config/config.component';
import { ClientesComponent } from './admin/clientes/clientes.component';
import { EditClienteComponent } from './admin/edit-cliente/edit-cliente.component';
import { CategoriasComponent } from './admin/categorias/categorias.component';
import { DepartamentosComponent } from './admin/departamentos/departamentos.component';
import { FornecedoresComponent } from './admin/fornecedores/fornecedores.component';
import { EditFornecedoresComponent } from './admin/edit-fornecedores/edit-fornecedores.component';
import { ProdutosComponent } from './admin/produtos/produtos.component';
import { ProdutosNovoComponent } from './admin/produtos-novo/produtos-novo.component';
import { EditProdutosComponent } from './admin/edit-produtos/edit-produtos.component';
import { EntradaEstoqueComponent } from './admin/entrada-estoque/entrada-estoque.component';
import { EstoqueBaixoComponent } from './admin/estoque-baixo/estoque-baixo.component';
import { PedidoCompraNovoComponent } from './admin/pedido-compra-novo/pedido-compra-novo.component';
import { EditEstoqueComponent } from './admin/edit-estoque/edit-estoque.component';
import { FinanceiroComponent } from './financeiro/financeiro.component';
import { ContaGerencialComponent } from './conta-gerencial/conta-gerencial.component';
import { ContasPagarComponent } from './contas-pagar/contas-pagar.component';
import { ContasPagarNovaComponent } from './contas-pagar-nova/contas-pagar-nova.component';
import { PagarContaComponent } from './pagar-conta/pagar-conta.component';
import { MovCaixaComponent } from './mov-caixa/mov-caixa.component';
import { ContasPagasComponent } from './contas-pagas/contas-pagas.component';
import { PdvComponent } from './pdv/pdv.component';
import { CaixasComponent } from './caixas/caixas.component';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: '', component: LoginComponent
  },
  {
    path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/usuarios', component: UsuariosComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/usuarios/:key', component: UsuariosEditComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/configuracoes', component: ConfigComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/clientes', component: ClientesComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/clientes/:key', component: EditClienteComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/categorias', component: CategoriasComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/departamentos', component: DepartamentosComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/fornecedores', component: FornecedoresComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/fornecedores/:key', component: EditFornecedoresComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/produtos', component: ProdutosComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/produtos/novo', component: ProdutosNovoComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/produtos/:key', component: EditProdutosComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/estoque-baixo', component: EstoqueBaixoComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/entrada-estoque', component: EntradaEstoqueComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/entrada-estoque/novo', component: PedidoCompraNovoComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/entrada-estoque/:key', component: EditEstoqueComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/financeiro', component: FinanceiroComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/financeiro/conta-gerencial', component: ContaGerencialComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/financeiro/contas-a-pagar', component: ContasPagarComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/financeiro/contas-a-pagar/nova', component: ContasPagarNovaComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/financeiro/pagar-conta/:key', component: PagarContaComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/financeiro/mov-caixa', component: MovCaixaComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/financeiro/contas-pagas', component: ContasPagasComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/financeiro/pdv', component: PdvComponent, canActivate: [AuthService]
  },
  {
    path: 'admin/financeiro/caixas', component: CaixasComponent, canActivate: [AuthService]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
