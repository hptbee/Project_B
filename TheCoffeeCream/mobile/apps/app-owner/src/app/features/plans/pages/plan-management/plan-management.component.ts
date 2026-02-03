import { Component, OnInit } from '@angular/core';
import { PlanService } from '../../../../shared/services/plan.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { ThemeService } from '../../../../shared/services/theme.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoadingService } from '../../../../shared/services/loading.service';

@Component({
    selector: 'app-plan-management',
    templateUrl: './plan-management.component.html',
    styleUrls: ['./plan-management.component.scss'],
    standalone: false
})
export class PlanManagementComponent implements OnInit {
    plans: any[] = [];
    loading = true;
    isSidebarCollapsed = true;
    user: any = null;
    showModal = false;
    modalTitle = '';
    formData: any = {};
    dialogType: 'create' | 'edit' = 'create';

    constructor(
        private planService: PlanService,
        private auth: AuthService,
        public themeService: ThemeService,
        private router: Router,
        private toastService: ToastService,
        private loadingService: LoadingService
    ) { }

    ngOnInit(): void {
        this.user = this.auth.getUser();
        this.loadPlans();
    }

    toggleSidebar(): void {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }

    loadPlans(): void {
        this.loadingService.show();
        this.planService.getPlans().subscribe({
            next: (data) => {
                this.plans = data;
                this.loadingService.hide();
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading plans', err);
                this.loadingService.hide();
                this.loading = false;
                this.toastService.error('Failed to load plans');
            }
        });
    }

    openDialog(type: 'create' | 'edit', item: any = null): void {
        this.dialogType = type;
        this.showModal = true;

        if (type === 'create') {
            this.modalTitle = 'Create New Plan';
            this.formData = {
                code: '',
                name: '',
                durationDays: 30,
                price: 0,
                description: '',
                isActive: true
            };
        } else {
            this.modalTitle = 'Edit Plan';
            this.formData = { ...item };
        }
    }

    closeModal(): void {
        this.showModal = false;
        this.formData = {};
    }

    save(): void {
        this.loadingService.show();
        if (this.dialogType === 'create') {
            this.planService.createPlan(this.formData).subscribe({
                next: () => {
                    this.loadPlans();
                    this.closeModal();
                    this.loadingService.hide();
                    this.toastService.success('Plan created successfully');
                },
                error: (err) => {
                    this.loadingService.hide();
                    this.toastService.error('Failed to create plan');
                }
            });
        } else {
            this.planService.updatePlan(this.formData.id, this.formData).subscribe({
                next: () => {
                    this.loadPlans();
                    this.closeModal();
                    this.loadingService.hide();
                    this.toastService.success('Plan updated successfully');
                },
                error: (err) => {
                    this.loadingService.hide();
                    this.toastService.error('Failed to update plan');
                }
            });
        }
    }

    deleteItem(item: any): void {
        if (confirm('Are you sure you want to delete this plan?')) {
            this.loadingService.show();
            this.planService.deletePlan(item.id).subscribe({
                next: () => {
                    this.loadPlans();
                    this.loadingService.hide();
                    this.toastService.success('Plan deleted successfully');
                },
                error: (err) => {
                    this.loadingService.hide();
                    this.toastService.error('Failed to delete plan');
                }
            });
        }
    }

    logout(): void {
        this.auth.logout();
        this.router.navigate(['/login']);
    }

    formatCurrency(value: number): string {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    }
}
