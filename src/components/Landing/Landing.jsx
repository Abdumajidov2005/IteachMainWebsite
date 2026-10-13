import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import heroImg from "../../assets/hero.png";
import {
  BookOpen,
  Users,
  // Trophy,     // Natijalar bo'limi uchun — keyinroq yoqiladi
  // Star,       // Natijalar bo'limi uchun — keyinroq yoqiladi
  LogOut,
  ArrowRight,
  // ChevronDown, // Savollar (FAQ) bo'limi uchun — keyinroq yoqiladi
  GraduationCap,
  Code2,
  Server,
  Box,
  Bot,
  Sparkles,
} from "lucide-react";

const getCourseStyle = (title = "") => {
  const lower = title.toLowerCase();

  if (
    lower.includes("front") ||
    lower.includes("react") ||
    lower.includes("html") ||
    lower.includes("css") ||
    lower.includes("js") ||
    lower.includes("javascript")
  ) {
    return { icon: Code2, style: "bg-blue-500/10 text-blue-600" };
  }
  if (
    lower.includes("back") ||
    lower.includes("node") ||
    lower.includes("python") ||
    lower.includes("php") ||
    lower.includes("java") ||
    lower.includes("sql")
  ) {
    return { icon: Server, style: "bg-emerald-500/10 text-emerald-600" };
  }
  if (
    lower.includes("3d") ||
    lower.includes("max") ||
    lower.includes("blender") ||
    lower.includes("design") ||
    lower.includes("graphic")
  ) {
    return { icon: Box, style: "bg-orange-500/10 text-orange-600" };
  }
  if (
    lower.includes("ai") ||
    lower.includes("sun'iy") ||
    lower.includes("intelligence") ||
    lower.includes("chatgpt")
  ) {
    return { icon: Sparkles, style: "bg-purple-500/10 text-purple-600" };
  }
  if (lower.includes("bot") || lower.includes("telegram")) {
    return { icon: Bot, style: "bg-cyan-500/10 text-cyan-600" };
  }
  return { icon: BookOpen, style: "bg-gray-500/10 text-gray-600" };
};

export default function Landing({ onLogout }) {
  const [courses, setCourses] = useState([]);
  const [mentors, setMentors] = useState([]);
  // Hozircha ishga tushirilmagan — keyinroq yoqiladi:
  // const [results, setResults] = useState([]);
  // const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const unsubCourses = onSnapshot(collection(db, "courses"), (snap) => {
      setCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const unsubMentors = onSnapshot(collection(db, "mentors"), (snap) => {
      setMentors(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    // Hozircha ishga tushirilmagan — keyinroq yoqiladi:
    // const unsubResults = onSnapshot(collection(db, "results"), (snap) => {
    //   setResults(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    // });
    // const unsubQuestions = onSnapshot(collection(db, "questions"), (snap) => {
    //   setQuestions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    // });

    return () => {
      unsubCourses();
      unsubMentors();
      // unsubResults();
      // unsubQuestions();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f8f7] text-[#111816] font-['Plus_Jakarta_Sans']">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}
      </style>

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-[#e7ebe9] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 md:px-8">
          <img src="/imgs/logo.png" alt="iTeach" className="h-8 w-auto object-contain" />

          <nav className="hidden items-center gap-7 text-sm font-semibold text-gray-600 md:flex">
            <a href="#courses" className="transition hover:text-[#159447]">Kurslar</a>
            <a href="#mentors" className="transition hover:text-[#159447]">Mentorlar</a>
            {/* Hozircha ishga tushirilmagan — keyinroq yoqiladi:
            <a href="#results" className="transition hover:text-[#159447]">Natijalar</a>
            <a href="#faq" className="transition hover:text-[#159447]">Savollar</a>
            */}
          </nav>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-xl bg-[#111816] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#159447]"
          >
            <LogOut size={16} />
            Chiqish
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf7f0] px-4 py-1.5 text-xs font-bold text-[#159447]">
              <Sparkles size={14} /> Zamonaviy ta'lim platformasi
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-5xl">
              Kelajak kasbini
              <span className="text-[#159447]"> iTeach</span> bilan o'rganing
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#7c8b80]">
              Tajribali mentorlar, zamonaviy kurslar va real natijalar. O'z
              ta'lim yo'lingizni bugun boshlang.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#courses"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3ddc84] to-[#189358] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_-6px_rgba(24,147,88,0.5)] transition hover:-translate-y-0.5"
              >
                Kurslarni ko'rish
                <ArrowRight size={16} />
              </a>
              <a
                href="#mentors"
                className="rounded-full border border-[#dfe5e2] bg-white px-6 py-3.5 text-sm font-bold transition hover:border-[#159447] hover:text-[#159447]"
              >
                Mentorlar bilan tanishing
              </a>
            </div>

            <div className="mt-10 flex gap-8">
              <HeroStat icon={BookOpen} value={courses.length} label="Kurslar" />
              <HeroStat icon={Users} value={mentors.length} label="Mentorlar" />
              {/* Hozircha ishga tushirilmagan — keyinroq yoqiladi:
              <HeroStat icon={Trophy} value={results.length} label="Natijalar" />
              */}
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-[#54dc8a]/20 blur-2xl" />
            <img
              src={heroImg}
              alt="iTeach"
              className="relative z-10 w-full rounded-[28px] object-contain"
            />
          </div>
        </div>
      </section>

      {/* Kurslar */}
      <Section id="courses" title="Bizning kurslar" subtitle="Siz uchun eng mos yo'nalishni tanlang">
        {courses.length === 0 ? (
          <EmptyNote text="Hozircha kurslar qo'shilmagan" />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const { icon: Icon, style } = getCourseStyle(course.title);
              return (
                <div
                  key={course.id}
                  className="group rounded-[22px] border border-[#e5ebe7] bg-white p-6 transition hover:-translate-y-1 hover:border-[#159447]/40 hover:shadow-lg hover:shadow-black/5"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${style}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 text-lg font-extrabold">{course.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">Mentor: {course.mentor}</p>

                  <div className="mt-5 flex items-center justify-between border-t border-[#f0f2f1] pt-4">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                      <GraduationCap size={15} className="text-[#159447]" />
                      {course.students || 0} o'quvchi
                    </span>
                    <span className="rounded-full bg-[#eaf7f0] px-3 py-1 text-[11px] font-bold text-[#159447]">
                      {course.status || "Faol"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {/* Mentorlar */}
      <Section id="mentors" title="Mentorlarimiz" subtitle="Sohaning tajribali mutaxassislari" tinted>
        {mentors.length === 0 ? (
          <EmptyNote text="Hozircha mentorlar qo'shilmagan" />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="rounded-[22px] border border-[#e5ebe7] bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5"
              >
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white ${mentor.color || "bg-purple-500"}`}>
                  {(mentor.name || "?").charAt(0).toUpperCase()}
                </div>
                <h3 className="mt-4 text-base font-extrabold">{mentor.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{mentor.field}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Hozircha ishga tushirilmagan — Natijalar va Savollar (FAQ) bo'limlari keyinroq yoqiladi.
          Qaytarish uchun quyidagi blokni va yuqoridagi tegishli commentlarni oching:

      <Section id="results" title="O'quvchilar natijalari" subtitle="Bizning bitiruvchilar erishgan yutuqlar">
        {results.length === 0 ? (
          <EmptyNote text="Hozircha natijalar qo'shilmagan" />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((result) => (
              <div
                key={result.id}
                className="rounded-[22px] border border-[#e5ebe7] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5"
              >
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < (result.rating || 0) ? "fill-orange-400 text-orange-400" : "text-gray-300"}
                    />
                  ))}
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {result.achievement}
                </p>

                <div className="mt-5 flex items-center gap-3 border-t border-[#f0f2f1] pt-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${result.color || "bg-orange-500"}`}>
                    {(result.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{result.name}</p>
                    {result.course && (
                      <p className="text-xs text-gray-400">{result.course}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section id="faq" title="Ko'p so'raladigan savollar" subtitle="Sizni qiziqtirgan savollarga javoblar" tinted>
        {questions.length === 0 ? (
          <EmptyNote text="Hozircha savollar qo'shilmagan" />
        ) : (
          <div className="mx-auto max-w-3xl space-y-3">
            {questions.map((question) => (
              <FaqItem key={question.id} question={question} />
            ))}
          </div>
        )}
      </Section>

      */}

      {/* Footer */}
      <footer className="border-t border-[#e7ebe9] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 md:flex-row md:px-8">
          <img src="/imgs/logo.png" alt="iTeach" className="h-7 w-auto object-contain" />
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} iTeach. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </footer>
    </div>
  );
}

function HeroStat({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf7f0] text-[#159447]">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xl font-extrabold leading-none">{value}+</p>
        <p className="mt-1 text-xs text-gray-400">{label}</p>
      </div>
    </div>
  );
}

function Section({ id, title, subtitle, tinted, children }) {
  return (
    <section id={id} className={tinted ? "bg-white" : "bg-[#f6f8f7]"}>
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-extrabold md:text-3xl">{title}</h2>
          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

function EmptyNote({ text }) {
  return (
    <div className="rounded-[22px] border border-dashed border-[#dfe5e2] bg-white/60 py-14 text-center">
      <p className="text-sm font-medium text-gray-400">{text}</p>
    </div>
  );
}

// Hozircha ishga tushirilmagan — Savollar (FAQ) bo'limi bilan birga keyinroq yoqiladi:
/*
function FaqItem({ question }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e5ebe7] bg-white">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-bold">{question.title}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-[#f0f2f1] px-5 py-4 text-sm leading-6 text-gray-500">
          {question.answer}
        </div>
      )}
    </div>
  );
}
*/
