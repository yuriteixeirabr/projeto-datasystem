import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CadastroPessoaComponent} from './pessoa/cadastro-pessoa.component';
import {RouterOutletComponent} from './router-outlet.component';
import {ListagemPessoasComponent} from './pessoa/listagem-pessoas.component';

const routes: Routes = [
  {
    path: 'pessoas',
    component: RouterOutletComponent,
    children: [
      {
        path: 'listagem',
        component: ListagemPessoasComponent
      },
      {
        path: 'cadastrar',
        component: CadastroPessoaComponent
      },
      {
        path: 'atualizar/:codigo',
        component: CadastroPessoaComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: '/pessoas/listagem',
    pathMatch: 'full'
  },
  /*{
    path: '**',
    component: PageNotFoundComponent
  }*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
