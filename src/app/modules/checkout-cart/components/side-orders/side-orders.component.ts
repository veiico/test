import { Component, OnInit, VERSION, Input, ViewChild, HostListener, EventEmitter, Output } from '@angular/core';
import { SessionService } from '../../../../services/session.service';

@Component({
    selector: 'app-side-orders',
    templateUrl: 'side-orders.html',
    styleUrls: ['./side-orders.scss']
})

export class SideOrdersComponent {

    languageStrings: any={};
    @ViewChild('sideOrdersWrapper') public sideOrdersWrapper: any;
    // @ViewChild('multiImagesSlider') public _imageSlider: any;
    @ViewChild('sideOrdersDiv') public sideOrdersDiv: any;
    @ViewChild('productDiv') public productDiv: any;

    public translateWidth: number = 0;

    public disableLeftButton: boolean = true;
    public disableRightButton: boolean = true;
    public sideOrdersWrapperElement;
    public sideOrdersElement;
    public productDivElement;

    public currency;
    public lastScrolledWidth;

    @Output() addProduct: EventEmitter<any> = new EventEmitter<any>();

    @Input() sideOrders: Array<any>;
    public appConfig;

    constructor(protected sessionService: SessionService, ) {
       
    }
    ngOnInit() {
        this.appConfig = this.sessionService.get('config');
        this.sessionService.langStringsPromise.then(() =>
        {
         this.languageStrings = this.sessionService.languageStrings;
        });
        // this.currency = this.appConfig.payment_settings[0].symbol;
    }

    initSideOrder(){
        this.disableLeftButton = true;
        this.disableRightButton = true;
        if (this.sideOrdersElement && (this.sideOrdersElement.scrollWidth > (this.sideOrdersWrapperElement.offsetWidth+20))) {
            this.disableRightButton = false;
        }
        this.translateWidth = 0;
        this.sideOrdersElement.style.transform = 'translatex(0px)';
        this.sideOrdersWrapperElement.style.transform = 'translatex(0px)';
    }

    ngAfterViewInit() {
        this.getCurrency(this.sideOrders);
        this.disableLeftButton = true;
        this.disableRightButton = true;
        this.sideOrdersWrapperElement = this.sideOrdersWrapper.nativeElement;
        this.sideOrdersElement = this.sideOrdersDiv.nativeElement;
        this.productDivElement = this.productDiv.nativeElement;
        
        setTimeout(() => {
            if (this.sideOrdersElement.scrollWidth > (this.sideOrdersWrapperElement.offsetWidth+20)) {
                this.disableRightButton = false;
            }
        });
       
    }

    addSideOrder(product, index) {
        const obj = {
            product: product,
            index: index
        }
        this.sideOrders.splice(index, 1);
        this.addProduct.emit(obj);

        setTimeout(() => {
            this.initSideOrder();
        })
    }

    slideRight(e) {

        e.stopPropagation();
        let count = Math.floor(this.sideOrdersWrapperElement.offsetWidth / (this.productDivElement.offsetWidth + 20));

        let scrollWidth: any = ((count) * (this.productDivElement.offsetWidth + 20));

        if (this.disableLeftButton) {
            this.disableLeftButton = false;
        }


        if (((this.sideOrdersElement.scrollWidth) - (this.translateWidth + scrollWidth)) < this.sideOrdersWrapperElement.offsetWidth) {
            let scrolled = (this.sideOrdersElement.scrollWidth) - (this.translateWidth + this.sideOrdersWrapperElement.offsetWidth);
            this.translateWidth += (scrolled - 20);
            this.lastScrolledWidth = (scrolled - 20);
            this.disableRightButton = true;
            this.sideOrdersElement.style.transform = 'translatex(-' + this.translateWidth + 'px)';
        }
        else {

            this.translateWidth += scrollWidth;
            this.sideOrdersElement.style.transform = 'translatex(-' + this.translateWidth + 'px' + ')';
            if (((this.sideOrdersElement.scrollWidth) - (this.translateWidth + scrollWidth)) == 0) {
                this.disableRightButton = true;
            }
        }
    }


    slideLeft(e) {
        e.stopPropagation();

        /**
         * width relative to screen size i.e how many divs are visible properly in screen
         */
        let count = Math.floor(this.sideOrdersWrapperElement.offsetWidth / (this.productDivElement.offsetWidth + 20));
        let scrollWidth: any = (count) * (this.productDivElement.offsetWidth + 20);

        if (this.disableRightButton) {
            this.disableRightButton = false;
            scrollWidth = this.lastScrolledWidth;
        }


        if ((this.translateWidth - scrollWidth) < 0) {
            // let scrolled = this.sideOrdersElement.scrollWidth - (this.translateWidth + scrollWidth) + 'px';
            this.disableLeftButton = true;
            this.translateWidth = 0;
            this.sideOrdersElement.style.transform = 'translatex(-' + this.translateWidth + 'px)';
        }
        else {

            this.translateWidth -= scrollWidth;
            this.sideOrdersElement.style.transform = 'translatex(-' + this.translateWidth + 'px' + ')';
            if (this.translateWidth == 0) {
                this.disableLeftButton = true;
            }
        }
    }

    @HostListener('window:resize', ['$event']) onWindowResize(event) {

        this.initSideOrder();
    }

    ngOnChanges(inputProps){
        let sideOrders = inputProps.sideOrders;
        if(!sideOrders.firstChange && sideOrders.currentValue && sideOrders.currentValue.length>0){
            this.sideOrders = sideOrders.currentValue;
            setTimeout(()=>{
                this.initSideOrder();
            });
           
        }
    }

    getCurrency(productList){
        this.currency = (this.sessionService.get('config').is_multi_currency_enabled && productList && productList[0] && productList[0].payment_settings) ? productList[0].payment_settings.symbol : this.sessionService.get('config')['payment_settings'][0].symbol;
      }
}
