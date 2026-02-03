import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private readonly API_URL = `${environment.apiUrl}/Shops`;

  constructor(private http: HttpClient) { }

  getShops(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  getShop(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  createShop(shopData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Auth/register-shop`, shopData);
  }

  updateShop(id: string, shopData: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}`, shopData);
  }

  extendSubscription(id: string, days: number): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/${id}/extend`, { days });
  }

  resetPassword(id: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/${id}/reset-password`, data);
  }

  toggleStatus(id: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/${id}/toggle-status`, {});
  }

  getSubscriptionHistory(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/${id}/history`);
  }

  purchasePlan(id: string, planData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/${id}/purchase-plan`, planData);
  }

  getAllSubscriptionHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/all-history`);
  }

  updatePurchase(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/history/${id}`, data);
  }

  deletePurchase(id: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/history/${id}`);
  }
}
