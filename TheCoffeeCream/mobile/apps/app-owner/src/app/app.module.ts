import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { ShopManagementComponent } from './features/shops/pages/shop-management/shop-management.component';
import { PurchaseManagementComponent } from './features/plans/pages/purchase-management/purchase-management.component';
import { PlanManagementComponent } from './features/plans/pages/plan-management/plan-management.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { ConfirmModalComponent } from './shared/components/confirm-modal/confirm-modal.component';
import { authInterceptor } from './shared/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ShopManagementComponent,
    PurchaseManagementComponent,
    PlanManagementComponent,
    ToastComponent,
    LoadingComponent,
    ConfirmModalComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
