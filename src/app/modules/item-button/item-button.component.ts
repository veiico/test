import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';

import { NgModel } from '@angular/forms';
import { distinctUntilChanged, debounceTime, takeWhile, skip, map } from 'rxjs/operators';
import { SessionService } from '../../services/session.service';
import { AppCartService } from '../../components/catalogue/components/app-cart/app-cart.service';
import { AppService } from '../../app.service';
import { CheckOutService } from '../../components/checkout/checkout.service';

@Component({
  selector: 'app-item-button',
  templateUrl: './item-button.component.html',
  styleUrls: ['./item-button.component.scss']
})
export class ItemButtonComponent implements OnInit, AfterViewInit, OnDestroy {
  languageStrings: any={};
  alive: boolean = true;
  @Input('product') product;
  @Input('index') index;
  @ViewChild('input') input: NgModel;
  @Output('quantityChange') quantityChange: EventEmitter<any> = new EventEmitter<any>();

  //loader
  @Input('loaders') loaders;
  showLoader: boolean;

  //remove cart popup
  removeCartItemPopup: boolean = false;
  messageRemoveItem: string = '';
  messageAddItem: string = '';
  selectedCartItemId: number;
  selectedCartItemIndex: number;
  selectedOperationMethod;

  prevoiusQty: number;

  appConfig;
  langJson;

  constructor(private sessionService: SessionService, private cartService: AppCartService,
    private appService: AppService, private checkoutService: CheckOutService) { 
    }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    this.appConfig = this.sessionService.get('config');
    this.langJson = this.appService.getLangJsonData();
    this.subscribeToLoaders();
  }

  private subscribeToLoaders() {
    if (this.loaders) {
      this.loaders.pipe(takeWhile(e => this.alive)).subscribe((e: Set<number>) => {
        this.showLoader = e.has(this.product.id);
        if(this.sessionService.get('remainingMandatoryCategories') == -1){
          this.showLoader = false;
        }
      });
    }
  }

  ngAfterViewInit() {
    this.subscribeToInputChange();
  }

  private subscribeToInputChange() {
    if(!this.input)return;
    this.input.valueChanges.pipe(map(e => +e), distinctUntilChanged(), debounceTime(300), takeWhile(_ => this.alive), skip(1))
      .subscribe(data => {
        this.checkforMinQty(this.product.id, this.index, this.product, 0);
        this.checkforMaxQty(this.product.id, this.index, this.product, 0);
        this.quantityChange.emit(this.product);
      });
  }
  /**
   *  check for min qty on blur and decrement action
   * @param id 
   * @param index 
   * @param product 
   * @param method 0- blur action, 1 - decrement btn action
   */
  checkforMinQty(id, index, product, method) {
    this.selectedOperationMethod = method;
    let minCheck = false;
    if (!method) {
      minCheck = (product.quantity < product.minimum_quantity); //blur condition
    } else {
      minCheck = (product.quantity < product.minimum_quantity); //decrement condition
    }
    if (+product.quantity && (+product.minimum_quantity > 1) && minCheck) {
      this.selectedCartItemId = id;
      this.selectedCartItemIndex = index;
      let msg = this.languageStrings.in_quantity_cannot_less_than_msg || 'In ___ quantity cannot be less than minimum quantity ___. Would you like to remove the product from cart?';
      msg = msg.replace('___', product.name);
      msg = msg.replace('CART_CART', product.name);
      msg = msg.replace('___', product.minimum_quantity);
      this.messageRemoveItem = msg;
      this.removeCartItemPopup = true;
    } else {
      if (!method) {
        this.onBlurFunction(id, index, product.quantity);
      } else {
        this.decreamentQuantity(id, index);
      }
    }
  }


    /**
   *  check for max qty on blur and increment action
   * @param id 
   * @param index 
   * @param product 
   * @param method 0- blur action, 1 - increment btn action
   */
  checkforMaxQty(id, index, product, method) {
    this.selectedOperationMethod = method;
    let maxCheck = false;
    if (product.maximum_quantity > 0 ) {
    if (!method) {
      maxCheck = (product.quantity > product.maximum_quantity); //blur condition
    } else {
      maxCheck = (product.quantity >= product.maximum_quantity); //increment condition
    }
    if (+product.quantity && (+product.maximum_quantity > 1) && maxCheck) {
      this.selectedCartItemId = id;
      this.selectedCartItemIndex = index;
      let msg = 'Quantity cannot be more than maximum quantity';
      this.messageAddItem = msg;
    } else {
      if (!method) {
        this.onBlurFunction(id, index, product.quantity);
      } else {
        this.increaseQuantity(id, index);
      }
    }
  }
  }

  /**
* function to retain input product previous qty
* @param event 
*/
  onFocusQty(event) {
    this.prevoiusQty = event.target.value;
  }


  onBlurFunction(id, index, newValue) {
    let newQuantity = Number(newValue);
    this.cartService.syncProductQuantity(id, index, newQuantity);
  }

  decreamentQuantity(id, index) {
    this.cartService.decreamentQuantity(id, index);
    // this.cartService.currentStatus.subscribe(() => {
    //   this.checkoutService.setAmountData();
    // });
  }
  increaseQuantity(id, index) {
    this.cartService.increaseQuantity(id, index);
    // this.cartService.currentStatus.subscribe(() => {
    //   this.checkoutService.setAmountData();
    // });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
