import {AfterViewInit, Component, HostBinding, OnInit, ViewChild} from '@angular/core';
import {animationRoutes} from '../animations';
import {MatPaginator, MatSort, MatTableDataSource, MatSnackBar} from '@angular/material';
import {Pessoa} from '../classes/pessoa';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PessoaDependente} from '../classes/pessoa-dependente';
import { PessoaService } from './pessoa-service';

@Component({
  selector: 'app-pessoa',
  templateUrl: './cadastro-pessoa.component.html',
  styleUrls: ['./cadastro-pessoa.component.css'],
  animations: [animationRoutes]
})
export class CadastroPessoaComponent implements OnInit, AfterViewInit {
  @HostBinding('@routeAnimation') routeAnimation = true;

  displayedColumns: string[] = ['Codigo', 'Nome', 'DataNascimento', 'Idade', 'Acoes'];
  dataSource: MatTableDataSource<PessoaDependente>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  nomeFormControl = new FormControl('', [Validators.required]);
  cpfFormControl = new FormControl('', [Validators.required,
    Validators.pattern('^[0-9]{11,11}$'), Validators.maxLength(11)]);
  sexoFormControl = new FormControl('', [Validators.required]);
  grupoFormControl = new FormControl('', [Validators.required]);
  situacaoFormControl = new FormControl('', [Validators.required]);
  observacaoFormControl = new FormControl('', []);
  nomeDependenteFormControl = new FormControl('', [Validators.required]);
  dataNascimentoDependenteFormControl = new FormControl('', [Validators.required]);

  pessoaForm: FormGroup = new FormGroup({
    nome: this.nomeFormControl,
    cpf: this.cpfFormControl,
    sexo: this.sexoFormControl,
    grupo: this.grupoFormControl,
    situacao: this.situacaoFormControl,
    observacao: this.observacaoFormControl
  });

  dependenteForm: FormGroup = new FormGroup({
    nomeDependente: this.nomeDependenteFormControl,
    dataNascimentoDependente: this.dataNascimentoDependenteFormControl
  });

  error: string;
  pessoa: Pessoa;
  dependente: PessoaDependente;
  datNascimento: Date = new Date;
  codigoPessoa: number;

  constructor(private router: Router, private route: ActivatedRoute, private pessoaService: PessoaService, private snackBar: MatSnackBar) {
    this.codigoPessoa = +this.route.snapshot.paramMap.get('codigo');
    this.criarInstancias();
    if (this.codigoPessoa) {
      this.getPessoa();
    }

    this.updateTable();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
  }

  criarInstancias(): void {
    this.pessoa = new Pessoa(0, '', '', '', null, true, [], '');
    this.dependente = new PessoaDependente(0, '', '');
  }

  getPessoa(): void {
    this.pessoaService.getPessoa(this.codigoPessoa).subscribe(retorno => {
      if (retorno.Pessoa) {
        this.pessoa = new Pessoa(retorno.Pessoa.pes_codigo, retorno.Pessoa.pes_nome, retorno.Pessoa.pes_cpf, retorno.Pessoa.pes_sexo, 
          retorno.Pessoa.pes_grupo ? 1 : 2, retorno.Pessoa.pes_ativo === 'S' ? true : false, [], retorno.Pessoa.pes_obs);

          this.getDepedentes();
      }
    }, error => {
      this.error = error;
    });
  }

  getDepedentes(): void {
    this.pessoaService.getDependentesPessoa(this.codigoPessoa).subscribe(retorno => {
      if (retorno.Dependentes) {
        retorno.Dependentes.forEach(dep => {
          this.pessoa.Dependentes.push(new PessoaDependente(dep.dep_codigo, dep.dep_nome, dep.dep_nascimento));
        });

        this.updateTable();
      }
    }, error => {
      this.error = error;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getCpfCnpjErrorMessage(): any {
    return this.cpfFormControl.hasError('required') ? 'Campo é obrigatório' :
      (this.cpfFormControl.hasError('pattern') ? 'Cpf inválido' :
        this.cpfFormControl.hasError('maxlength') ? 'Máximo 11 caracteres' : '');
  }

  getRequiredErrorMessage(field: string): any {
      return this.pessoaForm.get(field).hasError('required') ? 'Campo é obrigatório' : '';
  }

  getRequiredErrorMessageDependente(field: string): any {
    return this.dependenteForm.get(field).hasError('required') ? 'Campo é obrigatório' : '';
  }

  processaIdade(dataNascimento: string): number {
    return (new Date().getFullYear() - new Date(Date.parse(dataNascimento)).getFullYear());
  }

  incluirDependente(): void {
    const index: number = this.pessoa.Dependentes.findIndex(d => d.Codigo_dependente === this.dependente.Codigo_dependente);
    if (index >= 0) {
      this.pessoa.Dependentes[index].Nome = this.dependente.Nome;
      this.pessoa.Dependentes[index].Data_nascimento = this.datNascimento.toISOString().slice(0, 10);
    } else {
      this.dependente.Codigo_dependente = this.pessoa.Dependentes.length + 1;
      this.dependente.Data_nascimento = this.datNascimento.toISOString().slice(0, 10);
      this.pessoa.Dependentes.push(this.dependente);
    }

    this.dependente = new PessoaDependente(0, '', '');
    this.updateTable();
  }

  excluirDependente(dependente: PessoaDependente): void {
    const index: number = this.pessoa.Dependentes.findIndex(d => d.Codigo_dependente === dependente.Codigo_dependente);
    if (index >= 0) {
      this.pessoa.Dependentes.splice(index, 1);
      this.updateTable();
    }
  }

  editarDependente(dependente: PessoaDependente): void {
    this.dependente.Codigo_dependente = dependente.Codigo_dependente;
    this.dependente.Nome = dependente.Nome;
    this.datNascimento = new Date(Date.parse(dependente.Data_nascimento.replace(' 00:00:00', '').replace('-', '/')));
  }

  updateTable(): void {
    this.dataSource = new MatTableDataSource(this.pessoa.Dependentes);
    this.ngAfterViewInit();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  confirmar(): void {
    if (this.codigoPessoa) {
      this.pessoaService.putPessoa(this.pessoa).subscribe(retorno => {
          this.openSnackBar('Pessoa atualizado com sucesso!', '');
          this.router.navigate(['pessoas', 'listagem']);
      }, error => {
        this.error = error;
      });
    } else {
      this.pessoaService.postPessoa(this.pessoa).subscribe(retorno => {
        this.openSnackBar('Pessoa incluída com sucesso!', '');
        this.router.navigate(['pessoas', 'listagem']);
    }, error => {
      this.error = error;
    });
    }
  }
}
