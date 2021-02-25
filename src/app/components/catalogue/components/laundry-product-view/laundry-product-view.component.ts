/**
 * Created by mba-214 on 23/10/18.
 */
import { Component, HostListener, Input, OnDestroy, OnInit, Inject, Output, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';
import { DOCUMENT } from '@angular/common';
import { AppCartService } from '../app-cart/app-cart.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { SessionService } from '../../../../services/session.service';
import { CartModel } from '../app-cart/app-cart.model';
import { AppService } from '../../../../app.service';
import { GoogleAnalyticsEventsService } from '../../../../services/google-analytics-events.service';
import { GoogleAnalyticsEvent } from '../../../../enums/enum';
import { AppProductComponent } from '../app-product/app-product.component';
import { RestaurantsService } from '../../../restaurants-new/restaurants-new.service';
import { MessageService } from '../../../../services/message.service';
import { CatalogueService } from '../../catalogue.service';
import { ProductTimingService } from '../../../../components/product-timing/product-timing.service';
import { ProductTemplateService } from '../../../product-template/services/product-template.service';
import { ConfirmationService } from '../../../../modules/jw-notifications/services/confirmation.service';
import { MessageType } from './../../../../constants/constant';



declare var $: any;

@Component({
  selector: 'app-laundry-product',
  templateUrl: './laundry-product-view.component.html',
  styleUrls: ['../app-product/app-product.scss', './laundry-product-view.component.scss']
})
export class AppLaundryProductComponent extends AppProductComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  public selectedProductArray: any = [];
  public showProceedButton: boolean;
  public cartData = [];
  public cartValue = 0;
  showProductShareBox: boolean;
  productShareData: any;
  productPosition: any;
  shareUrlSection: boolean;
  mailingLink: string;
  normalCopyLink: string;
  domainName: string;
  @Inject(DOCUMENT) private _document: HTMLDocument;
  showCustomerVerificationPopUp: boolean;
  @Output() askLocation: EventEmitter<null> = new EventEmitter<null>();
  @Input() notDeliverable: boolean;
  showNotAvailable: boolean = false;
  constructor( public productTemplateService : ProductTemplateService,
    public route: ActivatedRoute, public router: Router, public sessionService: SessionService,
              public popup: PopUpService, public cartService: AppCartService,
              public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
              public messageService: MessageService,
              public appService: AppService, public restaurantService: RestaurantsService,
              protected catalogueService: CatalogueService, protected productTimingService: ProductTimingService,public confirmationService : ConfirmationService) {
    super(productTemplateService, route, router, sessionService, popup, cartService, googleAnalyticsEventsService, messageService, appService,restaurantService,catalogueService,productTimingService,confirmationService);


  }

  ngOnInit() {
    let cartData = this.cartService.getCartData();
    this.sessionService.remove('laundryCheckoutSteps');
    this.sessionService.remove('laundryCheckoutData');
    this.appConfig = this.sessionService.get('config');
    if (cartData && cartData.length) {
      cartData.forEach((o) => {
        o.product_id = o.id;
      });
      this.showProceedButton = true;
      this.selectedProductArray = cartData;
    }
    if(this.route.snapshot.queryParams['prodname'] && this.formSetting.is_product_share_enabled)
     this.showProductPop(this.route.snapshot.queryParams['prodname'])
     this.sessionService.langStringsPromise.then(() =>
     {
      this.languageStrings = this.sessionService.languageStrings;
      this.languageStrings.sorry_product_not_available_at_moment = (this.languageStrings.sorry_product_not_available_at_moment || 'Sorry product is not available at the moment.').replace(
        'PRODUCT_PRODUCT',
        this.appConfig.terminology.PRODUCT
      );
      this.languageStrings.no_product_available = (this.languageStrings.no_product_available || 'No Product Available.')
      .replace('PRODUCT_PRODUCT', this.appConfig.terminology.PRODUCT);
     });
    super.ngOnInit();
    this.calculateCartValue();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngOnChanges() {
    super.ngOnChanges();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  /**
   * get selected product
   */
  getProductSelected(product, index, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.selectedProductArray.length) {
      let findProductIndex = this.selectedProductArray.findIndex((o) => {
        return o.product_id === product.product_id;
      })
      if (findProductIndex > -1) {
        this.selectedProductArray.splice(findProductIndex, 1);
        this.decreamentQuantity(product.product_id, index);
      } else {
        this.selectedProductArray.push(product);
        this.checkBusinessTypeBeforeAdding(product, index);
      }
    } else {
      this.selectedProductArray.push(product);
      this.checkBusinessTypeBeforeAdding(product, index);
    }

    if (this.selectedProductArray.length) {
      this.showProceedButton = true;
    } else {
      this.showProceedButton = false;
    }
    this.calculateCartValue();
  }

  onPopUpClose() {
    this.showCustomerVerificationPopUp = false;
    this.router.navigate(['profile']);
  }
  /**
   * go to checkout
   */
  goToCheckout(): any {
    if (!this.sessionService.get('location') || !this.sessionService.get('location').lat || !this.sessionService.get('location').lng) {
      this.askLocation.emit();
      return;
    }

    if (this.sessionService.get('appData') && parseInt(this.sessionService.getString('reg_status')) === 1) {
      if( ( this.sessionService.get('config').is_customer_verification_required ===  1 ) && ( this.sessionService.get('appData').vendor_details.is_vendor_verified !== 1 ) ) {
        this.showCustomerVerificationPopUp = true;
        return false;
      }
      this.toggle.emit();
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.go_to_checkout, 'Go to checkout', '', '');
      this.router.navigate(['payment']);
    } else if (this.sessionService.get('appData') && parseInt(this.sessionService.getString('reg_status')) !== 1 &&
      !this.sessionService.get('appData').signup_template_data.length) {
      this.toggle.emit();
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.go_to_checkout, 'Go to checkout', '', '');
      this.router.navigate(['payment']);
    } else {
      this.messageService.getLoginSignupLocation('From Checkout Button');
      $('#loginDialog').modal('show');
    }
  }

  /**
   * increase quantity
   */
  increaseQuantityLaundry(product, product_id, i, event) {
    // event.stopPropagation();
    const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    if(!(cartProductData && cartProductData[product_id])){
      this.getProductSelected(product, i, event);
      return
    }
    super.increaseQuantity(product, product_id, i);
    this.calculateCartValue();
  }

  /**
   * blur fxn change qty
   */
  onBlurInputFunLaundry(product, product_id, i, quantity, event) {
    if (+quantity) {
      super.onBlurInputFun(product, product_id, i, quantity)
    }else{
      super.onBlurInputFun(product, product_id, i, 1);
      this.getProductSelected(product, i, '');
    }
  }

  /**
   * decrement quantity
   */
  decreamentQuantityLaundry(product_id, i, event,product?) {
    if (this.productQuantity[product_id] > 0) {
      // event.stopPropagation();
      let findProductIndex = this.selectedProductArray.findIndex((o) => {
        return o.product_id === product.product_id;
      })
      this.selectedProductArray.splice(findProductIndex, 1);
      super.decreamentQuantity(product_id, i)
    }
    this.calculateCartValue();
  }

  /**
   * calculate cart value
   */

  calculateCartValue(){
    this.cartValue = 0;
    this.cartData = this.cartService.getCartData();
    if (this.cartData && this.cartData.length) {
      this.cartData.forEach((val: CartModel) => {
        this.cartValue += val.quantity * val.showPrice;
      });
      this.showProceedButton = true;
    }
  }

  /**
   * listen emit event for showing multi images
   */
  showMultiImagesEvent(event) {
    this.showLightBox(event.data);
  }
  showMultiImages(product) {
    if (((product.multi_image_url && product.multi_image_url.length > 0) ||
        (product.multi_video_url && product.multi_video_url.length > 0)) &&
        this.addon_layout_type != 1)
      this.showLightBox(product);
  }
  // product share box
  showProductPop(product) {
    let data = {};
    data["marketplace_reference_id"] = this.formSetting.marketplace_reference_id;
    data["marketplace_user_id"] = this.formSetting.marketplace_user_id;
    data["product_ids_array"] = [product];
    data["user_id"] = this.sessionService.getString("user_id");
    data['date_time'] = new Date().toISOString();
    if (this.sessionService.get("appData")) {
      data["vendor_id"] = this.sessionService.get("appData").vendor_details.vendor_id;
      data["access_token"] = this.sessionService.get("appData").vendor_details.app_access_token;
    }
    this.catalogueService.getProduct(data).subscribe(
      (response) => {
        if (response.status == 200 && response.data && response.data.length == 1)
          this.productShareBox(response.data[0], "");
        else if(response.status == 200 && response.data && response.data.length == 0)
          this.showNotAvailable = true;
        else
          this.removeParams();
      },
      (error) => {
        console.error(error.message);
      }
    );
  }
  productShareBox(product, index) {
    this.productShareData = product;
    this.normalCopyLink = window.location.href + "?prodname=" + this.productShareData.product_id;
    this.domainName = encodeURIComponent(this.normalCopyLink);
    this.mailingLink = `mailto:?subject=${product.name}&body=${this.domainName}`;
    this.showProductShareBox = true;
    this.productPosition = index;
    this.shareUrlSection = false;
  }
  onShareUrl() {
    this.shareUrlSection = true;
  }
  copyText() {
    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.opacity = "0";
    selBox.value = this.normalCopyLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
    this.popup.showPopup(MessageType.SUCCESS, 2000, "Copied", false);
  }
  removeParams() {
    if (this.route.snapshot.queryParams["prodname"])
      this.router.navigate(["."], {
        relativeTo: this.route,
        queryParams: { page: null },
      });
    this.showProductShareBox = false;
    this.showNotAvailable = false;
  }
}
