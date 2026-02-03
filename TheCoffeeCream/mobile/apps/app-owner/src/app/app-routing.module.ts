import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { ShopManagementComponent } from './features/shops/pages/shop-management/shop-management.component';
import { PurchaseManagementComponent } from './features/plans/pages/purchase-management/purchase-management.component';
import { PlanManagementComponent } from './features/plans/pages/plan-management/plan-management.component';
import { authGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'shops', component: ShopManagementComponent, canActivate: [authGuard] },
  { path: 'purchases', component: PurchaseManagementComponent, canActivate: [authGuard] },
  { path: 'plans', component: PlanManagementComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
