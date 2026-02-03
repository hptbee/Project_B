import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PlanService {
    private readonly API_URL = `${environment.apiUrl}/Plans`;

    constructor(private http: HttpClient) { }

    getPlans(): Observable<any[]> {
        return this.http.get<any[]>(this.API_URL);
    }

    getPlan(id: string): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/${id}`);
    }

    createPlan(plan: any): Observable<any> {
        return this.http.post<any>(this.API_URL, plan);
    }

    updatePlan(id: string, plan: any): Observable<any> {
        return this.http.put<any>(`${this.API_URL}/${id}`, plan);
    }

    deletePlan(id: string): Observable<any> {
        return this.http.delete<any>(`${this.API_URL}/${id}`);
    }
}
