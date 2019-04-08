import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from './order.model';
import { Item } from './item.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  formData: Order;
  orderItems: Item[];

  constructor(private http: HttpClient) { }

  saveOrUpdateOrder() {
    this.formData.items = this.orderItems;
    const data = {
      restaurantCode: this.formData.restaurantCode,
      items: this.orderItems.map(x => ({ itemCode: x.itemCode, description: x.description, quantity: x.quantity}))
    }
    var body = {
      ...data,
    };
    return this.http.post(environment.apiURL + '/orders', body);
  }

  getOrderList() {
    return this.http.get(environment.apiURL + '/orders').toPromise();
  }

  getOrderByID(id: number): any {
    return this.http.get(environment.apiURL + '/orders/' + id).toPromise();
  }

  deleteOrder(id: number) {
    return this.http.delete(environment.apiURL + '/orders/' + id).toPromise();
  }

}
