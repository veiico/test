import { HttpParameterCodec } from "@angular/common/http";

export class HttpParamEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    try{
    return encodeURIComponent(value.toString());
    }
    catch(e){
      return encodeURIComponent(value);
    }
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}