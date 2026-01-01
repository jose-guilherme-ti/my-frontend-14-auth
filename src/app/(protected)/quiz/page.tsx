"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    Paper,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    LinearProgress,
    Stack,
    Divider,
} from "@mui/material";
import TimeChart from "./components/TimeChart";

type Question = {
    question: string;
    options: string[];
    correct: string;
    video: string;
};

interface AnswerFeedback {
    question: string;
    correct: boolean;
}

const QUESTIONS: Question[] = [
    {
        question: "O que é React?",
        options: [
            "Um framework backend",
            "Uma biblioteca JavaScript para UI",
            "Um banco de dados",
        ],
        correct: "Uma biblioteca JavaScript para UI",
        video: "/videos/react.mp4",
    },
    {
        question: "O que é Next.js?",
        options: [
            "Uma linguagem de programação",
            "Um framework baseado em React",
            "Um servidor HTTP",
        ],
        correct: "Um framework baseado em React",
        video: "/videos/react.mp4",
    },
    {
        question: "O que é Material UI?",
        options: [
            "Um sistema operacional",
            "Uma biblioteca de componentes React",
            "Um ORM",
        ],
        correct: "Uma biblioteca de componentes React",
        video: "/videos/react.mp4",
    },
];

const QUESTION_TIME_MS = 30_000;

export default function QuizPage() {
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [canProceed, setCanProceed] = useState(false);

    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);

    const [timeLeft, setTimeLeft] = useState(30);
    const [timePerQuestion, setTimePerQuestion] = useState<number[]>([]);
    const [answersFeedback, setAnswersFeedback] = useState<AnswerFeedback[]>([]);

    const questionStartRef = useRef<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const question = QUESTIONS[current];

    /* =======================
       ⏱️ INÍCIO DA QUESTÃO
    ======================= */
    useEffect(() => {
        if (current >= QUESTIONS.length) return;

        setSelected("");
        setShowResult(false);
        setIsCorrect(null);
        setCanProceed(false);
        setTimeLeft(30);

        questionStartRef.current = Date.now();

        timerRef.current = setTimeout(() => {
            finalizeQuestion(false);
        }, QUESTION_TIME_MS);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [current]);

    /* =======================
       ⏳ TIMER VISUAL
    ======================= */
    useEffect(() => {
        if (showResult) return;

        const interval = setInterval(() => {
            const elapsed = Math.floor(
                (Date.now() - questionStartRef.current) / 1000
            );
            setTimeLeft(Math.max(30 - elapsed, 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [showResult]);

    /* =======================
       🧠 FINALIZAR QUESTÃO
    ======================= */
    function finalizeQuestion(answered: boolean) {
        if (showResult) return;

        if (timerRef.current) clearTimeout(timerRef.current);

        const elapsed = Math.min(
            Math.floor((Date.now() - questionStartRef.current) / 1000),
            30
        );

        setTimePerQuestion((prev) => {
            const updated = [...prev];
            updated[current] = elapsed;
            return updated;
        });

        if (!answered) {
            setWrongCount((w) => w + 1);
            setIsCorrect(false);

            setAnswersFeedback((prev) => {
                const updated = [...prev];
                updated[current] = {
                    question: question.question,
                    correct: false,
                };
                return updated;
            });
        }

        setShowResult(true);
        setCanProceed(true);
    }

    /* =======================
       ✅ RESPONDER
    ======================= */
    function handleAnswer(value: string) {
        if (showResult) return;

        if (timerRef.current) clearTimeout(timerRef.current);

        const elapsed = Math.floor(
            (Date.now() - questionStartRef.current) / 1000
        );

        setTimePerQuestion((prev) => {
            const updated = [...prev];
            updated[current] = elapsed;
            return updated;
        });

        const correct = value === question.correct;

        setSelected(value);
        setIsCorrect(correct);
        setShowResult(true);
        setCanProceed(!correct);

        setAnswersFeedback((prev) => {
            const updated = [...prev];
            updated[current] = {
                question: question.question,
                correct,
            };
            return updated;
        });

        correct
            ? setCorrectCount((c) => c + 1)
            : setWrongCount((w) => w + 1);
    }

    /* =======================
       ▶️ PRÓXIMA
    ======================= */
    function handleNext() {
        setCurrent((c) => c + 1);
    }

    function resetQuiz() {
        setCurrent(0);
        setCorrectCount(0);
        setWrongCount(0);
        setTimePerQuestion([]);
        setAnswersFeedback([]);
    }

    /* =======================
       🏁 RESULTADO FINAL
    ======================= */
    if (current >= QUESTIONS.length) {
        const totalTime = timePerQuestion.reduce((a, b) => a + b, 0);
        const percentage = Math.round(
            (correctCount / QUESTIONS.length) * 100
        );

        return (
            <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 5 }}>
                <Stack spacing={2}>
                    <Typography variant="h4">Resultado Final</Typography>

                    <Typography>✔️ Acertos: {correctCount}</Typography>
                    <Typography>❌ Erros: {wrongCount}</Typography>
                    <Typography>📊 Percentual: {percentage}%</Typography>
                    <Typography>⏱️ Tempo total: {totalTime}s</Typography>

                    <Divider />

                    <Typography variant="h6">⏱️ Tempo por questão</Typography>

                    {QUESTIONS.map((_, i) => (
                        <Typography key={i}>
                            Pergunta {i + 1}: {timePerQuestion[i] ?? 30}s
                        </Typography>
                    ))}

                    <TimeChart data={timePerQuestion} />

                    <Divider />

                    <Typography variant="h6">🧠 Feedback</Typography>

                    {answersFeedback.map((item, i) => (
                        <Typography
                            key={i}
                            color={item.correct ? "success.main" : "error.main"}
                        >
                            {i + 1}. {item.question} —{" "}
                            {item.correct ? "Correta ✅" : "Incorreta ❌"}
                        </Typography>
                    ))}

                    <Button variant="contained" onClick={resetQuiz}>
                        Reiniciar Quiz
                    </Button>
                </Stack>
            </Paper>
        );
    }

    /* =======================
       ❓ QUESTÃO
    ======================= */
    return (
        <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 5 }}>
            <Stack spacing={2}>
                <Typography>
                    Pergunta {current + 1} de {QUESTIONS.length}
                </Typography>

                <LinearProgress
                    variant="determinate"
                    value={(timeLeft / 30) * 100}
                />

                <Typography color="text.secondary">
                    Tempo restante: {timeLeft}s
                </Typography>

                <Typography variant="h5">{question.question}</Typography>

                <RadioGroup
                    value={selected}
                    onChange={(e) => handleAnswer(e.target.value)}
                >
                    {question.options.map((option) => (
                        <FormControlLabel
                            key={option}
                            value={option}
                            control={<Radio />}
                            label={option}
                            disabled={showResult}
                        />
                    ))}
                </RadioGroup>

                {showResult && (
                    <>
                        <Typography
                            color={isCorrect ? "success.main" : "error.main"}
                        >
                            {isCorrect ? "✅ Correta!" : "❌ Incorreta"}
                        </Typography>

                        {isCorrect && (
                            <video
                                data-testid="quiz-video"
                                src={question.video}
                                controls
                                autoPlay
                                onEnded={() => setCanProceed(true)}
                                style={{ width: "100%", borderRadius: 8 }}
                            />
                        )}
                    </>
                )}

                {canProceed && (
                    <Button variant="contained" onClick={handleNext}>
                        {current === QUESTIONS.length - 1
                            ? "Finalizar Quiz"
                            : "Próxima questão"}
                    </Button>
                )}
            </Stack>
        </Paper>
    );
}
