import { NgModule } from '@angular/core';
import {CadastroPessoaComponent} from './cadastro-pessoa.component';
import {SharedModule} from '../SharedModule';
import {ListagemPessoasComponent} from './listagem-pessoas.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PessoaService} from './pessoa-service';

@NgModule({
  declarations: [
    CadastroPessoaComponent,
    ListagemPessoasComponent
  ],
  imports: [
    SharedModule,
    BrowserAnimationsModule
  ],
  providers: [PessoaService]
})
export class PessoaModule { }
