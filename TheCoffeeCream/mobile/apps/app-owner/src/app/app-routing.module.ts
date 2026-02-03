import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ShopManagementComponent } from './pages/shop-management/shop-management.component';
import { PurchaseManagementComponent } from './pages/purchase-management/purchase-management.component';
import { PlanManagementComponent } from './pages/plan-management/plan-management.component';
import { authGuard } from './guards/auth.guard';

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
