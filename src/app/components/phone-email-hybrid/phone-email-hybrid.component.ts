
import { distinctUntilChanged, debounceTime, takeWhile } from 'rxjs/operators';
import { Component, Input, forwardRef, OnInit, ElementRef, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormBuilder, NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import { country, COUNTRY_NAME } from '../../constants/constant';
import { SessionService } from "../../services/session.service";
import { ValidationService } from '../../services/validation.service';
import { FuguIntelInputService } from '../fugu-tel-input/fugu-tel-input.service';

@Component({
    selector: 'app-phone-email-hybrid',
    templateUrl: './phone-email-hybrid.component.html',
    styleUrls: ['./phone-email-hybrid.component.scss', '../fugu-tel-input/fugu-tel-input.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PhoneEmailHybridComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => PhoneEmailHybridComponent),
            multi: true,
        }
    ]
})
export class PhoneEmailHybridComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy {
    config: any;
    public languageSelected: any;
    public direction = 'ltr';
    globalListenFunc: Function;
    countries = country.countries
    form: FormGroup
    onChange: any = () => { };
    onTouched: any = () => { };
    isPhone: boolean;
    showList: boolean;
    serachText
    @ViewChild('scrollElement') protected scrollElement: ElementRef;
    selectedCountryCode;
    @Input() dialCode;
    countryName = COUNTRY_NAME
    alive: boolean = true;
    countryData: {};
    public languageStrings: any={};
    constructor(protected renderer: Renderer2, public sessionService: SessionService, public formBuilder: FormBuilder, protected fuguIntelInputService: FuguIntelInputService) {
        this.countries = country.countries;
        this.config = this.sessionService.get('config');
        if(this.config && (this.config.marketplace_user_id==147002 || this.config.marketplace_user_id==756236 || this.config.marketplace_user_id==53417))
        {
          this.countries.forEach((element, index) => {
            if (element.countryCode === 'eh') {
              this.countries.splice(index, 1);
            }
          });
        }
    }

    /**
     * function to update model value in parent foerm controls as value in child change
     * @param fn prebuilt fxn by angular forms ControlValueAccessor
     */
    registerOnChange(fn:any) {
        this.onChange = fn;

    }

    /**
    * function to mark touch in parent form control
    * @param fn prebuilt fxn by angular forms ControlValueAccessor
    */

    registerOnTouched(fn) {
        this.onTouched = fn;
    }


    /**
     * called when parent explicilty pass value in control
     * @param value form parent
     */

    writeValue(value) {
        this.form.controls.phone_email.setValue(value);
    }

    /**
     * custom errors to be show to parent from child  after implementing Validators in child component class
     * @param c form control by parent
     */

    public validate(c: FormControl) {
        return this.form.controls.phone_email.errors;
    }


    ngOnInit() {
        this.sessionService.langStringsPromise.then(() =>
      {
       this.languageStrings = this.sessionService.languageStrings;
      });
        let index = this.countries.findIndex((o) => { return o.dialCode === this.dialCode });
        this.selectedCountryCode = this.countries[index].countryCode;
        this.form = this.formBuilder.group({
            'phone_email': ['', [ValidationService.HybridEmailPhone('is_phone', 'value', 'country_code')]],
            'is_phone': [''],
            'value': [],
            'country_code': ['+' + this.dialCode]
        });
        this.sessionService.countryInfo.pipe(takeWhile(_ => this.alive)).subscribe((resp)=>{
            this.countryData=resp;
          });
      this.getRegionDataTookan();
        this.form.get('phone_email').valueChanges.pipe(distinctUntilChanged()).subscribe((res) => {
            this.updateValue();
        })
        this.getRegionDataTookan();

    }


    enableKeypress() {
        this.globalListenFunc = this.renderer.listen('document', 'keypress', e => {
            this.serachText += e.key;
            if (e.keyCode === 27) {
                this.showList = false;
                this.disableKeypress();
            }
            this.scrollDown();
        });
    }
    disableKeypress() {
        if (this.globalListenFunc)
            this.globalListenFunc();
        this.serachText = '';
    }

    /**
     * function to implement when country is selected
     * @param country
     */

    flagSelect(country) {
        this.showList = false;
        this.disableKeypress();
        this.form.controls.country_code.setValue('+' + country.dialCode);
        if (this.form.controls.is_phone) {
            this.form.controls.value.setValue(this.form.controls.country_code.value + ' ' + this.form.controls.phone_email.value);
        }
        this.selectedCountryCode = country.countryCode;
        this.dialCode = country.selectedDialCode;
        this.updateValue()
    }

    toggleShowList() {
        this.showList = !this.showList;
        if (this.showList) {
            this.enableKeypress();
        } else {
            this.disableKeypress();
        }
    }

    protected scrollDown() {
        this.scrollElement.nativeElement.scrollTop = 0;
        const str = this.serachText.toLowerCase();
        if (str === '') { return; }
        let found = false;
        let index;
        for (let i = 0; i < this.countries.length; i++) {
            const countryCode = this.countries[i].countryCode.toLowerCase();
            if (countryCode.startsWith(str)) {
                found = true;
                index = i;
                break;
            }
        }
        if (!found) {
            this.serachText = '';
        } else {
            const elHeight = 66;
            const scrollTop = this.scrollElement.nativeElement.scrollTop;
            const viewport = scrollTop + this.scrollElement.nativeElement.offsetHeight;
            const elOffset = elHeight * (index - 1);
            this.scrollElement.nativeElement.scrollTop += elOffset;
        }
    }

    /**
     * function executed when any change in input occurs
     * function updates value in  parent form via onChange function
     */

    updateValue() {
        if (this.form.value.phone_email !== '') {
            this.onChange({ value: this.form.value.value, is_phone: this.form.value.is_phone });
        } else {
            this.onChange('')
        }

    }
    getRegionDataTookan() {
        if (!this.sessionService.isPlatformServer()) {
          this.fuguIntelInputService.getCountryData()
          .subscribe((response: any) => {
              if (response.status === 200) {

                this.sessionService.countryInfo.next(response.data);
                let index = this.countries.findIndex((o) => { return o.countryCode === response.data.country_code.toLowerCase(); })

                if (index > -1) {
                    this.flagSelect(this.countries[index]);
                }
              } else {
              }
            });
        }
       
      }
    /**
     * get default country by ip from tookan
     */

    // getRegionDataTookan() {
    //     if(this.countryData && this.countryData['country_code']){
    //         console.log("asdhjasf",this.countryData)
    //         let index = this.countries.findIndex((o) => { return o.countryCode === this.countryData['country_code'].toLowerCase(); })

    //         if (index > -1) {
    //             this.flagSelect(this.countries[index]);
    //         }
    //     } 
    //     // else {
    //     //     if (!this.sessionService.isPlatformServer()) {
    //     //         this.fuguIntelInputService.getCountryData()
    //     //         .subscribe(response => {
    //     //             if (response.status === 200) {
    //     //                 console.log('2', response.data);
    //     //                 this.sessionService.countryInfo.next(response.data);
    //     //                 let index = this.countries.findIndex((o) => { return o.countryCode === response.data.country_code.toLowerCase(); })
    //     //                 if (index > -1) {
    //     //                     this.flagSelect(this.countries[index]);
    //     //                 }
    //     //             } else {
    //     //             }
    //     //         });
    //     //     }
    //     // }
      
    // }
    ngOnDestroy() {
        this.alive = false;
    }
}
