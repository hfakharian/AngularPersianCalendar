import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as moment from 'jalali-moment';

@Component({
  selector: 'hf-persian-calendar',
  templateUrl: './hf-persian-calendar.component.html',
  styleUrls: ['./hf-persian-calendar.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => HfPersianCalendarComponent),
    multi: true
  }]
})
export class HfPersianCalendarComponent implements ControlValueAccessor, OnInit {
  @ViewChild('modalCalendar') modalCalendar?: TemplateRef<any>;

  @ViewChild('buttonCallendar') buttonCallendar: any;
  @ViewChild('inputCallendar') inputCallendar: any;
  @ViewChild('bodyCallendar') bodyCallendar: any;
  @ViewChild('menuCallendar') menuCallendar: any;

  @ViewChild('rowCallendar') rowCallendar: any;
  @ViewChild('colCallendar') colCallendar: any;


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calcElementRect();
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.remCalendarBody();
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  onGlobalClick(event: any): void {

    if (this.isOpen && !this.buttonCallendar.nativeElement.contains(event.target) && !this.inputCallendar.nativeElement.contains(event.target)) {
      if (this.isOpen && this.isHide && (!this.bodyCallendar.nativeElement.contains(event.target))) {

        this.remCalendarBody();
        this.isOpen = false;
      } else {
        this.isHide = true;
      }
    }

  }

  @Input() disabled?: boolean = false;
  @Input() inputDate?: string;
  @Input() border: boolean = true;
  @Output() onValueChanged = new EventEmitter<string>();

  private embeddedViewRef: any;

  public elementRect: any;
  public width?: string;
  public height?: string;
  public transform?: string;
  public isOpen: boolean = false;
  public isHide: boolean = true;
  public isTop: boolean = true;

  public step: number = 1;

  public listOfDate = new Array<any>();

  public OneTitle: string = "1300";
  public TwoTitle: string = "JAN";

  public dayOfWeek: number = 0;

  public bolDateNow: boolean = false;
  public bolDateSelect: boolean = false;

  public strDateNow: string = "";
  public strDateSelect: string = "";

  private dateNow: string;
  private dateChange?: string;
  private dateSelect?: string;


  private momentNow?: moment.Moment;
  private momentChange?: moment.Moment;
  private momentSelect?: moment.Moment;

  onChange: (_: string) => void = (_: string) => { };
  onTouched: () => void = () => { };


  constructor(
    private viewContainerRef: ViewContainerRef,
    private eRef: ElementRef
  ) {
    this.dateNow = moment().format("jYYYY-jMM-jDD");
  }

  updateChanges() {
    this.onChange(this.inputDate ?? '');
  }

  /**
   * Writes a new item to the element.
   * @param inputDate the value
   */
  writeValue(inputDate: string): void {
    this.inputDate = inputDate;
    this.updateChanges();
  }

  /**
   * Registers a callback function that should be called when the control's value changes in the UI.
   * @param fn
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registers a callback function that should be called when the control receives a blur event.
   * @param fn
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    // setTimeout( () => {
    //   this.isOpen = false;
    //               }, 20000);
  }

  calcElementRect() {
    this.elementRect = this.inputCallendar.nativeElement.getBoundingClientRect();

    this.width = this.elementRect.width + "px";
    this.height = "1px";


    if ((window.innerHeight / 2) > this.elementRect.y) {
      this.isTop = true;
      this.transform = "translate(" + (this.elementRect.x) + "px, " + (this.elementRect.y + (this.elementRect.height + window.scrollY)) + "px)";
    } else {
      this.isTop = false;
      this.transform = "translate(" + (this.elementRect.x) + "px, " + (this.elementRect.y + (window.scrollY)) + "px)";
    }
  }

  addCalendarBody() {
    if (this.modalCalendar) {
      this.embeddedViewRef = this.viewContainerRef.createEmbeddedView(this.modalCalendar);
      this.embeddedViewRef.detectChanges();
      for (let node of this.embeddedViewRef.rootNodes) {
        document.body.appendChild(node);
      }
    }
  }

  remCalendarBody() {
    if (this.embeddedViewRef) {
      this.embeddedViewRef.destroy();
    }
  }

  togglerMenu(e: any) {

    this.inputCallendar.nativeElement.focus();

    if (e !== null) {
      this.calcElementRect();
    }


    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.addCalendarBody()

      this.momentNow = moment(this.dateNow, "jYYYY/jMM/jDD");

      if (this.inputDate == undefined || this.inputDate == null || this.inputDate == "") {
        this.momentChange = moment(this.dateNow, "jYYYY/jMM/jDD");
        this.momentSelect = moment(this.dateNow, "jYYYY/jMM/jDD");

      } else {
        if (moment(this.inputDate, "jYYYY/jMM/jDD").isValid()) {
          this.momentChange = moment(this.inputDate, "jYYYY/jMM/jDD");
          this.momentSelect = moment(this.inputDate, "jYYYY/jMM/jDD");
        } else {
          this.momentChange = moment(this.dateNow, "jYYYY/jMM/jDD");
          this.momentSelect = moment(this.dateNow, "jYYYY/jMM/jDD");
        }
      }

      this.step = 1;
      this.changeList();

    } else {
      this.remCalendarBody();
    }
  }

  cbuttonCallendar() {

    //this.inputCallendar.nativeElement.focus();
    if (this.momentSelect)
      this.dateSelect = this.momentSelect.format("jYYYY/jMM/jDD");
    this.momentChange = moment(this.dateSelect, "jYYYY/jMM/jDD");;
    switch (this.step) {
      case 1: // days
        this.step = 3;
        break;
      case 2: // months
        this.step = 1;
        break;
      case 3: // years
        this.step = 1;
        break;
    }
    this.changeList()
  }

  pbuttonCallendar() {
    switch (this.step) {
      case 1:
        if (this.momentChange)
          this.momentChange.add(-1, 'jMonth');
        break;
      case 2:

        break;
      case 3:
        if (this.momentChange)
          this.momentChange.add(-14, 'jYear');
        break;
    }

    this.changeList()
  }

  nbuttonCallendar() {
    switch (this.step) {
      case 1:
        if (this.momentChange)
          this.momentChange.add(1, 'jMonth');
        break;
      case 2:

        break;
      case 3:
        if (this.momentChange)
          this.momentChange.add(14, 'jYear');
        break;
    }

    this.changeList()
  }

  blurInput(e: any) {

  }

  changeInput(e: any) {
    if (moment(this.inputDate, "jYYYY/jMM/jDD").isValid()) {
      if (typeof this.onChange === 'function') {
        this.onChange(this.inputDate ?? '');
      }
    } else {
      this.inputDate = moment(this.dateNow, "jYYYY/jMM/jDD").format("jYYYY/jMM/jDD").toString();;
      if (typeof this.onChange === 'function') {
        this.onChange(this.inputDate);
      }
    }

    this.onValueChanged.emit(this.inputDate);
  }

  changeList() {
    this.listOfDate = new Array<any>();

    switch (this.step) {
      case 1:
        this.getDays();
        break;
      case 2:
        this.getMonths();
        break;
      case 3:
        this.getYears();
        break;
    }


  }

  getDays() {
    if ((this.momentNow && this.momentChange) &&
      this.momentNow.jYear() === this.momentChange.jYear() &&
      this.momentNow.jMonth() === this.momentChange.jMonth()) {
      this.bolDateNow = true;
      this.strDateNow = String(this.momentNow.jDate()).padStart(2, '0')
    } else {
      this.bolDateNow = false;
    }

    if ((this.momentSelect && this.momentChange) &&
      this.momentSelect.jYear() === this.momentChange.jYear() &&
      this.momentSelect.jMonth() === this.momentChange.jMonth()) {
      this.bolDateSelect = true;
      this.strDateSelect = String(this.momentSelect.jDate()).padStart(2, '0')
    } else {
      this.bolDateSelect = false;
    }

    if (this.momentChange) {

      this.OneTitle = this.getMonthTitle(this.momentChange.jMonth());
      this.TwoTitle = this.momentChange.jYear().toString();


      this.momentChange.jDate(1);
      this.dayOfWeek = this.momentChange.jDay();

      let sDay = this.momentChange.startOf('jMonth').jDate();
      let eDay = this.momentChange.endOf('jMonth').jDate();

      for (let x = 1; x <= this.dayOfWeek; x++) {
        this.listOfDate.push({ 'step': this.step, 'title': String("0").padStart(2, '0'), 'value': 0 });
      }
      for (let x = sDay; x <= eDay; x++) {
        this.listOfDate.push({ 'step': this.step, 'title': String(x).padStart(2, '0'), 'value': x });
      }
    }
  }

  getMonths() {
    if (this.momentNow)
      this.strDateNow = this.getMonthTitle(this.momentNow.jMonth());
    if (this.momentSelect)
      this.strDateSelect = this.getMonthTitle(this.momentSelect.jMonth());

    this.OneTitle = this.getMonthTitle(0);
    this.TwoTitle = this.getMonthTitle(11);


    for (let x = 0; x <= 11; x++) {
      this.listOfDate.push({ 'step': this.step, 'title': this.getMonthTitle(x), 'value': x });
    }
  }

  getYears() {
    if (this.momentNow)
      this.strDateNow = String(this.momentNow.jYear());
    if (this.momentSelect)
      this.strDateSelect = String(this.momentSelect.jYear());

    if (this.momentChange) {
      this.OneTitle = this.momentChange.jYear().toString();
      this.TwoTitle = (this.momentChange.jYear() + 19).toString();


      for (let x = this.momentChange.jYear(); x <= (this.momentChange.jYear() + 14); x++) {
        this.listOfDate.push({ 'step': this.step, 'title': String(x), 'value': x });
      }
    }
  }


  setDate(step: number, value: any) {
    switch (step) {
      case 1:
        this.isHide = true;
        if (this.momentChange)
          this.inputDate = this.momentChange.jYear().toString() + "/" + String(this.momentChange.jMonth() + 1).padStart(2, '0') + "/" + value.title;

        if (typeof this.onChange === 'function') {
          if (this.inputDate)
            this.onChange(this.inputDate);
        }

        this.onValueChanged.emit(this.inputDate);

        this.togglerMenu(null);
        break;
      case 2:
        this.isHide = false;
        if (this.momentChange)
          this.momentChange.jMonth(Number(value.value));
        if (this.momentSelect)
          this.momentSelect.jMonth(Number(value.value));

        this.step = 1;
        this.changeList();
        break;
      case 3:
        this.isHide = false;
        if (this.momentChange)
          this.momentChange.jYear(Number(value.value));
        if (this.momentSelect)
          this.momentSelect.jYear(Number(value.value));

        this.step = 2;
        this.changeList();
        break;
    }
  }

  getMonthTitle(value: number) {
    switch (value) {
      case 0:
        return "فروردین";
      case 1:
        return "اردیبهشت";
      case 2:
        return "خرداد";
      case 3:
        return "تیر";
      case 4:
        return "مرداد";
      case 5:
        return "شهریور";
      case 6:
        return "مهر";
      case 7:
        return "آبان";
      case 8:
        return "آذر";
      case 9:
        return "دی";
      case 10:
        return "بهمن";
      case 11:
        return "اسفند";
      default:
        return "";
    }
  }
}
