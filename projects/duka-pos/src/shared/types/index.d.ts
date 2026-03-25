export type Product = { id:number; name:string; sku:string; price:number; stock:number; barcode?:string; is_active?: boolean };
export type SaleItem = { product_id:number; quantity:number; unit_price:number; line_total:number };
export type Sale = { id:number; date_time:string; subtotal:number; tax:number; discount:number; total:number; payment_method:string; status:string; items?: SaleItem[] };
