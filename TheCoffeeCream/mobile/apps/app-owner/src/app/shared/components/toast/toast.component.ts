import { Component } from '@angular/core';
import { ToastService, ToastType } from '../../services/toast.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
    standalone: false
})
export class ToastComponent {
    show$: Observable<boolean>;
    message$: Observable<string>;
    type$: Observable<ToastType>;
    action$: Observable<{ label: string, callback: () => void } | null>;

    constructor(private toastService: ToastService) {
        this.show$ = this.toastService.show$;
        this.message$ = this.toastService.message$;
        this.type$ = this.toastService.type$;
        this.action$ = this.toastService.action$;
    }

    handleAction(action: { label: string, callback: () => void }): void {
        if (action && action.callback) {
            action.callback();
        }
        this.toastService.hide();
    }
}
