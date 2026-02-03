import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    standalone: false
})
export class LoadingComponent {
    isLoading$: Observable<boolean>;

    constructor(private loadingService: LoadingService) {
        this.isLoading$ = this.loadingService.isLoading$;
    }
}
