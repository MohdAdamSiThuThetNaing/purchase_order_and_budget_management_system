import type { PurchaseOrder } from "../types/purchaseOrder";

interface PurchaseOrderFormProps {
  purchaseOrder: PurchaseOrder;
}

const PurchaseOrderForm = ({ purchaseOrder }: PurchaseOrderFormProps) => {
  return (
    <div>
      <p>
        <strong>PO Number:</strong> {purchaseOrder.poNumber}
      </p>
      <p>
        <strong>Vendor:</strong> {purchaseOrder.vendorId}
      </p>
      <p>
        <strong>Total:</strong> {purchaseOrder.totalAmount}
      </p>
      <p>
        <strong>Status:</strong> {purchaseOrder.status}
      </p>
    </div>
  );
};

export default PurchaseOrderForm;
