import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Evaluation } from '../../models/Evaluation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {


  private apiUrl = 'http://localhost:5000/evaluation'; 

  constructor(private http: HttpClient) {}

  // Add a new evaluation
  addEvaluation(evaluation: Evaluation): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/AddEvaluation`, evaluation, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  // Get all evaluations
  getAllEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}/GetAllevaluations`);
  }

  // Get an evaluation by ID
  getEvaluationById(EvaluationId: string): Observable<Evaluation> {
    return this.http.get<Evaluation>(`${this.apiUrl}/GetEvaluation/${EvaluationId}`);
  }

  // Update an evaluation by ID
  updateEvaluation(EvaluationId: string, evaluation: Partial<Evaluation>): Observable<Evaluation> {
    return this.http.put<Evaluation>(`${this.apiUrl}/UpdateEvaluation/${EvaluationId}`, evaluation, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  // Delete an evaluation by ID
  deleteEvaluation(EvaluationId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/DeleteEvaluation/${EvaluationId}`);
  }
}
