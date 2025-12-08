"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  TextField,
  Typography,
  LinearProgress,
  Avatar,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Grid,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { motion, AnimatePresence } from "framer-motion";
import { IMask, IMaskInput } from "react-imask"
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaskedField } from "@/components/MaskedInput";
import { ThemeSelector } from "@/components/ThemeSelector";



// ---------------- Helpers ----------------
const isValidCPF = (cpfRaw: string) => {
  const cpf = (cpfRaw || "").replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let first = (sum * 10) % 11;
  if (first === 10) first = 0;
  if (first !== parseInt(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  let second = (sum * 10) % 11;
  if (second === 10) second = 0;
  return second === parseInt(cpf[10]);
};

// -------------- Zod por step --------------
const step1Schema = z.object({
  name: z.string().min(3, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  cpf: z
    .string()
    .min(14, "CPF inválido")
    .refine((v) => isValidCPF(v), "CPF inválido"),
  phone: z
    .string()
    .min(14, "Telefone inválido")
    .regex(/\(\d{2}\) \d{4,5}-\d{4}/, "Telefone inválido"),
  photo: z.string().optional(),
});

const step2Schema = z.object({
  cep: z.string().min(9, "CEP inválido").regex(/\d{5}-\d{3}/, "CEP inválido"),
  street: z.string().min(2, "Rua obrigatória"),
  district: z.string().min(2, "Bairro obrigatório"),
  city: z.string().min(2, "Cidade obrigatória"),
});

const step3Schema = z.object({
  occupation: z.string().min(1, "Ocupação obrigatória"),
  income: z.string().min(1, "Renda obrigatória"),
  description: z.string().min(1, "Descrição obrigatória"),
});

const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema);
type FormData = z.infer<typeof fullSchema>;

// ---------------- Constantes ----------------
const STEPS = ["Dados Pessoais", "Endereço", "Confirmação"];
const LOCALSTORAGE_KEY = "fullSuperStepper:final:data";
const IMG_MAX_MB = 3;

// ---------------- Componente ---------------
export default function FullSuperStepperFinal() {
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [darkMode, setDarkMode] = useState(prefersDark || false);
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  const [activeStep, setActiveStep] = useState(0);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      cpf: "",
      phone: "",
      photo: undefined,
      cep: "",
      street: "",
      district: "",
      city: "",
      occupation: "",
      income: "",
      description: "",
    } as any,
  });

  // ---------------- Persistência (carregar inicial) ----------------
  // evita executar reset() duas vezes em StrictMode (dev) ou em re-renders inesperados


  const didLoadRef = useRef(false);

  useEffect(() => {
    if (didLoadRef.current) return; // somente a primeira execução
    didLoadRef.current = true;
    console.log("mount load effect");
    try {
      const raw = localStorage.getItem(LOCALSTORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);

        // Corrige campos undefined → ""
        const safe = {
          name: parsed.name ?? "",
          email: parsed.email ?? "",
          cpf: parsed.cpf ?? "",
          phone: parsed.phone ?? "",
          photo: parsed.photo ?? undefined,
          cep: parsed.cep ?? "",
          street: parsed.street ?? "",
          district: parsed.district ?? "",
          city: parsed.city ?? "",
          occupation: parsed.occupation ?? "",
          income: parsed.income ?? "",
          description: parsed.description ?? "",
        };

        reset(safe);
        if (safe.photo) setPhotoPreview(safe.photo);
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // manter array vazio: queremos rodar apenas na montagem inicial


  // ---------------- UseWatch para campos específicos (evita re-renders globais) ----------------
  // observamos somente os campos que interessam ao sidebar e persistência
  const watchedSidebar = useWatch({
    control,
    name: ["name", "email"],
  }) as [string | undefined, string | undefined];

  const watchedPersist = useWatch({
    control,
    name: [
      "name",
      "email",
      "cpf",
      "phone",
      "photo",
      "cep",
      "street",
      "district",
      "city",
      "occupation",
      "income",
      "description",
    ],
  }) as Partial<FormData>;

  const watchedCep = useWatch({ control, name: "cep" }) as string | undefined;

  // ---------------- Persistência: salvar quando watchedPersist muda (debounced) ----------------
  useEffect(() => {
    // small debounce to avoid too frequent writes
    const id = setTimeout(() => {
      try {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(watchedPersist));
      } catch {
        /* ignore */
      }
    }, 250);
    return () => clearTimeout(id);
  }, [watchedPersist]);

  // ---------------- Auto CEP (observa somente cep) ----------------
  useEffect(() => {
    const raw = (watchedCep ?? "").replace(/\D/g, "");
    if (raw.length === 8) {
      fetch(`https://viacep.com.br/ws/${raw}/json/`)
        .then((r) => r.json())
        .then((d) => {
          if (!d?.erro) {
            // setValue com shouldDirty true para não provocar validação desnecessária
            setValue("street", d.logradouro ?? "", { shouldDirty: true });
            setValue("district", d.bairro ?? "", { shouldDirty: true });
            setValue("city", d.localidade ?? "", { shouldDirty: true });
          }
        })
        .catch(() => { });
    }
  }, [watchedCep, setValue]);

  // ----------- Validação por step CORRIGIDA -----------
  async function validateStep(step: number): Promise<boolean> {
    // pegamos apenas os valores atuais (não colocamos watch() global)
    const data = getValues();

    let parsed;
    if (step === 0) parsed = step1Schema.safeParse(data);
    if (step === 1) parsed = step2Schema.safeParse(data);
    if (step === 2) parsed = step3Schema.safeParse(data);

    if (parsed?.success) {
      // limpamos erros daquele step (se existirem)
      clearErrors();
      return true;
    }

    const issues = parsed?.error?.issues ?? [];

    // setamos erros manualmente no RHF para aparecerem como helperText
    issues.forEach((err) => {
      const field = String(err.path[0]);
      if (field) setError(field as any, { type: "manual", message: err.message });
    });

    // foco no primeiro erro
    if (issues.length > 0) {
      const firstField = issues[0].path[0];
      const el = document.querySelector(`[name="${firstField}"]`) as HTMLElement | null;
      if (el && typeof el.focus === "function") {
        // pequeno timeout para garantir que o elemento exista no DOM
        setTimeout(() => el.focus(), 50);
      }
    }

    return false;
  }

  // ----------- Navegação corrigida -----------
  const tryNext = async () => {
    const ok = await validateStep(activeStep);
    if (ok) {
      setActiveStep((s) => Math.min(s + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const tryBack = () => {
    setActiveStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -------- Reset --------
  const handleReset = () => {
    reset();
    localStorage.removeItem(LOCALSTORAGE_KEY);
    setPhotoPreview(null);
    setActiveStep(0);
  };

  // ----- Upload ------
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > IMG_MAX_MB * 1024 * 1024) {
      alert(`Imagem muito grande. Máx ${IMG_MAX_MB} MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setValue("photo" as any, base64, { shouldDirty: true, shouldValidate: true });
      setPhotoPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: FormData) => {
    console.log("OBJETO FINAL:", data);
    alert("Finalizado! Veja o console.");
  };

  // ---------------- RENDER ----------------
  const progress = (activeStep / (STEPS.length - 1)) * 100;

  return (
   /*  <ThemeProvider theme={theme}> */
      <Paper sx={{ p: 3, maxWidth: 1280, mx: "auto", mt: 6 }}>
        <Grid container spacing={2}>
          {/* -------- Sidebar -------- */}
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ position: { md: "sticky" }, top: 24 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar
                    src={photoPreview ?? ""}
                    sx={{ width: 64, height: 64, fontSize: 28 }}
                  >
                    {!photoPreview && ((watchedSidebar?.[0] && watchedSidebar[0][0]) || "U")}
                  </Avatar>

                  <Box>
                    <Typography variant="h6">{watchedSidebar?.[0] || "Usuário"}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {watchedSidebar?.[1] || "preencha seu e-mail"}
                    </Typography>
                  </Box>
                </Box>

                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 2 }} />
                <Typography mt={1} variant="caption" data-cy="progress">
                  {Math.round(progress)}%
                </Typography>

                <Button
                  startIcon={<RestartAltIcon />}
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleReset}
                  variant="outlined"
                >
                  Resetar
                </Button>

                {/* <FormControlLabel
                  sx={{ mt: 2 }}
                  control={
                    <Switch
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                    />
                  }
                  label="Tema escuro"
                /> */}
                
                <ThemeSelector />
              </CardContent>
            </Card>
          </Grid>

          {/* -------- Form -------- */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" mb={2}>
              Super Stepper Final
            </Typography>

            <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 2 }}>
              {/* ---------------- STEP 1 ---------------- */}
              <Step>
                <StepLabel>Dados pessoais</StepLabel>
                <StepContent>
                  <AnimatePresence mode="wait">
                    {activeStep === 0 && (
                      <motion.div
                        key="s1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <Box display="flex" flexDirection="column" gap={2}>
                          {/* Upload */}
                          <Button
                            variant="contained"
                            component="label"
                            startIcon={<PhotoCamera />}
                          >
                            Enviar foto
                            <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
                          </Button>

                          <TextField
                            label="Nome"
                            {...register("name")}
                            name="name"
                            inputProps={{ "data-testid": "input-name" }}
                            error={!!errors.name}
                            helperText={errors.name?.message as any}
                            data-cy="nome-paciente-input"
                          />

                          <TextField
                            label="E-mail"
                            {...register("email")}
                            name="email"
                            error={!!errors.email}
                            helperText={errors.email?.message as any}
                          />

                          <MaskedField
                            name="cpf"
                            control={control}
                            label="CPF"
                            mask="000.000.000-00"
                          />

                          <MaskedField
                            name="phone"
                            control={control}
                            label="Telefone"
                            mask="(00) 00000-0000"
                          />

                          <Button variant="contained" onClick={tryNext}>
                            Próximo
                          </Button>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </StepContent>
              </Step>

              {/* ---------------- STEP 2 ---------------- */}
              <Step>
                <StepLabel>Endereço</StepLabel>
                <StepContent>
                  {activeStep === 1 && (
                    <motion.div
                      key="s2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Box display="flex" flexDirection="column" gap={2}>
                        <MaskedField
                          name="cep"
                          control={control}
                          label="CEP"
                          mask="00000-000"
                        />





                        <TextField
                          label="Rua"
                          {...register("street")}
                          name="street"
                          error={!!errors.street}
                          helperText={errors.street?.message as any}
                        />

                        <TextField
                          label="Bairro"
                          {...register("district")}
                          name="district"
                          error={!!errors.district}
                          helperText={errors.district?.message as any}
                        />

                        <TextField
                          label="Cidade"
                          {...register("city")}
                          name="city"
                          error={!!errors.city}
                          helperText={errors.city?.message as any}
                        />

                        <Box display="flex" gap={2}>
                          <Button variant="outlined" onClick={tryBack}>
                            Voltar
                          </Button>
                          <Button variant="contained" onClick={tryNext}>
                            Próximo
                          </Button>
                        </Box>
                      </Box>
                    </motion.div>
                  )}
                </StepContent>
              </Step>

              {/* ---------------- STEP 3 ---------------- */}
              <Step>
                <StepLabel>Confirmação</StepLabel>
                <StepContent>
                  {activeStep === 2 && (
                    <motion.div
                      key="s3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                          label="Ocupação"
                          {...register("occupation")}
                          name="occupation"
                          error={!!errors.occupation}
                          helperText={errors.occupation?.message as any}
                        />

                        <TextField
                          label="Renda"
                          {...register("income")}
                          name="income"
                          error={!!errors.income}
                          helperText={errors.income?.message as any}
                        />

                        <TextField
                          label="Descrição"
                          multiline
                          rows={3}
                          {...register("description")}
                          name="description"
                          error={!!errors.description}
                          helperText={errors.description?.message as any}
                        />

                        <Box display="flex" gap={2}>
                          <Button variant="outlined" onClick={tryBack}>
                            Voltar
                          </Button>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={handleSubmit(onSubmit)}
                          >
                            Finalizar
                          </Button>
                        </Box>
                      </Box>
                    </motion.div>
                  )}
                </StepContent>
              </Step>
            </Stepper>

            {/* preview do objeto final */}
            {activeStep === STEPS.length - 1 && (
              <Box mt={2}>
                <Typography variant="h6">Prévia do objeto final</Typography>
                <Paper variant="outlined" sx={{ mt: 1, p: 2, whiteSpace: "pre-wrap" }}>
                  <Typography variant="body2">{JSON.stringify(getValues(), null, 2)}</Typography>
                </Paper>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
   /*  </ThemeProvider> */
  );
}
