import {PessoaDependente} from './pessoa-dependente';

export class Pessoa {
  Codigo_pessoa: number;
  Nome: string;
  CPF: string;
  Sexo: string;
  Grupo: number;
  Situacao: boolean;
  Dependentes: PessoaDependente[];
  Observacao: string;

  constructor(codigo_pessoa: number, nome: string, cpf: string, sexo: string, grupo: number, situacao: boolean,
              dependentes: PessoaDependente[], observacao: string) {
    this.Codigo_pessoa = codigo_pessoa;
    this.Nome = nome;
    this.CPF = cpf;
    this.Sexo = sexo;
    this.Grupo = grupo;
    this.Situacao = situacao;
    this.Dependentes = dependentes;
    this.Observacao = observacao;
  }
}
