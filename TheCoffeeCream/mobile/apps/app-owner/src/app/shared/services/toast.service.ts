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
    private actionSubject = new BehaviorSubject<{ label: string, callback: () => void } | null>(null);

    show$ = this.showSubject.asObservable();
    message$ = this.messageSubject.asObservable();
    type$ = this.typeSubject.asObservable();
    action$ = this.actionSubject.asObservable();

    private timeout: any;

    show(message: string, type: ToastType = 'success', duration: number = 3000, action?: { label: string, callback: () => void }): void {
        this.messageSubject.next(message);
        this.typeSubject.next(type);
        this.actionSubject.next(action || null);
        this.showSubject.next(true);

        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        // Only auto-hide if NO action is required
        if (!action) {
            this.timeout = setTimeout(() => {
                this.hide();
            }, duration);
        }
    }

    success(message: string): void {
        this.show(message, 'success');
    }

    error(message: string, action?: { label: string, callback: () => void }): void {
        this.show(message, 'error', 3000, action);
    }

    hide(): void {
        this.showSubject.next(false);
    }
}
