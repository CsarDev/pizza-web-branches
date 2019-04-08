import { Item } from './item.model';
export class Order {
    orderId: number;
    orderNo: string;
    restaurantCode: number;
    restaurantName: string;
    orderStatus: number;
    statusDescription: string;
    PMethod: string;
    GTotal: number;
    DeletedOrderItemIDs: string;
    items: Item[];
}
