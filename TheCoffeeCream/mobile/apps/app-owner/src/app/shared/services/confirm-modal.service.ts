import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ConfirmModalConfig {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'default' | 'danger';
    onConfirm: () => void;
    onCancel?: () => void;
}

@Injectable({
    providedIn: 'root'
})
export class ConfirmModalService {
    private showSubject = new BehaviorSubject<boolean>(false);
    private configSubject = new BehaviorSubject<ConfirmModalConfig | null>(null);

    show$ = this.showSubject.asObservable();
    config$ = this.configSubject.asObservable();

    show(config: ConfirmModalConfig): void {
        this.configSubject.next(config);
        this.showSubject.next(true);
    }

    hide(): void {
        this.showSubject.next(false);
    }
}
