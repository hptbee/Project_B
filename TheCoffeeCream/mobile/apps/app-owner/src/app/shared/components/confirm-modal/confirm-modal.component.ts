import { Component } from '@angular/core';
import { ConfirmModalService, ConfirmModalConfig } from '../../services/confirm-modal.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-confirm-modal',
    template: `
    <div class="modal-overlay" *ngIf="show$ | async" (click)="onOverlayClick()">
        <div class="modal-container" (click)="$event.stopPropagation()" *ngIf="config$ | async as config">
            <div class="modal-header">
                <span class="modal-title">{{ config.title }}</span>
            </div>
            <div class="modal-body">
                <p>{{ config.message }}</p>
            </div>
            <div class="modal-footer">
                <button *ngIf="config.onCancel" class="btn-secondary" (click)="onCancel(config)">
                    {{ config.cancelText || 'Cancel' }}
                </button>
                <button 
                    class="btn-primary" 
                    [class.danger]="config.type === 'danger'"
                    (click)="onConfirm(config)"
                >
                    {{ config.confirmText || 'Confirm' }}
                </button>
            </div>
        </div>
    </div>
    `,
    styles: [`
    .modal-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    }
    .modal-container {
        background: var(--bg-card, #1e1e1e);
        border: 1px solid var(--border-glass, rgba(255,255,255,0.1));
        border-radius: 16px;
        padding: 24px;
        width: 90%;
        max-width: 400px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        color: var(--text-primary, #fff);
    }
    .modal-header {
        margin-bottom: 16px;
    }
    .modal-title {
        font-size: 18px;
        font-weight: 700;
    }
    .modal-body {
        margin-bottom: 24px;
        color: var(--text-secondary, #aaa);
        font-size: 14px;
        line-height: 1.5;
    }
    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }
    button {
        padding: 10px 20px;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }
    .btn-secondary {
        background: transparent;
        color: var(--text-secondary, #aaa);
        border: 1px solid var(--border-glass, rgba(255,255,255,0.1));
    }
    .btn-primary {
        background: var(--accent-amber, #F59E0B);
        color: #000;
    }
    .btn-primary.danger {
        background: var(--accent-red, #EF4444);
        color: #fff;
    }
    `],
    standalone: false
})
export class ConfirmModalComponent {
    show$: Observable<boolean>;
    config$: Observable<ConfirmModalConfig | null>;

    constructor(private modalService: ConfirmModalService) {
        this.show$ = this.modalService.show$;
        this.config$ = this.modalService.config$;
    }

    onConfirm(config: ConfirmModalConfig) {
        config.onConfirm();
        this.modalService.hide();
    }

    onCancel(config: ConfirmModalConfig) {
        if (config.onCancel) {
            config.onCancel();
        }
        this.modalService.hide();
    }

    onOverlayClick() {
        // Optional: Close on overlay click? Usually generic modals don't unless cancelable.
        // For Access Denied, we probably don't want to close it easily. 
        // But for generic usage, maybe. I'll leave it non-closing for now to enforce choice.
    }
}
