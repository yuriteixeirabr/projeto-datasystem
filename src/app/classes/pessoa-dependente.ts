export class PessoaDependente {
  Codigo_dependente: number;
  Nome: string;
  Data_nascimento: string;

  constructor(codigo_dependente: number, nome: string, data_nascimento: string) {
    this.Codigo_dependente = codigo_dependente;
    this.Nome = nome;
    this.Data_nascimento = data_nascimento;
  }
}
