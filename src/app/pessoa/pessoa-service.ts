import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServiceBase} from '../service-base.service';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import { Pessoa } from '../classes/pessoa';

@Injectable()
export class PessoaService extends ServiceBase {

  constructor(http: HttpClient) {
    super(http);
  }

  getAllPessoas(limitInicial: number, limitQtd: number, searchText: string): Observable<any> {
    let body: any = JSON.stringify({Limit_inicial: limitInicial, Limit_qtd: limitQtd, SearchText: searchText});
    return this.http.post<any>(`${this.apiUrl}/pessoas`, body,
      this.getRequestOptionsSemToken()).pipe(catchError(this.handleError));
  }

  getPessoa(codigoPessoa: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pessoa/${codigoPessoa}`,
      this.getRequestOptionsSemToken()).pipe(catchError(this.handleError));
  }

  getDependentesPessoa(codigoPessoa: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dependentes/${codigoPessoa}`,
      this.getRequestOptionsSemToken()).pipe(catchError(this.handleError));
  }

  postPessoa(pessoa: Pessoa): Observable<any> {
    let body: any = JSON.stringify(pessoa);
    return this.http.post<any>(`${this.apiUrl}/pessoa`, body, this.getRequestOptionsSemToken())
      .pipe(catchError(this.handleError));
  }

  putPessoa(pessoa: Pessoa): Observable<any> {
    let body: any = JSON.stringify(pessoa);
    return this.http.put<any>(`${this.apiUrl}/pessoa`, body, this.getRequestOptionsSemToken())
      .pipe(catchError(this.handleError));
  }

  deletePessoa(codigoPessoa: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/pessoa/${codigoPessoa}`, this.getRequestOptionsSemToken())
      .pipe(catchError(this.handleError));
  }
}
