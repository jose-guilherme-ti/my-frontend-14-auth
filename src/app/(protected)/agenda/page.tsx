
"use client";



import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Tooltip,
  Stack,
} from "@mui/material";
import { DateCalendar, PickersDay } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { gql } from "@apollo/client";
import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { CalendarReservationsQuery, CreateReservationMutation, CreateReservationVariables, PaymentRemovedSubscriptionPayload, PaymentSubscriptionPayload } from "./types";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


const reservationSchema = z.object({
  clientName: z.string().min(3, "Informe o nome do cliente"),
  eventName: z.string().min(3, "Informe o nome do evento"),
  durationHours: z
    .number({ message: "Informe a duração" })
    .min(1, "Duração mínima: 1 hora"),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

// ============================
// GraphQL
// ============================

const CALENDAR_RESERVATIONS = gql`
  query CalendarReservations {
    calendarReservations {
      date
      paid
    }
  }
`;

const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      id
      date
      paid
    }
  }
`;

const PAYMENT_CONFIRMED = gql`
  subscription {
    paymentConfirmed {
      date
      paid
    }
  }
`;

const PAYMENT_REMOVED = gql`
  subscription {
    paymentRemoved {
      date
      paid
    }
  }
`;

// ============================
// Component
// ============================

export default function TheaterCalendarPage() {




  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    mode: "onChange",
  });

  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [pendingDates, setPendingDates] = useState<string[]>([]);

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    clientName: "",
    eventName: "",
    durationHours: "",
  });

  const { data, loading } = useQuery<CalendarReservationsQuery>(CALENDAR_RESERVATIONS);
  const { data: paymentConfirmed } = useSubscription<PaymentSubscriptionPayload>(PAYMENT_CONFIRMED);
  const { data: paymentRemoved } = useSubscription<PaymentRemovedSubscriptionPayload>(PAYMENT_REMOVED);

  const [createReservation, { loading: saving }] =
    useMutation<
      CreateReservationMutation,
      CreateReservationVariables
    >(CREATE_RESERVATION);

  // ============================
  // Load inicial (🔥 essencial)
  // ============================

  useEffect(() => {
    if (!data?.calendarReservations) return;

    const paid: string[] = [];
    const pending: string[] = [];

    data.calendarReservations.forEach((r: any) => {
      r.paid ? paid.push(r.date) : pending.push(r.date);
    });
    console.log(paid, pending);
    setBlockedDates(paid);
    setPendingDates(pending);
  }, [data]);

  // ============================
  // Subscriptions
  // ============================


  function convertDate(originalTimestamp: string) {
    // Adiciona 2 dias (2 dias * 24 horas/dia * 60 minutos/hora * 60 segundos/minuto * 1000 milissegundos/segundo) // 
    // 1. Converta para formato ISO 8601 (YYYY-MM-DD) 
    const parts = originalTimestamp.split('/');
    const dateISOString = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateISOString;
  }

  useEffect(() => {
    if (!paymentConfirmed?.paymentConfirmed) return;

    const date = convertDate(new Date(+paymentConfirmed.paymentConfirmed.date)
      .toLocaleDateString('pt-BR', { timeZone: 'UTC', }))

    setBlockedDates(prev => [...new Set([...prev, date])]);
    setPendingDates(prev => prev.filter(d => d !== date));

    setMessage("Reserva confirmada com sucesso!");
  }, [paymentConfirmed]);

  useEffect(() => {
    if (!paymentRemoved?.paymentRemoved) return;

    const date = convertDate(new Date(+paymentRemoved.paymentRemoved.date)
      .toLocaleDateString('pt-BR', { timeZone: 'UTC', }))

    setBlockedDates(prev => prev.filter(d => d !== date));
    setPendingDates(prev => [...new Set([...prev, date])]);

    setMessage("Pagamento removido. Data liberada.");
  }, [paymentRemoved]);

  // ============================
  // Helpers
  // ============================

  const today = dayjs().startOf("day");

  const getDayStatus = (date: Dayjs) => {
    const formatted = date.format("YYYY-MM-DD");

    if (date.isBefore(today)) return "confirmed";
    if (blockedDates.includes(formatted)) return "confirmed";
    if (pendingDates.includes(formatted)) return "pending";

    return "available";
  };

  const isDateBlocked = (date: Dayjs) => {
    return getDayStatus(date) === "confirmed";
  }

  // ============================
  // Custom Day
  // ============================

  function CustomDay(props: any) {
    const { day, ...other } = props;
    const status = getDayStatus(day);

    const colors: any = {
      confirmed: "#ef9a9a",
      pending: "#fff59d",
      available: "#c8e6c9",
    };

    const labels: any = {
      confirmed: "Data indisponível",
      pending: "Aguardando pagamento",
      available: "Data disponível",
    };

    return (
      <Tooltip title={labels[status]} arrow>
        <PickersDay
          {...other}
          day={day}
          disabled={false}
          sx={{
            backgroundColor: colors[status],
            cursor: status === "confirmed" ? "not-allowed" : "pointer",
            "&:hover": { opacity: 0.85 },
          }}
        />
      </Tooltip>
    );
  }

  // ============================
  // Submit
  // ============================

  const onSubmit = async (formData: ReservationFormData) => {
    if (!selectedDate) return;

    const date = selectedDate.format("YYYY-MM-DD");

    await createReservation({
      variables: {
        input: {
          date,
          clientName: formData.clientName,
          eventName: formData.eventName,
          durationHours: formData.durationHours,
        },
      },
    });

    setPendingDates(prev => [...new Set([...prev, date])]);
    setOpen(false);
    reset();
    setMessage("Reserva criada! Aguardando pagamento.");
  };


  // ============================
  // Render
  // ============================

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4">Agenda do Teatro</Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center', // Centraliza horizontalmente
            alignItems: 'center',       // Define a altura para ocupar toda a tela (ou a altura desejada)
            width: '100%',
            flexDirection: 'column',
          }}
        >
          <Paper sx={{
            p: 3,
            maxWidth: 620,
            mt: 2,
          }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <DateCalendar
                sx={{
                  // Define a largura e altura do contêiner principal do calendário
                  '&.MuiDateCalendar-root': {
                    width: '600px', // Exemplo de largura maior
                    height: 'auto', // Ajusta a altura automaticamente
                    maxHeight: 'none', // Remove o max-height padrão se necessário
                  },
                  // Aumenta o tamanho dos dias individuais e da fonte
                  '& .MuiPickersDay-root': {
                    height: '60px', // Aumenta a altura do botão do dia
                    width: '60px', // Aumenta a largura do botão do dia
                    fontSize: '1.2rem', // Aumenta o tamanho da fonte dos dias
                  },
                  // Aumenta o tamanho dos rótulos dos dias da semana (S, M, T, Q...)
                  '& .MuiDayCalendar-weekDayLabel': {
                    fontSize: '1rem',
                  },
                  // Garante que a área de transição do calendário (slide) tenha espaço suficiente
                  '& .MuiDayCalendar-slideTransition': {
                    minHeight: '400px',
                  },
                }}
                shouldDisableDate={isDateBlocked}
                onChange={(date) => {
                  if (!isDateBlocked(date!)) {
                    setSelectedDate(date);
                    setOpen(true);
                  }
                }}
                slots={{ day: CustomDay }}
              />
            )}
          </Paper>


          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Chip label="Disponível" sx={{ bgcolor: "#c8e6c9" }} />
            <Chip label="Aguardando pagamento" sx={{ bgcolor: "#fff59d" }} />
            <Chip label="Confirmado" sx={{ bgcolor: "#ef9a9a" }} />
          </Stack>
        </Box>

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <DialogTitle>Confirmar Reserva</DialogTitle>

          <DialogContent>
            <Typography gutterBottom>
              Data selecionada:{" "}
              <strong>{selectedDate?.format("DD/MM/YYYY")}</strong>
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="clientName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Cliente"
                      fullWidth
                      error={!!errors.clientName}
                      helperText={errors.clientName?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="eventName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Evento"
                      fullWidth
                      error={!!errors.eventName}
                      helperText={errors.eventName?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="durationHours"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Duração (horas)"
                      fullWidth
                      error={!!errors.durationHours}
                      helperText={errors.durationHours?.message}
                      onChange={e =>
                        field.onChange(Number(e.target.value))
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => {
              setOpen(false)
              reset()
              }}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid || saving}
            >
              {saving ? <CircularProgress size={20} /> : "Reservar"}
            </Button>
          </DialogActions>
        </Dialog>


        <Snackbar
          open={!!message}
          autoHideDuration={4000}
          onClose={() => setMessage("")}
        >
          <Alert severity="success">{message}</Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}
