import { Injectable, EventEmitter } from '@angular/core';
import { Observable ,  Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class MessageService {
  private subjectLat = new Subject<any>();
  private subjectInfo = new Subject<any>();
  private subjectProfile = new Subject<any>();
  private subjectLogged = new Subject<any>();
  private subjectForm = new Subject<any>();
  private alertPush = new Subject<any>();
  private sendBussinessToMap = new Subject<any>();
  public sendBussinessToBanner = new Subject<any>();
  private mapView = new Subject<any>();
  private mapLatLng = new Subject<any>();
  private sendDataRadius = new Subject<any>();
  public merchantFilterEnabled: boolean = false;
  public showLoginPopup: boolean = false; 

  addNotificationData: EventEmitter<any> = new EventEmitter<any>();
  showOrderData: EventEmitter<any> = new EventEmitter<any>();
  setCityInParent: EventEmitter<any> = new EventEmitter<any>();
  openSignUp: EventEmitter<any> = new EventEmitter<any>();
  openOtp: EventEmitter<any> = new EventEmitter<any>();
  profilePhoneUpdate: EventEmitter<any> = new EventEmitter<any>();
  storageRemovedUpdate: EventEmitter<any> = new EventEmitter<any>();
  clearCartData: EventEmitter<any> = new EventEmitter<any>();
  sendIndex: EventEmitter<any> = new EventEmitter<any>();
  userLoggedIn: EventEmitter<any> = new EventEmitter<any>();
  openDiffrentAccount: EventEmitter<any> = new EventEmitter<any>();
  userLoggedOut: EventEmitter<any> = new EventEmitter<any>();
  sendDelivery: EventEmitter<any> = new EventEmitter<any>();
  sendBusinessCategoryId: EventEmitter<any> = new EventEmitter<any>();
  // mapLatLng: EventEmitter<any> = new EventEmitter<any>();
  sendCategoryNameLabel: EventEmitter<any> = new EventEmitter<any>();
  getCategoryFiltersEvent: EventEmitter<any> = new EventEmitter<any>();
  applyFilterEvent: EventEmitter<any> = new EventEmitter<any>();
  showFilterIcon: EventEmitter<any> = new EventEmitter<any>();
  sendRentalFilter: EventEmitter<any> = new EventEmitter<any>();
  sendLocationOfLoginSignup: EventEmitter<any> = new EventEmitter<any>();
  getMapView = this.mapView.asObservable();
  getLatlng = this.mapLatLng.asObservable();
  getChangedRadius = this.sendDataRadius.asObservable();
  getBussinessData = this.sendBussinessToMap.asObservable();
  noProductCustomOrder: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  merchantsLoaded = new Subject<boolean>();
  businessCategoryPageHidden = new Subject<boolean>();
  merchantList= new Subject<boolean>();
  openLoginModal: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  onOtpModalClose:  EventEmitter<any> = new EventEmitter<any>();
  onLocationChange: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  templateListData = new Subject<number>();
  templateFormData = new Subject<boolean>();
  public BannerList: BehaviorSubject<any> = new BehaviorSubject<any> (null);

  public emitCvvForFAC = new Subject<any>();
  sendMessage(lat: string, lng: string, city: string, search_text: string) {
    this.subjectLat.next({ lat: lat, lng: lng, city: city, text: search_text });
  }
  public emitNumberForPaytm = new Subject<any>();
  getMessage(): Observable<any> {
    return this.subjectLat.asObservable();
  }
  

  loginWithDiffrentAccountEmitter() {
    this.openDiffrentAccount.emit();
  }
  emitOpenLoginModalBheavior(value : boolean){  
    this.showLoginPopup = value;  
    this.openLoginModal.next(this.showLoginPopup);
  }
  setRestaurantInfo(data: object) {
    this.subjectInfo.next(data);
  }

  getRestaurantData(): Observable<any> {
    return this.subjectInfo.asObservable();
  }

  sendProfileName(name: string) {
    this.subjectProfile.next({ name: name });
  }

  getProfileName(): Observable<any> {
    return this.subjectProfile.asObservable();
  }

  sendLoggedIn(bool: boolean) {
    this.subjectLogged.next({ logged: bool });
    this.userLoggedIn.emit();
  }

  getLoggedStatus(): Observable<any> {
    return this.subjectLogged.asObservable();
  }

  sendClearForm() {
    this.subjectForm.next();
  }

  getClearForm(): Observable<any> {
    return this.subjectForm.asObservable();
  }

  addNotification(data) {
    this.addNotificationData.emit(data);
  }
  showOrderDetail(data) {
    this.showOrderData.emit(data);
  }
  setCityInRestaurant(data) {
    this.setCityInParent.emit(data);
  }
  openSignUpPage(data) {
    this.openSignUp.emit(data);
  }
  openOtpPage(data){
    this.openOtp.emit(data);
  }
  profilePhone(data) {
    this.profilePhoneUpdate.emit(data);
  }
  storageRemoved(data) {
    this.storageRemovedUpdate.emit(data);
  }

  clearCartOnly() {
    this.clearCartData.emit();
  }

  sendProductIndexToDetails(data) {
    this.sendIndex.emit(data);
  }

  logoutUser() {
    this.userLoggedOut.emit();
  }
  sendAlert(obj: Object) {
    this.alertPush.next(obj);
  }

  getAlert() {
    return this.alertPush.asObservable();
  }
  sendDeliveryMode(data) {
    this.sendDelivery.emit(data);
  }

  sendBusinessCategory(data) {
    this.sendBusinessCategoryId.emit(data);
  }

  sendCategoryName(categoryName: string) {
    this.sendCategoryNameLabel.emit(categoryName);
  }

  applyFilters(data) {
    this.applyFilterEvent.emit(data);
  }

  rentalFilter(data) {
    this.sendRentalFilter.emit(data);
  }

  getLoginSignupLocation(data) {
    this.sendLocationOfLoginSignup.emit(data);
  }

  sendDataToMap(data) {
    this.sendBussinessToMap.next(data);
  }
  sendDataToBanner(data) {
    this.sendBussinessToBanner.next(data);
  }
  mapListCheck(data) {
    this.mapView.next(data);
  }
  sendRadius(data) {
    this.sendDataRadius.next(data);
  }
  sendLatlng(data1, data2 ) {
   let val = {
      lat: data1,
      lng: data2
    };
    this.mapLatLng.next(val);
  }
}

