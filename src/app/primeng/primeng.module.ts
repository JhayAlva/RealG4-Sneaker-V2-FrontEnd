import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AvatarModule } from 'primeng/avatar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmationService, MessageService } from 'primeng/api';
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports:[
    MenubarModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    PaginatorModule,
    MenuModule,
    ToastModule,
    CarouselModule,
    CardModule,
    ConfirmPopupModule,
    SliderModule,
    ButtonModule,
    ProgressSpinnerModule,
    AvatarModule
  ],
  providers:[ConfirmationService,MessageService]
})
export class PrimengModule { }
