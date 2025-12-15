// ============================
// Types
// ============================

export interface Reservation {
  id: string;
  date: string; // timestamp ou ISO string
  clientName: string;
  eventName: string;
  durationHours: number;
  paid: boolean;
}
export interface GetReservationsQuery {
  reservations: Reservation[];
}
export interface ReservationCreatedSubscription {
  reservationCreated: Reservation;
}
export interface PaymentConfirmedSubscription {
  paymentConfirmed: {
    id: string;
    paid: boolean;
  };
}
export interface PaymentRemovedSubscription {
  paymentRemoved: {
    id: string;
    paid: boolean;
  };
}
export interface ReservationDeletedSubscription {
  reservationDeleted: string[];
}

export interface ConfirmPaymentMutation {
  confirmPayment: {
    id: string;
    paid: boolean;
  };
}

export interface ConfirmPaymentVariables {
  id: string;
}

export interface RemovePaymentMutation {
  removePayment: {
    id: string;
    paid: boolean;
  };
}

export interface RemovePaymentVariables {
  id: string;
}
