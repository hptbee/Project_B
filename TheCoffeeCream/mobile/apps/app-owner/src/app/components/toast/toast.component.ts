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

    constructor(private toastService: ToastService) {
        this.show$ = this.toastService.show$;
        this.message$ = this.toastService.message$;
        this.type$ = this.toastService.type$;
    }
}
