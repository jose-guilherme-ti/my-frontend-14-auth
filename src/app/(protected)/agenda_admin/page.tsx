"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  CircularProgress,
  Stack,
} from "@mui/material";
import { gql } from "@apollo/client";
import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { ConfirmPaymentMutation, ConfirmPaymentVariables, GetReservationsQuery, PaymentConfirmedSubscription, PaymentRemovedSubscription, RemovePaymentMutation, RemovePaymentVariables, Reservation, ReservationCreatedSubscription, ReservationDeletedSubscription } from "./types";

// ============================
// GraphQL
// ============================

const GET_RESERVATIONS = gql`
  query Reservations {
    reservations {
      id
      date
      clientName
      eventName
      durationHours
      paid
    }
  }
`;

const RESERVATION_CREATED = gql`
  subscription ReservationCreated {
    reservationCreated {
      id
      date
      clientName
      eventName
      durationHours
      paid
    }
  }
`;

const PAYMENT_CONFIRMED = gql`
  subscription PaymentConfirmed {
    paymentConfirmed {
      id
      paid
    }
  }
`;

const PAYMENT_REMOVED = gql`
  subscription PaymentRemoved {
    paymentRemoved {
      id
      paid
    }
  }
`;

const RESERVATION_DELETED = gql`
  subscription ReservationDeleted {
    reservationDeleted
  }
`;

const CONFIRM_PAYMENT = gql`
  mutation ConfirmPayment($id: ID!) {
    confirmPayment(reservationId: $id) {
      id
      paid
    }
  }
`;

const REMOVE_PAYMENT = gql`
  mutation RemovePayment($id: ID!) {
    removePayment(reservationId: $id) {
      id
      paid
    }
  }
`;

// ============================
// Component
// ============================

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const { data: initialData, loading } = useQuery<GetReservationsQuery>(
    GET_RESERVATIONS,
    { fetchPolicy: "no-cache" }
  );

  const { data: createdData } =
    useSubscription<ReservationCreatedSubscription>(RESERVATION_CREATED);

  const { data: confirmedData } =
    useSubscription<PaymentConfirmedSubscription>(PAYMENT_CONFIRMED);

  const { data: removedData } =
    useSubscription<PaymentRemovedSubscription>(PAYMENT_REMOVED);

  const { data: deletedData } =
    useSubscription<ReservationDeletedSubscription>(RESERVATION_DELETED);

  const [confirmPayment] = useMutation<
    ConfirmPaymentMutation,
    ConfirmPaymentVariables
  >(CONFIRM_PAYMENT);

  const [removePayment] = useMutation<
    RemovePaymentMutation,
    RemovePaymentVariables
  >(REMOVE_PAYMENT);


  // ============================
  // Load initial data
  // ============================

  useEffect(() => {
    if (initialData?.reservations) {
      setReservations(initialData.reservations);
    }
  }, [initialData]);

  // ============================
  // Realtime updates
  // ============================

  useEffect(() => {
    if (createdData?.reservationCreated) {
      setReservations((prev) => {
        if (prev.some(r => r.id === createdData.reservationCreated.id)) {
          return prev;
        }
        return [createdData.reservationCreated, ...prev];
      });
    }
  }, [createdData]);

  useEffect(() => {
    if (!confirmedData?.paymentConfirmed) return;

    const { id } = confirmedData.paymentConfirmed;

    setReservations(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, paid: true }
          : r
      )
    );
  }, [confirmedData]);



  useEffect(() => {
    if (removedData?.paymentRemoved) {
      const { id } = removedData.paymentRemoved;
      setReservations(prev =>
        prev.map(r =>
          r.id === id ? { ...r, paid: false } : r
        )
      );
    }
  }, [removedData]);


  useEffect(() => {
    if (!deletedData?.reservationDeleted?.length) return;

    const deletedIds = deletedData.reservationDeleted.map(String);

    setReservations(prev =>
      prev.filter(r => !deletedIds.includes(String(r.id)))
    );
  }, [deletedData]);


  // ============================
  // Actions
  // ============================

  const handleConfirmPayment = async (id: string) => {
    try {
      setLoadingId(id);
      await confirmPayment({ variables: { id } });
    } finally {
      setLoadingId(null);
    }
  };

  const handleRemovePayment = async (id: string) => {
    try {
      setLoadingId(id);
      await removePayment({ variables: { id } });
    } finally {
      setLoadingId(null);
    }
  };

  // ============================
  // Render
  // ============================

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Painel Administrativo – Reservas
      </Typography>

      <Paper elevation={4} sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Evento</TableCell>
              <TableCell>Duração</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading && reservations.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhuma reserva encontrada
                </TableCell>
              </TableRow>
            )}

            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>
                  {new Date(+reservation.date).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  })}
                </TableCell>

                <TableCell>{reservation.clientName}</TableCell>
                <TableCell>{reservation.eventName}</TableCell>
                <TableCell>{reservation.durationHours}h</TableCell>

                <TableCell>
                  {reservation.paid ? (
                    <Chip label="Pago" color="success" />
                  ) : (
                    <Chip label="Pendente" color="warning" />
                  )}
                </TableCell>

                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {!reservation.paid ? (
                      <Button
                        variant="contained"
                        onClick={() =>
                          handleConfirmPayment(reservation.id)
                        }
                        disabled={loadingId === reservation.id}
                      >
                        {loadingId === reservation.id ? (
                          <CircularProgress size={20} />
                        ) : (
                          "Confirmar Pagamento"
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() =>
                          handleRemovePayment(reservation.id)
                        }
                        disabled={loadingId === reservation.id}
                      >
                        {loadingId === reservation.id ? (
                          <CircularProgress size={20} />
                        ) : (
                          "Remover Pagamento"
                        )}
                      </Button>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
