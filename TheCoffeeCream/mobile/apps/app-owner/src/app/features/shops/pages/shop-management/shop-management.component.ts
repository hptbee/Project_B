import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../../../shared/services/shop.service';
import { PlanService } from '../../../../shared/services/plan.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { ThemeService } from '../../../../shared/services/theme.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoadingService } from '../../../../shared/services/loading.service';

@Component({
  selector: 'app-shop-management',
  templateUrl: './shop-management.component.html',
  styleUrls: ['./shop-management.component.scss'],
  standalone: false
})
export class ShopManagementComponent implements OnInit {
  shops: any[] = [];
  loading = true;
  showModal = false;
  dialogType: 'create' | 'edit' | 'extend' | 'password' | 'detail' = 'detail';
  selectedShop: any = null;
  formData: any = {};
  modalTitle = '';
  isSidebarCollapsed = true;
  user: any = null;
  history: any[] = [];
  availablePlans: any[] = [];

  constructor(
    private shopService: ShopService,
    private planService: PlanService,
    private auth: AuthService,
    public themeService: ThemeService,
    private toastService: ToastService,
    private loadingService: LoadingService
  ) { }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.loadShops();
    this.loadPlans();
  }

  loadPlans(): void {
    this.planService.getPlans().subscribe(data => {
      this.availablePlans = data.filter(p => p.isActive);
    });
  }

  loadShops(): void {
    this.loadingService.show();
    this.shopService.getShops().subscribe({
      next: (data) => {
        this.shops = data;
        this.loadingService.hide();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load shops', err);
        this.loadingService.hide();
        this.loading = false;
        this.toastService.error('Failed to load shops');
      }
    });
  }

  openDialog(type: 'create' | 'edit' | 'extend' | 'password' | 'detail', shop: any = null): void {
    this.dialogType = type;
    this.selectedShop = shop;
    this.showModal = true;
    this.history = [];

    switch (type) {
      case 'create':
        this.modalTitle = 'Create New Shop';
        this.formData = {
          shopCode: '', shopName: '', address: '', phoneNumber: '',
          planType: 'TRIAL_15_DAYS', adminUsername: '', adminPassword: ''
        };
        break;
      case 'edit':
        this.modalTitle = 'Edit Shop Info';
        this.formData = { ...shop, shopName: shop.name };
        break;
      case 'password':
        this.modalTitle = 'Reset Admin Password';
        this.formData = { newPassword: '' };
        break;
      case 'detail':
        this.modalTitle = 'Shop Details';
        if (shop) {
          this.loadHistory(shop.id);
        }
        break;
    }
  }

  loadHistory(shopId: string): void {
    this.shopService.getSubscriptionHistory(shopId).subscribe(data => {
      this.history = data;
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedShop = null;
    this.formData = {};
  }

  save(): void {
    this.loadingService.show();
    if (this.dialogType === 'create') {
      this.shopService.createShop(this.formData).subscribe({
        next: () => this.onSaveSuccess('Shop created successfully'),
        error: () => this.onSaveError('Failed to create shop')
      });
    } else if (this.dialogType === 'edit') {
      this.shopService.updateShop(this.selectedShop.id, this.formData).subscribe({
        next: () => this.onSaveSuccess('Shop updated successfully'),
        error: () => this.onSaveError('Failed to update shop')
      });
    } else if (this.dialogType === 'password') {
      this.shopService.resetPassword(this.selectedShop.id, { username: 'admin', newPassword: this.formData.newPassword }).subscribe({
        next: () => this.onSaveSuccess('Password reset successfully'),
        error: () => this.onSaveError('Failed to reset password')
      });
    }
  }

  private onSaveSuccess(msg: string): void {
    this.toastService.success(msg);
    this.loadingService.hide();
    this.closeModal();
    this.loadShops();
  }

  private onSaveError(msg: string): void {
    this.toastService.error(msg);
    this.loadingService.hide();
  }

  toggleStatus(shop: any): void {
    if (confirm(`Are you sure you want to ${shop.isActive ? 'deactivate' : 'activate'} this shop?`)) {
      this.loadingService.show();
      this.shopService.toggleStatus(shop.id).subscribe({
        next: () => {
          this.loadShops();
          this.closeModal();
          this.loadingService.hide();
          this.toastService.success(`Shop ${shop.isActive ? 'deactivated' : 'activated'} successfully`);
        },
        error: () => {
          this.loadingService.hide();
          this.toastService.error('Failed to update status');
        }
      });
    }
  }

  isExpired(date: string): boolean {
    return new Date(date) < new Date();
  }

  logout(): void {
    this.auth.logout();
  }
}
