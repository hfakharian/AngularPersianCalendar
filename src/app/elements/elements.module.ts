import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HfPersianCalendarComponent } from './hf-persian-calendar/hf-persian-calendar.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ], exports: [
    HfPersianCalendarComponent
  ],
  declarations: [
    HfPersianCalendarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ElementsModule { }