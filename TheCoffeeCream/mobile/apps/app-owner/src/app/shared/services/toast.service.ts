import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private showSubject = new BehaviorSubject<boolean>(false);
    private messageSubject = new BehaviorSubject<string>('');
    private typeSubject = new BehaviorSubject<ToastType>('success');

    show$ = this.showSubject.asObservable();
    message$ = this.messageSubject.asObservable();
    type$ = this.typeSubject.asObservable();

    private timeout: any;

    show(message: string, type: ToastType = 'success', duration: number = 3000): void {
        this.messageSubject.next(message);
        this.typeSubject.next(type);
        this.showSubject.next(true);

        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.hide();
        }, duration);
    }

    success(message: string): void {
        this.show(message, 'success');
    }

    error(message: string): void {
        this.show(message, 'error');
    }

    hide(): void {
        this.showSubject.next(false);
    }
}
