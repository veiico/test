import { Injectable } from '@angular/core';
import { ApiService } from "../../../../services/api.service";

@Injectable()
export class RestaurantFilterService {

    constructor(private api: ApiService) {
    }

    getFilters(data) {
        const obj = {
            'url': 'vendor/getFilters',
            'body': data,
        };
        return this.api.get(obj);
    }
}
