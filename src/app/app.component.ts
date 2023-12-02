import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
 public datePersian:string = "1402/09/11";

 onValueChanged(date:string){
  console.log(date);
 }

}
