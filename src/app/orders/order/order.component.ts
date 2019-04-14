import { CustomerService } from './../../shared/customer.service';
import { OrderService } from './../../shared/order.service';
import { ItemService } from './../../shared/item.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OrderItemsComponent } from '../order-items/order-items.component';
import { Customer } from 'src/app/shared/customer.model';
import { Item } from 'src/app/shared/item.model';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styles: []
})
export class OrderComponent implements OnInit {
  customerList: Customer[];
  isValid: boolean = true;

  constructor(public service: OrderService,
    public itemService: ItemService,
    private dialog: MatDialog,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router,
    private currentRoute: ActivatedRoute) { }

  ngOnInit() {
    let orderID = this.currentRoute.snapshot.paramMap.get('id');
    if (orderID == null) {
      this.resetForm();
    } else {
      this.service.getOrderByID(parseInt(orderID)).then(res => {
        this.service.formData = res;
        this.service.orderItems = res.items;
      });
    }

    this.customerService.getCustomerList().then((res: any[]) => {
      const result = res.map(x => ({ CustomerID: x.restaurantCode, Name: x.name}));
      this.customerList = result as Customer[];
    });
  }

  resetForm(form?: NgForm) {
    if (form = null) {
      form.resetForm();
    }
    this.service.formData = {
      orderId: null,
      orderNo: Math.floor(100000 + Math.random() * 900000).toString(),
      restaurantCode: 0,
      restaurantName: null,
      orderStatus: 0,
      statusDescription: 'Created',
      PMethod: '',
      GTotal: 0,
      DeletedOrderItemIDs: '',
      items: []
    };
    this.service.orderItems = [];
  }

  AddOrEditOrderItem(orderItemIndex, OrderID) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = { orderItemIndex, OrderID };
    this.dialog.open(OrderItemsComponent, dialogConfig).afterClosed().subscribe(res => {
      this.updateGrandTotal();
    });
  }


  onDeleteOrderItem(orderItem: Item, i: number) {
    if (orderItem.orderItemId != null) {
      this.itemService.deleteOrderItem(orderItem.orderId, orderItem).then(() => {
        this.service.orderItems.splice(i, 1);
        this.service.formData.items.splice(i, 1);
        this.updateGrandTotal();
      });
    }
  }

  updateGrandTotal() {
    this.service.formData.GTotal = this.service.orderItems.reduce((prev, curr) => {
      return prev + curr.Total;
    }, 0);
    this.service.formData.GTotal = parseFloat(this.service.formData.GTotal.toFixed(2));
  }

  validateForm() {
    this.isValid = true;
    if (this.service.formData.restaurantCode === 0) {
      this.isValid = false;
    } else if (this.service.orderItems.length === 0) {
      this.isValid = false;
    }
    return this.isValid;
  }


  onSubmit(form: NgForm) {
    if (this.validateForm()) {
      this.service.saveOrUpdateOrder().subscribe(res => {
        this.resetForm();
        this.toastr.success('Submitted Successfully', 'Restaurent App.');
        this.router.navigate(['/orders']);
      });
    }
  }

}
