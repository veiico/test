import { Injectable, EventEmitter } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { MessageService } from "../../services/message.service";
import { Observable } from "rxjs";
import { SessionService } from "../../services/session.service";
import { Http, Headers } from "@angular/http";

@Injectable()
export class FavLocationService {
  public selectedFavAddressId;
  saveLocal: EventEmitter<any> = new EventEmitter<any>();
  selectAddress: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private api: ApiService,
    private messageService: MessageService,
    private sessionService: SessionService
  ) {}

  selectDefaultAddress(data){
    this.selectAddress.emit(data);
  }
  saveAddress(data) {
    const headers = new Headers();
    const obj = {
      url: "add_fav_location",
      body: data,
      type: 2,
      headers: headers
    };
    return this.api.post(obj);
  }
  deleteAddress(data) {
    const headers = new Headers();
    const obj = {
      url: "delete_fav_location",
      body: data,
      type: 2,
      headers: headers
    };
    return this.api.post(obj);
  }
  editAddress(data) {
    const headers = new Headers();
    const obj = {
      url: "edit_fav_location",
      body: data,
      type: 2,
      headers: headers
    };
    return this.api.post(obj);
  }

  fetchAddresses(data) {
    const headers = new Headers();
    const obj = {
      url: "get_fav_location",
      body: data,
      type: 2,
      headers: headers
    };
    return this.api.post(obj);
  }
}
