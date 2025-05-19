import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SpeedDialModule } from 'primeng/speeddial';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AvatarModule } from 'primeng/avatar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmationService, MessageService } from 'primeng/api';
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports:[
    MenubarModule,
    DialogModule,
    DataViewModule,
    TagModule,
    SpeedDialModule,
    DropdownModule,
    FloatLabelModule,
    InputTextModule,
    RatingModule,
    PasswordModule,
    PaginatorModule,
    RadioButtonModule,
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
