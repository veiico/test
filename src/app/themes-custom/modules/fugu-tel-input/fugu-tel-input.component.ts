import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  NgZone,
  Input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FuguTelInputComponent } from '../../../components/fugu-tel-input/fugu-tel-input.component';
import { FuguIntelInputService } from '../../../components/fugu-tel-input/fugu-tel-input.service';
import { MessageService } from '../../../services/message.service';
import { SessionService } from '../../../services/session.service';


@Component({
  // selector: 'app-fugu-tel-input',
  templateUrl: '../../../components/fugu-tel-input/fugu-tel-input.component.html',
  styleUrls: ['../../../components/fugu-tel-input/fugu-tel-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicFuguTelInputComponent),
      multi: true
    }
  ]
})
export class DynamicFuguTelInputComponent extends FuguTelInputComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {

  @Output() phoneValueChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() set textValue(val: any) {
    this.value = val
  }
  @Input() set country_code(val:any){
    if(val){
      this.changeCountryCodeManuallyViaElement(val);
    }
  }


  constructor(protected renderer: Renderer2, public messageService: MessageService, public sessionService: SessionService,
    protected fuguIntelInputService: FuguIntelInputService, protected ref: ChangeDetectorRef, protected ngZone: NgZone) {
    super(renderer, messageService, sessionService, fuguIntelInputService, ref)
  }

  ngOnInit() {
    super.ngOnInit()
  }

  /**
   * ngOnChanges oveerride
   */

  ngOnChanges(changes: SimpleChanges) {
    this.ngZone.run(() => {
      let dialCode;
      if (changes.dialCode && changes.dialCode.currentValue) {
        dialCode = changes.dialCode.currentValue.detail
        this.dialCode = dialCode;
      }

      if (dialCode) {
        this.findPrefix(dialCode);
      }

      if (this.phone) {
        this._value = this.phone;
      } else if (this.phone === '') {
        this._value = '';
      }
    })

  }

  /**
   * flagselect
   */

  flagSelect(country: any) {
    super.flagSelect(country)
    this.updateValue();
  }



  /**
   * update value
   */


  updateValue() {
    if (this.value && this.value.startsWith('+')) {
      this.findPrefix(this.value.split('+')[1]);
    }

    if (!this.value) {
      this.value = '';
    }

    this.value = this.value.replace(/ /g, '');
    this.onChange(this.value);
    this.onTouched();
    this.dialCode = this.selectedDialCode;
    this.dialCodeChange.emit(this.dialCode);
    let phoneValue: any;

    if (this.value && this.dialCode) {
      phoneValue = `+${this.dialCode} ${this.value}`
    } else {
      phoneValue = null
    }

    const data = {
      dialCode: this.dialCode,
      value: this.value,
      phoneValue: phoneValue
    }
    this.phoneValueChange.emit(data);
  }

  writeValue(value) {
    if (value) {
      this._value = value;
    }
    if (value && value.startsWith('+')) {
      this.findPrefix(value.split('+')[1]);
      if (this.selectedDialCode) {
        this._value = this.value.replace('+' + this.selectedDialCode, '');
      }
    }

    this.dialCode = this.selectedDialCode;
    this.dialCodeChange.emit(this.dialCode);
  }

  ngOnDestroy() {
    this.alive = false;
  }

  /**
   * manually set country code from custom element
   */
  changeCountryCodeManuallyViaElement(val) {
    if (this.countries) {
      let index = this.countries.findIndex((o) => { return o.dialCode == val });
      if (index > -1) {
        this.selectedCountryCode = this.countries[index].countryCode;
        this.selectedDialCode = this.countries[index].dialCode;
      }
    }
  }

}
