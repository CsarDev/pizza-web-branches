import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Item } from './item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  getItemList(orderId: number) {
   return this.http.get(environment.apiURL + '/orders/' + orderId + '/items').toPromise();
  }

  editOrderItem(orderId: number, item: Item) {
    const url = environment.apiURL + '/orders/' + orderId + '/items/' + item.orderItemId;
    return this.http.put(url, item).toPromise();
  }

  addOrderItem(orderId: number, item: Item) {
    const url = environment.apiURL + '/orders/' + orderId + '/items';
    return this.http.post(url, { itemCode: item.itemCode, quatity: item.quantity, description: item.description}).toPromise();
  }

  deleteOrderItem(orderId: number, item: Item) {
    const url = environment.apiURL + '/orders/' + orderId + '/items/' + item.orderItemId;
    return this.http.delete(url).toPromise();
  }
}
