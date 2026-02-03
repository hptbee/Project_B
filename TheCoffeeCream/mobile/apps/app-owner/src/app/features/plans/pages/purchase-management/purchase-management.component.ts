import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../../../shared/services/shop.service';
import { PlanService } from '../../../../shared/services/plan.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { ThemeService } from '../../../../shared/services/theme.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoadingService } from '../../../../shared/services/loading.service';

@Component({
    selector: 'app-purchase-management',
    templateUrl: './purchase-management.component.html',
    styleUrls: ['./purchase-management.component.scss'],
    standalone: false
})
export class PurchaseManagementComponent implements OnInit {
    history: any[] = [];
    loading = true;
    isSidebarCollapsed = true;
    user: any = null;
    showModal = false;
    modalTitle = '';
    formData: any = {};
    dialogType: 'create' | 'edit' = 'create';
    shops: any[] = []; // for dropdown
    availablePlans: any[] = [];

    constructor(
        private shopService: ShopService,
        private planService: PlanService,
        private auth: AuthService,
        public themeService: ThemeService,
        private router: Router,
        private toastService: ToastService,
        private loadingService: LoadingService
    ) { }

    ngOnInit(): void {
        this.user = this.auth.getUser();
        this.loadHistory();
        this.loadShops();
        this.loadPlans();
    }

    toggleSidebar(): void {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }

    loadHistory(): void {
        this.loadingService.show();
        this.shopService.getAllSubscriptionHistory().subscribe({
            next: (data) => {
                this.history = data;
                this.loadingService.hide();
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading history', err);
                this.loadingService.hide();
                this.loading = false;
                this.toastService.error('Failed to load purchase history');
            }
        });
    }

    loadShops(): void {
        this.shopService.getShops().subscribe(data => this.shops = data);
    }

    loadPlans(): void {
        this.planService.getPlans().subscribe(data => {
            this.availablePlans = data.filter(p => p.isActive);
        });
    }

    openDialog(type: 'create' | 'edit', item: any = null): void {
        this.dialogType = type;
        this.showModal = true;

        if (type === 'create') {
            this.modalTitle = 'Create Purchase Log';
            this.formData = {
                shopId: '',
                planName: 'BASIC_30_DAYS',
                amount: 0,
                status: 'SUCCESS',
                durationDays: 30
            };
        } else {
            this.modalTitle = 'Edit Purchase Log';
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
            const plan = this.availablePlans.find(p => p.code === this.formData.planName);
            if (plan) {
                this.shopService.purchasePlan(this.formData.shopId, {
                    planName: plan.code,
                    durationDays: plan.durationDays,
                    price: plan.price
                }).subscribe({
                    next: () => {
                        this.loadHistory();
                        this.closeModal();
                        this.loadingService.hide();
                        this.toastService.success('Purchase logged successfully');
                    },
                    error: (err) => {
                        this.loadingService.hide();
                        this.toastService.error('Failed to log purchase');
                    }
                });
            } else {
                this.loadingService.hide();
                this.toastService.error('Invalid plan selected');
            }
        } else {
            this.shopService.updatePurchase(this.formData.id, this.formData).subscribe({
                next: () => {
                    this.loadHistory();
                    this.closeModal();
                    this.loadingService.hide();
                    this.toastService.success('Purchase log updated successfully');
                },
                error: (err) => {
                    this.loadingService.hide();
                    this.toastService.error('Failed to update purchase log');
                }
            });
        }
    }

    deleteItem(item: any): void {
        if (confirm('Are you sure you want to delete this log?')) {
            this.loadingService.show();
            this.shopService.deletePurchase(item.id).subscribe({
                next: () => {
                    this.loadHistory();
                    this.loadingService.hide();
                    this.toastService.success('Purchase log deleted successfully');
                },
                error: (err) => {
                    this.loadingService.hide();
                    this.toastService.error('Failed to delete purchase log');
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
