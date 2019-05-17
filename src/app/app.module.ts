import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth-service.service';
import { firebase_config } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ng6-toastr-notifications';
import { NgxLoadingModule } from 'ngx-loading';
import { HeaderComponent } from './includes/header/header.component';
import { MenuComponent } from './includes/menu/menu.component';
import { FooterComponent } from './includes/footer/footer.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { TableModule } from 'primeng/table';
import { UsuariosEditComponent } from './admin/usuarios-edit/usuarios-edit.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { ConfigComponent } from './admin/config/config.component';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { ClientesComponent } from './admin/clientes/clientes.component';
registerLocaleData(localePt, 'pt-BR');
import { NgxCpfCnpjModule } from  'ngx-cpf-cnpj';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { NgxMaskModule } from 'ngx-mask';
import { DialogModule } from 'primeng/dialog';
import { EditClienteComponent } from './admin/edit-cliente/edit-cliente.component';
import { CategoriasComponent } from './admin/categorias/categorias.component';
import { DepartamentosComponent } from './admin/departamentos/departamentos.component';
import { FornecedoresComponent } from './admin/fornecedores/fornecedores.component';
import { EditFornecedoresComponent } from './admin/edit-fornecedores/edit-fornecedores.component';
import { ProdutosComponent } from './admin/produtos/produtos.component';
import { ProdutosNovoComponent } from './admin/produtos-novo/produtos-novo.component';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { EditProdutosComponent } from './admin/edit-produtos/edit-produtos.component';
import { EntradaEstoqueComponent } from './admin/entrada-estoque/entrada-estoque.component';
import { EstoqueBaixoComponent } from './admin/estoque-baixo/estoque-baixo.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { UiSwitchModule } from 'ngx-ui-switch';
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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    UsuariosComponent,
    UsuariosEditComponent,
    ConfigComponent,
    ClientesComponent,
    EditClienteComponent,
    CategoriasComponent,
    DepartamentosComponent,
    FornecedoresComponent,
    EditFornecedoresComponent,
    ProdutosComponent,
    ProdutosNovoComponent,
    EditProdutosComponent,
    EntradaEstoqueComponent,
    EstoqueBaixoComponent,
    PedidoCompraNovoComponent,
    EditEstoqueComponent,
    FinanceiroComponent,
    ContaGerencialComponent,
    ContasPagarComponent,
    ContasPagarNovaComponent,
    PagarContaComponent,
    MovCaixaComponent,
    ContasPagasComponent,
    PdvComponent,
    CaixasComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebase_config),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    FormsModule,
    NgxLoadingModule.forRoot({}),
    ReactiveFormsModule,
    TableModule,
    ToastrModule.forRoot(),
    ConfirmDialogModule,
    FieldsetModule,
    CurrencyMaskModule,
    NgxCpfCnpjModule,
    CalendarModule,
    InputTextModule,
    NgxMaskModule.forRoot(),
    DialogModule,
    FileUploadModule,
    HttpClientModule,
    AutoCompleteModule,
    UiSwitchModule
  ],
  providers: [AuthService, { provide: FirestoreSettingsToken, useValue: {} }, {provide: LOCALE_ID, useValue: 'pt-BR'} ],
  bootstrap: [AppComponent]
})
export class AppModule { }
