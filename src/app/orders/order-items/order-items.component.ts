import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { OrderItem } from 'src/app/shared/order-item.model';
import { ItemService } from 'src/app/shared/item.service';
import { Item } from 'src/app/shared/item.model';
import { NgForm } from '@angular/forms';
import { OrderService } from 'src/app/shared/order.service';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styles: []
})
export class OrderItemsComponent implements OnInit {
  formData: Item;
  itemList: Item[];
  isValid: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<OrderItemsComponent>,
    private itemService: ItemService,
    private orderSevice: OrderService) { }

  ngOnInit() {
    if (this.data.OrderID) {
      this.itemService.getItemList(this.data.OrderID).then(res => this.itemList = res as Item[]);
    } else {
      this.itemList = [];
    }
    if (this.data.orderItemIndex == null) {
      this.formData = {
        orderItemId: null,
        itemCode: '',
        description: '',
        quantity: 0,
        orderId: this.data.OrderID,
        Price: 0,
        Total: 0
      };
    } else {
      this.formData = Object.assign({}, this.orderSevice.orderItems[this.data.orderItemIndex]);
    }
  }

  updatePrice(ctrl) {
    if (ctrl.selectedIndex === 0) {
      this.formData.Price = 0;
      this.formData.description = '';
    } else {
      this.formData.Price = this.itemList[ctrl.selectedIndex - 1].Price;
      this.formData.description = this.itemList[ctrl.selectedIndex - 1].description;
    }
    this.updateTotal();
  }

  updateTotal() {
    this.formData.Total = parseFloat((this.formData.quantity * this.formData.Price).toFixed(2));
  }

  onSubmit(form: NgForm) {
    if (this.validateForm(form.value)) {
      if (this.data.OrderID == null) {
        this.orderSevice.orderItems.push(form.value);
        this.dialogRef.close();
      } else {
        if (this.data.orderItemIndex == null) {
          this.itemService.addOrderItem(form.value.orderId, form.value).then((x) => {
            this.orderSevice.orderItems.push(form.value);
            this.dialogRef.close();
          });
        } else {
          this.itemService.editOrderItem(form.value.orderId, form.value).then((x) => {
            this.orderSevice.orderItems[this.data.orderItemIndex] = form.value;
            this.orderSevice.formData.items[this.data.orderItemIndex] = form.value;
            this.dialogRef.close();
          });
        }
      }
    }
  }

  validateForm(formData: OrderItem) {
    this.isValid = true;
    if (formData.ItemID == 0) {
      this.isValid = false;
    } else if (formData.Quantity === 0) {
      this.isValid = false;
    }
    return this.isValid;
  }

}
