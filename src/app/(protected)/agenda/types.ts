// ============================
// GraphQL Types
// ============================

export interface CalendarReservation {
  date: string; // ISO: YYYY-MM-DD ou timestamp string
  paid: boolean;
}

export interface CalendarReservationsQuery {
  calendarReservations: CalendarReservation[];
}

export interface CreateReservationInput {
  date: string;
  clientName: string;
  eventName: string;
  durationHours: number;
}

export interface CreateReservationMutation {
  createReservation: {
    id: string;
    date: string;
    paid: boolean;
  };
}

export interface CreateReservationVariables {
  input: CreateReservationInput;
}

export interface PaymentSubscriptionPayload {
  paymentConfirmed: {
    date: string;
    paid: boolean;
  };
}

export interface PaymentRemovedSubscriptionPayload {
  paymentRemoved: {
    date: string;
    paid: boolean;
  };
}
