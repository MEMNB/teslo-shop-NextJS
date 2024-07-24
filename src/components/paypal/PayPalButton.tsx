'use client';

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions } from "@paypal/paypal-js";
import { setTransactionId } from "@/actions";

interface Props {
    orderId: string;
    amount: number;
}

export const PayPalButton = ({orderId, amount}: Props) => {

    const [{ isPending }] = usePayPalScriptReducer();

    const rountedAmount = (Math.round(amount * 100)) / 100

    if(isPending) {
        return (
            <div className="animate-pulse text-center">
                <div className="h-9 bg-gray-300 rounded" />
                <div className="h-9 bg-gray-300 rounded mt-2" />
            </div>
        )
    }

    const createOrder = async(data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {

        const transactionId = await actions.order.create({
            purchase_units: [
                {
                    invoice_id: orderId,
                    amount: {
                        value: `${rountedAmount}`,
                    }
                }
            ]
        });

        const {ok} = await setTransactionId(orderId);

        if(!ok) {
            throw new Error('No se pudo realizar la transacción');
        }

        return transactionId;
    }

    const onApprove = async(data: OnApproveData, actions: OnApproveActions) => {
        const details = await actions.order?.capture();
        if(details) return;

        await paypalCheckPayment(details.id);
    }

  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={onApprove} />
  )
}
