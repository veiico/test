import { Component, OnInit, OnDestroy} from '@angular/core';
import { ModalType, MessageType } from '../../../../constants/constant';
import { CheckOutService } from '../../../../components/checkout/checkout.service';
import { AppCartService } from '../app-cart/app-cart.service';
import { SessionService } from '../../../../services/session.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { LoaderService } from '../../../../services/loader.service';
import { CatalogueService } from '../../catalogue.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { ISubscription } from "rxjs/Subscription";
import { AppService } from '../../../../../app/app.service';
enum TabState {
  COLLAPSED = 'collapsed',
  EXPANDED = 'expanded'
}
@Component({
  selector: 'app-mandatory-items',
  templateUrl: './mandatory-items.component.html',
  styleUrls: ['./mandatory-items.component.scss'],
})
export class MandatoryItemsComponent implements OnInit,OnDestroy {
  showMandatoryItems: boolean;
  mandatoryCategoryData: any;
  modalType = ModalType.MEDIUM;
  showloader: boolean;
  formSettings:any;
  checkCartData: any;
  cardInfo;
  productList = [];
  isSingleCategoryMandatory : boolean ;
  tabs = [];
  tabState: TabState = TabState.COLLAPSED;
  activeIndex: number;
  subscriptionFromCheckout : ISubscription;
  subscriptionFromCart : ISubscription;
  billBreakdownHit: boolean;
  terminology;
  popupOnCheckout: boolean;
  public langJson: any = {};
  languageStrings: any={};
    constructor(protected checkoutService: CheckOutService, protected popUpService: PopUpService,protected loader: LoaderService , protected sessionService: SessionService, protected cartService:AppCartService, protected catalogueService: CatalogueService,  protected popup: PopUpService, protected appService: AppService) {
  }

  ngOnInit() {
    this.formSettings = this.sessionService.get('config');
    if (this.formSettings.terminology) {
      this.terminology = this.formSettings.terminology;
    }
    this.cardInfo =  this.sessionService.get('info');
    this.subscriptionFromCheckout =this.checkoutService.getMandatoryItems.pipe(distinctUntilChanged()).subscribe(res =>{
      this.popupOnCheckout = false;
      this.productList =[];
      this.billBreakdownHit = true;
      if(res==false){
        this.showMandatoryItems = false;
      }
      else{
        this.checkoutService.billbreakdownHitPermission(false);
        this.getMandatoryItems(res.data.result);
      }
    });
    this.subscriptionFromCart = this.cartService.mandatoryItems.pipe(distinctUntilChanged()).subscribe(res =>{
      this.billBreakdownHit = false;
      this.popupOnCheckout = true;
      this.productList =[];
      if(res == null){
        this.showMandatoryItems = false;
      }
      else{
        this.getMandatoryItems(res);
      }
    }

    )
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.select_atleast_one_product_from_listed_items = (this.languageStrings.select_atleast_one_product_from_listed_items || 'Select atleast one product from listed items').replace(
      'PRODUCT_PRODUCT',
      this.formSettings.terminology.PRODUCT
    );
    });
  }
  getMandatoryItems(response){
    this.showMandatoryItems = true;
    this.mandatoryCategoryData = response;
    this.isSingleCategoryMandatory = this.mandatoryCategoryData.length < 2  ? true : false;
    this.tabs = [];
    this.activeIndex = 0;
    for(var i=0; i<this.mandatoryCategoryData.length;i++){
      this.getProducts(this.mandatoryCategoryData[i])
      this.tabs.push({
        label : this.mandatoryCategoryData[i].name
      });
    }
  }
  hideMandatoryItems(){
    this.showMandatoryItems = false;
  }

   getProducts(item) {
    const data ={
      marketplace_reference_id : this.formSettings.marketplace_reference_id,
      marketplace_user_id : this.formSettings.marketplace_user_id,
      user_id : item.user_id,
      date_time : new Date().toISOString(),
      parent_category_id: item.catalogue_id || '',
    };
    if (this.sessionService.get('appData')) {
      data['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      data['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.catalogueService.getProduct(data).subscribe(
      response => {
        // if (this.restaurantInfo && this.restaurantInfo.business_type === 2) {
        //   for (let i = 0; i < response.data.length; i++) {
        //     response.data[i].inventory_enabled = 0;
        //   }
        // }
        for (let i = 0; i < response.data.length; i++) {
          response.data[  
            i
          ].long_description = this.catalogueService.convertStringToBreakHTML(
            response.data[i].long_description
          );
          if (
            response.data[i].thumb_list &&
            (!response.data[i].thumb_list['400x400'] ||
              response.data[i].thumb_list['400x400'] === '')
          ) {
            response.data[i].thumb_list = null;
          } else if (!response.data[i].thumb_list) {
            response.data[i].thumb_list = null;
          }
        }
        this.checkCartData = this.cartService.getCartData();
        // this.data.product = response;
        // this.updateData(this.data);
        if (response.status === 200) {
          let productData = this.sessionService.getByKey('app', 'product');
          if (productData) {
            productData[data.parent_category_id] = response.data;
          } else {
            productData = {};
            productData[data.parent_category_id] = response.data;
          }
          this.sessionService.setByKey('app', 'product', productData);
          this.productList = productData[this.mandatoryCategoryData[0].catalogue_id];
        } else {
          this.popUpService.showPopup(MessageType.ERROR, 2000, response.message, false);
        }
        this.loader.hide();
      },
      error => {
        this.loader.hide();
        this.popUpService.showPopup(MessageType.ERROR, 2000, error.message, false);
        this.showloader = false;
      }
    );
  }

  onItemClick(e: Event, index: number) {
    let productData = this.sessionService.getByKey('app', 'product');
    e.stopPropagation();
    this.tabState = this.tabState === TabState.COLLAPSED ? TabState.EXPANDED : TabState.COLLAPSED;
    this.activeIndex = index;
    this.productList = productData[this.mandatoryCategoryData[index].catalogue_id];
  }

  hidePopup(){
    if(!this.checkForMandatoryCatagories()){
      let msg = this.languageStrings.select_alteast_one_listed_items || 'Select atleast one product from listed items';
      msg = msg.replace('PRODUCT_PRODUCT',this.formSettings.terminology['PRODUCT']);
      this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
      return ;
    }
    this.showMandatoryItems = false;
    this.checkoutService.billbreakdownHitPermission(true);
    if(this.billBreakdownHit){
      this.catalogueService.cartDataChanged();
    }
  }

  closePopup(){
    this.showMandatoryItems = false;
  }
  checkForMandatoryCatagories(){
    const cartData = this.cartService.getCartData();
    let mandatoryCategoryList = this.sessionService.get('requiredCategories');
    let categoriesInCart = [];
    if(!mandatoryCategoryList.length){
      return true;
    }
    cartData.forEach(element => {
      if(!categoriesInCart.includes(element.category_id)){
        categoriesInCart.push(element.category_id);
      }
    });
    let arr = mandatoryCategoryList.filter(obj=>categoriesInCart.indexOf(obj.catalogue_id)==-1);
    if(arr.length){
      return false;
    }
    return true;
  }

  ngOnDestroy(){
    this.subscriptionFromCart.unsubscribe();
    this.subscriptionFromCheckout.unsubscribe();
  }
}
