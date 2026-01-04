"use client";

import { useState } from "react";

type OnboardingResponse = {
  name: string;
  introduction: string;
};

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
};

const questions: Question[] = [
  {
    id: 1,
    question: "What is my name?",
    options: ["Sarah", "Seren", "Selena"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "Which sport do I NOT enjoy watching?",
    options: ["Basketball", "Football", "Formula 1"],
    correctAnswer: 0,
  },
  {
    id: 3,
    question: "Which instrument can I NOT play?",
    options: ["Percussion", "Guitar", "Piano"],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "What is my role at TPET?",
    options: ["Backend Developer", "Frontend Developer", "Data Analyst"],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: "Which cohort of AWS Campus Ambassador am I?",
    options: ["7th", "8th", "9th"],
    correctAnswer: 1,
  },
];

interface QuizClientProps {
  initialData: OnboardingResponse;
}

export default function QuizClient({ initialData }: QuizClientProps) {
  const [stage, setStage] = useState<"welcome" | "quiz" | "result">("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const handleStartQuiz = () => {
    setStage("quiz");
  };

  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStage("result");
    }
  };

  const calculateScore = () => {
    return questions.reduce((score, question, index) => {
      return score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  // Welcome Stage
  if (stage === "welcome") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#E8E3D4] to-[#A5B8C6] px-4">
        <div className="w-full max-w-2xl rounded-3xl bg-white p-12 shadow-2xl">
          <h1 className="mb-8 text-center text-4xl font-bold text-[#6E7B8E]">Get to Know Me</h1>

          <div className="mb-8 flex justify-center">
            <div className="h-48 w-48 overflow-hidden rounded-full border-4 border-[#A5B8C6] shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://res.cloudinary.com/da3bvump4/image/upload/v1767373643/0fb830dfff944bf719d02d657320dd37_burhib.jpg"
                alt="Seren"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <p className="mb-3 text-center text-lg text-slate-600">
            From campus to cloud, every journey tells a story.
          </p>
          <p className="mb-3 text-center text-lg text-slate-600">
            Are you ready to discover who I am?
          </p>
          <p className="mb-8 text-center text-xl font-semibold text-[#6E7B8E]">
            Ready to explore and get to know me?
          </p>

          <div className="flex justify-center">
            <button
              onClick={handleStartQuiz}
              className="rounded-full bg-gradient-to-r from-[#A5B8C6] to-[#6E7B8E] px-12 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Quiz Stage
  if (stage === "quiz") {
    const question = questions[currentQuestion];
    const hasSelectedAnswer = selectedAnswers[currentQuestion] !== undefined;

    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#E8E3D4] to-[#A5B8C6] px-4">
        <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl md:p-12">
          {/* Progress Bar */}
          <div className="mb-10 h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#A5B8C6] to-[#6E7B8E] transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Question */}
          <h2 className="mb-12 text-center text-2xl font-semibold text-[#6E7B8E] md:text-3xl">
            {question.question}
          </h2>

          {/* Options */}
          <div className="mb-8 space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                className={`w-full rounded-2xl border-2 p-6 text-center text-lg transition-all ${
                  selectedAnswers[currentQuestion] === index
                    ? "border-[#6E7B8E] bg-[#A5B8C6] bg-opacity-20 font-semibold text-[#6E7B8E]"
                    : "border-gray-200 bg-white text-slate-700 hover:border-[#A5B8C6] hover:bg-[#A5B8C6] hover:bg-opacity-20"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <div className="flex justify-center">
            <button
              onClick={handleNextQuestion}
              disabled={!hasSelectedAnswer}
              className={`rounded-full px-10 py-4 text-lg font-semibold text-white shadow-lg transition-all ${
                hasSelectedAnswer
                  ? "bg-gradient-to-r from-[#A5B8C6] to-[#6E7B8E] hover:scale-105 hover:shadow-xl"
                  : "cursor-not-allowed bg-gray-300"
              }`}
            >
              {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Result Stage
  const score = calculateScore();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#E8E3D4] to-[#A5B8C6] px-4 py-12">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl md:p-12">
        <h1 className="mb-8 text-center text-3xl font-bold text-[#6E7B8E] md:text-4xl">
          You scored {score} out of {questions.length}!
        </h1>

        <div className="mb-8 flex justify-center">
          <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-[#A5B8C6] shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/da3bvump4/image/upload/v1767373643/ce23cdb436653e746f5e8e2cad934fff_yj7wrw.jpg"
              alt="Seren Result"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Hashtags */}
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <span className="rounded-full bg-[#A5B8C6] bg-opacity-30 px-4 py-2 text-sm font-semibold text-[#6E7B8E]">
            #ESFJ
          </span>
          <span className="rounded-full bg-[#A5B8C6] bg-opacity-30 px-4 py-2 text-sm font-semibold text-[#6E7B8E]">
            #Traveler
          </span>
          <span className="rounded-full bg-[#A5B8C6] bg-opacity-30 px-4 py-2 text-sm font-semibold text-[#6E7B8E]">
            #Swifties
          </span>
        </div>

        {/* Introduction from API */}
        <div className="mb-8 rounded-2xl border-l-4 border-[#6E7B8E] bg-[#E8E3D4] p-6">
          <p className="text-center text-lg italic text-[#6E7B8E]">
            &ldquo;{initialData.introduction}&rdquo;
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-[#A5B8C6] to-[#6E7B8E] p-8 text-center">
          <p className="mb-4 text-xl font-semibold text-white">
            {score === questions.length
              ? "Perfect score! You really know me well! 🎉"
              : score >= 3
                ? "Great job! You're getting to know me! 😊"
                : "Thanks for taking the quiz! Let&apos;s connect more! 💭"}
          </p>
          <p className="text-white">
            Thank you for taking the time to get to know me through this quiz! I&apos;m passionate
            about frontend development and creating engaging user experiences. Let&apos;s build
            something amazing together!
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => {
              setStage("welcome");
              setCurrentQuestion(0);
              setSelectedAnswers([]);
            }}
            className="rounded-full bg-gradient-to-r from-[#A5B8C6] to-[#6E7B8E] px-10 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    </main>
  );
}
