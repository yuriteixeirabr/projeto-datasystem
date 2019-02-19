import {AfterViewInit, Component, HostBinding, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatSnackBar, PageEvent} from '@angular/material';
import {Router} from '@angular/router';
import {Pessoa} from '../classes/pessoa';
import {animationRoutes} from '../animations';
import { PessoaService } from './pessoa-service';

@Component({
  selector: 'app-listagem-pessoas',
  templateUrl: './listagem-pessoas.component.html',
  styleUrls: ['./listagem-pessoas.component.css'],
  animations: [animationRoutes]
})
export class ListagemPessoasComponent implements OnInit, AfterViewInit {
  @HostBinding('@routeAnimation') routeAnimation = true;

  displayedColumns: string[] = ['Nome', 'CPF', 'Acoes'];
  dataSource: MatTableDataSource<Pessoa>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  limitInicial: number = 0;
  limitQtd: number = 10;
  resultsLength: number = 0;

  error: string;
  searchText: string = '';
  pessoas: Pessoa[] = [];

  constructor(private router: Router, private pessoaService: PessoaService, private snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; 
  }

  ngOnInit(): void {
    this.getPessoas();
  }

  getPessoas(): void {
    this.pessoas = [];
    this.dataSource = new MatTableDataSource([]);
    if (this.searchText !== '')
      this.limitInicial = 0;
    this.pessoaService.getAllPessoas(this.limitInicial, this.limitQtd, this.searchText).subscribe(retorno => {
        if (retorno.Pessoas) {
          retorno.Pessoas.forEach(pessoa => {
            this.resultsLength = pessoa.total_registros;
            this.pessoas.push(new Pessoa(pessoa.pes_codigo, pessoa.pes_nome, pessoa.pes_cpf, pessoa.pes_sexo, (pessoa.pes_grupo ? pessoa.pes_grupo : 
              (pessoa.pes_grupo2 ? pessoa.pes_grupo2 : 0)), pessoa.pes_ativo === 'S' ? true : false, [], pessoa.pes_obs));
          });
          
          this.dataSource = new MatTableDataSource(this.pessoas);
        }
    }, error => {
      this.error = error;
    });
  }

  applyFilter(): void {
    if (this.searchText === '') {
      this.limitInicial = 0;
      this.paginator.pageIndex = 0;
    }

    this.getPessoas();
  }

  atualizar(pessoa: Pessoa): void {
    this.router.navigate(['pessoas', 'atualizar', pessoa.Codigo_pessoa]);
  }

  excluir(pessoa: Pessoa): void {
    this.pessoaService.deletePessoa(pessoa.Codigo_pessoa).subscribe(retorno => {
      this.openSnackBar('Pessoa excluída com sucesso!', '');
      this.getPessoas();
    }, error => {
      this.error = error;
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  cadastrarPessoa(): void {
    this.router.navigate(['pessoas', 'cadastrar']);
  }

  getNext(event: PageEvent) {
    const offset: number = event.pageSize * event.pageIndex;
    this.limitInicial = offset;
    this.getPessoas();
  }
}
