import { useState, useEffect, useRef } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Bell,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  LogOut,
  Menu,
  ChevronRight,
  ChevronDown,
  Code2,
  Server,
  Box,
  Bot,
  Sparkles,
  // Natijalar va Savollar bo'limlari uchun — keyinroq yoqiladi:
  // Trophy,
  // MessageCircleQuestion,
  // Star,
  // Quote,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "courses", label: "Kurslar", icon: BookOpen, countKey: "courses" },
  { id: "mentors", label: "Mentorlar", icon: Users, countKey: "mentors" },
  // Hozircha ishga tushirilmagan — keyinroq yoqiladi:
  // { id: "results", label: "Natijalar", icon: Trophy, countKey: "results" },
  // { id: "questions", label: "Savollar", icon: MessageCircleQuestion, countKey: "questions" },
];

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-cyan-500",
];

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
    return {
      icon: Code2,
      style: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
    };
  }

  if (
    lower.includes("back") ||
    lower.includes("node") ||
    lower.includes("python") ||
    lower.includes("php") ||
    lower.includes("java") ||
    lower.includes("sql")
  ) {
    return {
      icon: Server,
      style: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    };
  }

  if (
    lower.includes("3d") ||
    lower.includes("max") ||
    lower.includes("blender") ||
    lower.includes("design") ||
    lower.includes("graphic")
  ) {
    return {
      icon: Box,
      style: "bg-orange-500/10 text-orange-600 border border-orange-500/20",
    };
  }

  if (
    lower.includes("ai") ||
    lower.includes("sun'iy") ||
    lower.includes("intelligence") ||
    lower.includes("chatgpt")
  ) {
    return {
      icon: Sparkles,
      style: "bg-purple-500/10 text-purple-600 border border-purple-500/20",
    };
  }

  if (lower.includes("bot") || lower.includes("telegram")) {
    return {
      icon: Bot,
      style: "bg-cyan-500/10 text-cyan-600 border border-cyan-500/20",
    };
  }

  return {
    icon: BookOpen,
    style: "bg-gray-500/10 text-gray-600 border border-gray-500/20",
  };
};

function Admin({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [mentorModalOpen, setMentorModalOpen] = useState(false);

  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingMentorId, setEditingMentorId] = useState(null);

  const [courses, setCourses] = useState([]);
  const [mentors, setMentors] = useState([]);

  const [courseSearch, setCourseSearch] = useState("");
  const [mentorSearch, setMentorSearch] = useState("");

  const [courseTitle, setCourseTitle] = useState("");
  const [courseMentor, setCourseMentor] = useState("");
  const [courseStudents, setCourseStudents] = useState("");

  const [mentorName, setMentorName] = useState("");
  const [mentorField, setMentorField] = useState("");

  // Hozircha ishga tushirilmagan — Natijalar va Savollar uchun state'lar (keyinroq yoqiladi):
  // const [resultModalOpen, setResultModalOpen] = useState(false);
  // const [questionModalOpen, setQuestionModalOpen] = useState(false);
  // const [editingResultId, setEditingResultId] = useState(null);
  // const [editingQuestionId, setEditingQuestionId] = useState(null);
  // const [results, setResults] = useState([]);
  // const [questions, setQuestions] = useState([]);
  // const [resultSearch, setResultSearch] = useState("");
  // const [questionSearch, setQuestionSearch] = useState("");
  // const [resultName, setResultName] = useState("");
  // const [resultCourse, setResultCourse] = useState("");
  // const [resultAchievement, setResultAchievement] = useState("");
  // const [resultRating, setResultRating] = useState("");
  // const [questionTitle, setQuestionTitle] = useState("");
  // const [questionAnswer, setQuestionAnswer] = useState("");

  const activeItem = NAV_ITEMS.find((item) => item.id === activeTab);

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

  const openAddCourse = () => {
    setEditingCourseId(null);
    setCourseTitle("");
    setCourseMentor("");
    setCourseStudents("");
    setCourseModalOpen(true);
  };

  const openEditCourse = (course) => {
    setEditingCourseId(course.id);
    setCourseTitle(course.title || "");
    setCourseMentor(course.mentor || "");
    setCourseStudents(String(course.students ?? ""));
    setCourseModalOpen(true);
  };

  const closeCourseModal = () => {
    setCourseModalOpen(false);
    setEditingCourseId(null);
    setCourseTitle("");
    setCourseMentor("");
    setCourseStudents("");
  };

  const submitCourse = async (e) => {
    e.preventDefault();
    if (!courseTitle || !courseMentor) return;

    try {
      if (editingCourseId) {
        await updateDoc(doc(db, "courses", editingCourseId), {
          title: courseTitle,
          mentor: courseMentor,
          students: Number(courseStudents) || 0,
        });
      } else {
        await addDoc(collection(db, "courses"), {
          title: courseTitle,
          mentor: courseMentor,
          students: Number(courseStudents) || 0,
          status: "Faol",
        });
      }

      closeCourseModal();
    } catch (err) {
      console.error("Kursni saqlashda xato:", err);
    }
  };

  const deleteCourse = async (id) => {
    try {
      await deleteDoc(doc(db, "courses", id));
    } catch (err) {
      console.error("Kursni o'chirishda xato:", err);
    }
  };

  const openAddMentor = () => {
    setEditingMentorId(null);
    setMentorName("");
    setMentorField("");
    setMentorModalOpen(true);
  };

  const openEditMentor = (mentor) => {
    setEditingMentorId(mentor.id);
    setMentorName(mentor.name || "");
    setMentorField(mentor.field || "");
    setMentorModalOpen(true);
  };

  const closeMentorModal = () => {
    setMentorModalOpen(false);
    setEditingMentorId(null);
    setMentorName("");
    setMentorField("");
  };

  const submitMentor = async (e) => {
    e.preventDefault();
    if (!mentorName || !mentorField) return;

    try {
      if (editingMentorId) {
        await updateDoc(doc(db, "mentors", editingMentorId), {
          name: mentorName,
          field: mentorField,
        });
      } else {
        await addDoc(collection(db, "mentors"), {
          name: mentorName,
          field: mentorField,
          status: "Faol",
          color: AVATAR_COLORS[mentors.length % AVATAR_COLORS.length],
        });
      }

      closeMentorModal();
    } catch (err) {
      console.error("Mentorni saqlashda xato:", err);
    }
  };

  const deleteMentor = async (id) => {
    try {
      await deleteDoc(doc(db, "mentors", id));
    } catch (err) {
      console.error("Mentorni o'chirishda xato:", err);
    }
  };

  // Hozircha ishga tushirilmagan — Natijalar va Savollar handler'lari (keyinroq yoqiladi):
  /*
  // --- Natijalar (results) ---
  const openAddResult = () => {
    setEditingResultId(null);
    setResultName("");
    setResultCourse("");
    setResultAchievement("");
    setResultRating("");
    setResultModalOpen(true);
  };

  const openEditResult = (result) => {
    setEditingResultId(result.id);
    setResultName(result.name || "");
    setResultCourse(result.course || "");
    setResultAchievement(result.achievement || "");
    setResultRating(String(result.rating ?? ""));
    setResultModalOpen(true);
  };

  const closeResultModal = () => {
    setResultModalOpen(false);
    setEditingResultId(null);
    setResultName("");
    setResultCourse("");
    setResultAchievement("");
    setResultRating("");
  };

  const submitResult = async (e) => {
    e.preventDefault();
    if (!resultName || !resultAchievement) return;

    const rating = Math.min(5, Math.max(0, Number(resultRating) || 0));

    try {
      if (editingResultId) {
        await updateDoc(doc(db, "results", editingResultId), {
          name: resultName,
          course: resultCourse,
          achievement: resultAchievement,
          rating,
        });
      } else {
        await addDoc(collection(db, "results"), {
          name: resultName,
          course: resultCourse,
          achievement: resultAchievement,
          rating,
          color: AVATAR_COLORS[results.length % AVATAR_COLORS.length],
        });
      }

      closeResultModal();
    } catch (err) {
      console.error("Natijani saqlashda xato:", err);
    }
  };

  const deleteResult = async (id) => {
    try {
      await deleteDoc(doc(db, "results", id));
    } catch (err) {
      console.error("Natijani o'chirishda xato:", err);
    }
  };

  // --- Savollar (questions / FAQ) ---
  const openAddQuestion = () => {
    setEditingQuestionId(null);
    setQuestionTitle("");
    setQuestionAnswer("");
    setQuestionModalOpen(true);
  };

  const openEditQuestion = (question) => {
    setEditingQuestionId(question.id);
    setQuestionTitle(question.title || "");
    setQuestionAnswer(question.answer || "");
    setQuestionModalOpen(true);
  };

  const closeQuestionModal = () => {
    setQuestionModalOpen(false);
    setEditingQuestionId(null);
    setQuestionTitle("");
    setQuestionAnswer("");
  };

  const submitQuestion = async (e) => {
    e.preventDefault();
    if (!questionTitle || !questionAnswer) return;

    try {
      if (editingQuestionId) {
        await updateDoc(doc(db, "questions", editingQuestionId), {
          title: questionTitle,
          answer: questionAnswer,
        });
      } else {
        await addDoc(collection(db, "questions"), {
          title: questionTitle,
          answer: questionAnswer,
        });
      }

      closeQuestionModal();
    } catch (err) {
      console.error("Savolni saqlashda xato:", err);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await deleteDoc(doc(db, "questions", id));
    } catch (err) {
      console.error("Savolni o'chirishda xato:", err);
    }
  };
  */

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
      course.mentor.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(mentorSearch.toLowerCase()) ||
      mentor.field.toLowerCase().includes(mentorSearch.toLowerCase())
  );

  // Hozircha ishga tushirilmagan — keyinroq yoqiladi:
  // const filteredResults = results.filter(
  //   (result) =>
  //     (result.name || "").toLowerCase().includes(resultSearch.toLowerCase()) ||
  //     (result.achievement || "").toLowerCase().includes(resultSearch.toLowerCase()) ||
  //     (result.course || "").toLowerCase().includes(resultSearch.toLowerCase())
  // );
  // const filteredQuestions = questions.filter(
  //   (question) =>
  //     (question.title || "").toLowerCase().includes(questionSearch.toLowerCase()) ||
  //     (question.answer || "").toLowerCase().includes(questionSearch.toLowerCase())
  // );

  return (
    <div className="min-h-screen bg-[#f6f8f7] text-[#111816] font-['Plus_Jakarta_Sans']">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}
      </style>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-[260px]
          border-r border-[#e4e9e6] bg-white
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex h-[82px] items-center border-b border-[#edf0ee] px-7">
          <div className="flex flex-col items-start gap-1">
            <img
              src="/imgs/logo.png"
              alt="iTeach"
              className="h-8 w-auto object-contain"
            />
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400">
              Admin Panel
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[2px] text-gray-400">
            Bo'limlar
          </p>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            const count =
              item.countKey === "courses"
                ? courses.length
                : item.countKey === "mentors"
                ? mentors.length
                : null;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#eaf7f0] text-[#159447]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#159447]"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    isActive ? "bg-white" : ""
                  }`}
                >
                  <Icon size={17} />
                </span>

                {item.label}

                {count !== null && (
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-white text-[#159447]"
                        : "bg-[#eaf7f0] text-[#159447]"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 w-full border-t border-[#edf0ee] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-[#f7f9f8] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111816] text-sm font-bold text-white">
              A
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold">Admin</p>
              <p className="truncate text-xs text-gray-400">admin@iteach.uz</p>
            </div>

            <button
              onClick={onLogout}
              className="ml-auto text-gray-400 transition hover:text-red-500"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      <main className="lg:ml-[260px]">
        <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-[#e7ebe9] bg-white/90 px-5 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-gray-200 p-2 lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div>
              <h2 className="text-xl font-extrabold tracking-tight">
                {activeItem ? activeItem.label : "Dashboard"}
              </h2>

              <div className="hidden items-center gap-1 text-xs text-gray-400 sm:flex">
                <span>Admin</span>
                <ChevronRight size={13} />
                <span>{activeItem ? activeItem.label : "Dashboard"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-xl border border-[#e6ebe8] bg-white p-2.5 transition hover:border-[#159447]">
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#159447]" />
            </button>

            <div className="hidden h-8 w-px bg-gray-200 sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111816] text-xs font-bold text-white">
                A
              </div>

              <div className="hidden sm:block">
                <p className="text-xs font-bold">Administrator</p>
                <p className="text-[10px] text-gray-400">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-5 md:p-8">
          {activeTab === "dashboard" && (
            <>
              <section className="relative mb-8 overflow-hidden rounded-[24px] border border-[#e5ebe7] bg-white p-6 md:p-8">
                <div className="pointer-events-none absolute -right-10 top-1/2 hidden h-[220px] w-[220px] -translate-y-1/2 rounded-full bg-[#54dc8a]/10 md:block">
                  <div className="m-10 h-28 w-28 rounded-full bg-[#54dc8a]/40 shadow-[0_0_70px_rgba(84,220,138,0.4)]" />
                </div>

                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-[#5b6a60]">
                      Xush kelibsiz, Admin 👋
                    </p>

                    <h1 className="relative z-10 max-w-xl text-2xl font-extrabold leading-tight text-[#0b120e] md:text-3xl">
                      iTeach platformasini
                      <span className="text-[#159447]"> boshqaring.</span>
                    </h1>

                    <p className="relative z-10 mt-3 max-w-lg text-sm leading-6 text-[#7c8b80]">
                      Kurslar, mentorlar, o'quvchilar va platformadagi boshqa
                      ma'lumotlarni shu yerdan boshqarishingiz mumkin.
                    </p>
                  </div>

                  <div className="relative hidden h-28 w-28 shrink-0 rounded-full bg-[#54dc8a]/10 md:block">
                    <div className="m-5 h-16 w-16 rounded-full bg-[#54dc8a] shadow-[0_0_50px_rgba(84,220,138,0.4)]" />
                  </div>
                </div>
              </section>

              <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  icon={BookOpen}
                  tint="bg-[#eaf7f0] text-[#159447]"
                  label="Jami kurslar"
                  value={courses.length}
                  badge="+0%"
                  badgeColor="text-[#159447]"
                />
                <StatCard
                  icon={Users}
                  tint="bg-purple-50 text-purple-600"
                  label="Mentorlar"
                  value={mentors.length}
                  badge="+0%"
                  badgeColor="text-purple-600"
                />
                {/* Hozircha ishga tushirilmagan — keyinroq yoqiladi:
                <StatCard
                  icon={Trophy}
                  tint="bg-orange-50 text-orange-500"
                  label="Natijalar"
                  value={results.length}
                  badge="+0%"
                  badgeColor="text-orange-500"
                />
                <StatCard
                  icon={MessageCircleQuestion}
                  tint="bg-blue-50 text-blue-600"
                  label="Savollar"
                  value={questions.length}
                  badge="+0%"
                  badgeColor="text-blue-600"
                />
                */}
              </section>

              <CoursesSection
                courses={filteredCourses}
                searchValue={courseSearch}
                onSearchChange={setCourseSearch}
                onAdd={openAddCourse}
                onEdit={openEditCourse}
                onDelete={deleteCourse}
              />
            </>
          )}

          {activeTab === "courses" && (
            <CoursesSection
              courses={filteredCourses}
              searchValue={courseSearch}
              onSearchChange={setCourseSearch}
              onAdd={openAddCourse}
              onEdit={openEditCourse}
              onDelete={deleteCourse}
              full
            />
          )}

          {activeTab === "mentors" && (
            <MentorsSection
              mentors={filteredMentors}
              searchValue={mentorSearch}
              onSearchChange={setMentorSearch}
              onAdd={openAddMentor}
              onEdit={openEditMentor}
              onDelete={deleteMentor}
              full
            />
          )}

          {/* Hozircha ishga tushirilmagan — keyinroq yoqiladi:
          {activeTab === "results" && (
            <ResultsSection
              results={filteredResults}
              searchValue={resultSearch}
              onSearchChange={setResultSearch}
              onAdd={openAddResult}
              onEdit={openEditResult}
              onDelete={deleteResult}
              full
            />
          )}

          {activeTab === "questions" && (
            <QuestionsSection
              questions={filteredQuestions}
              searchValue={questionSearch}
              onSearchChange={setQuestionSearch}
              onAdd={openAddQuestion}
              onEdit={openEditQuestion}
              onDelete={deleteQuestion}
              full
            />
          )}
          */}
        </div>
      </main>

      {courseModalOpen && (
        <Modal
          title={editingCourseId ? "Kursni tahrirlash" : "Yangi kurs qo'shish"}
          subtitle="Kurs haqida ma'lumotlarni kiriting"
          onClose={closeCourseModal}
        >
          <form onSubmit={submitCourse}>
            <div className="space-y-5">
              <TextField
                label="Kurs nomi"
                value={courseTitle}
                onChange={setCourseTitle}
                placeholder="Masalan: Frontend Development"
              />

              <div>
                <label className="mb-2 block text-xs font-bold">Mentor</label>

                {mentors.length > 0 ? (
                  <CustomSelect
                    value={courseMentor}
                    onChange={setCourseMentor}
                    placeholder="Mentorni tanlang"
                    options={mentors.map((mentor) => ({
                      value: mentor.name,
                      label: `${mentor.name} (${mentor.field})`,
                    }))}
                  />
                ) : (
                  <TextField
                    label=""
                    value={courseMentor}
                    onChange={setCourseMentor}
                    placeholder="Mentor ismi"
                  />
                )}
              </div>

              <TextField
                label="O'quvchilar soni"
                type="number"
                value={courseStudents}
                onChange={setCourseStudents}
                placeholder="0"
              />
            </div>

            <ModalButtons
              onClose={closeCourseModal}
              submit={editingCourseId ? "O'zgarishni saqlash" : "Kursni qo'shish"}
            />
          </form>
        </Modal>
      )}

      {mentorModalOpen && (
        <Modal
          title={editingMentorId ? "Mentorni tahrirlash" : "Yangi mentor qo'shish"}
          subtitle="Mentor haqida ma'lumotlarni kiriting"
          onClose={closeMentorModal}
        >
          <form onSubmit={submitMentor}>
            <div className="space-y-5">
              <TextField
                label="Mentor ismi"
                value={mentorName}
                onChange={setMentorName}
                placeholder="Masalan: Aziza Yusupova"
              />

              <TextField
                label="Mutaxassislik"
                value={mentorField}
                onChange={setMentorField}
                placeholder="Masalan: Frontend Development"
              />
            </div>

            <ModalButtons
              onClose={closeMentorModal}
              submit={editingMentorId ? "O'zgarishni saqlash" : "Mentorni qo'shish"}
            />
          </form>
        </Modal>
      )}

      {/* Hozircha ishga tushirilmagan — Natijalar va Savollar modallari (keyinroq yoqiladi):
      {resultModalOpen && (
        <Modal
          title={editingResultId ? "Natijani tahrirlash" : "Yangi natija qo'shish"}
          subtitle="O'quvchi natijasi haqida ma'lumot kiriting"
          onClose={closeResultModal}
        >
          <form onSubmit={submitResult}>
            <div className="space-y-5">
              <TextField
                label="O'quvchi ismi"
                value={resultName}
                onChange={setResultName}
                placeholder="Masalan: O'tkirbek Abdumajidov"
              />

              <div>
                <label className="mb-2 block text-xs font-bold">Kurs</label>
                {courses.length > 0 ? (
                  <CustomSelect
                    value={resultCourse}
                    onChange={setResultCourse}
                    placeholder="Kursni tanlang"
                    options={courses.map((course) => ({
                      value: course.title,
                      label: course.title,
                    }))}
                  />
                ) : (
                  <TextField
                    label=""
                    value={resultCourse}
                    onChange={setResultCourse}
                    placeholder="Masalan: Frontend"
                  />
                )}
              </div>

              <TextField
                label="Natija / Yutuq"
                value={resultAchievement}
                onChange={setResultAchievement}
                placeholder="Masalan: Google'da ishga joylashdi"
              />

              <TextField
                label="Baho (0-5)"
                type="number"
                value={resultRating}
                onChange={setResultRating}
                placeholder="5"
              />
            </div>

            <ModalButtons
              onClose={closeResultModal}
              submit={editingResultId ? "O'zgarishni saqlash" : "Natijani qo'shish"}
            />
          </form>
        </Modal>
      )}

      {questionModalOpen && (
        <Modal
          title={editingQuestionId ? "Savolni tahrirlash" : "Yangi savol qo'shish"}
          subtitle="Ko'p so'raladigan savol va javobni kiriting"
          onClose={closeQuestionModal}
        >
          <form onSubmit={submitQuestion}>
            <div className="space-y-5">
              <TextField
                label="Savol"
                value={questionTitle}
                onChange={setQuestionTitle}
                placeholder="Masalan: Kurslar qancha davom etadi?"
              />

              <TextArea
                label="Javob"
                value={questionAnswer}
                onChange={setQuestionAnswer}
                placeholder="Savolga batafsil javob yozing"
              />
            </div>

            <ModalButtons
              onClose={closeQuestionModal}
              submit={editingQuestionId ? "O'zgarishni saqlash" : "Savolni qo'shish"}
            />
          </form>
        </Modal>
      )}
      */}

    </div>
  );
}

function CustomSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-sm font-medium outline-none transition ${
          open
            ? "border-[#159447] ring-4 ring-[#159447]/10"
            : "border-[#dfe5e2] hover:border-[#159447]/50"
        }`}
      >
        <span className={selected ? "text-[#111816]" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-[#e5ebe7] bg-white shadow-lg">
          <div className="max-h-56 overflow-y-auto py-1">
            {options.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-400">
                Variantlar yo'q
              </p>
            ) : (
              options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium transition ${
                    opt.value === value
                      ? "bg-[#eaf7f0] text-[#159447]"
                      : "text-[#111816] hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, tint, label, value, badge, badgeColor, onAdd }) {
  return (
    <div className="group relative rounded-2xl border border-[#e5ebe7] bg-white p-5 transition hover:border-[#159447]/40 hover:shadow-lg hover:shadow-black/5">
      <div className="mb-5 flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tint}`}>
          <Icon size={20} />
        </div>
        <span className={`text-xs font-bold ${badgeColor}`}>{badge}</span>
      </div>

      <p className="text-sm font-medium text-gray-400">{label}</p>
      <h3 className="mt-1 text-2xl font-extrabold">{value}</h3>

      {onAdd && (
        <button
          onClick={onAdd}
          className="absolute bottom-5 right-5 flex h-7 w-7 items-center justify-center rounded-lg border border-[#e5ebe7] text-gray-400 opacity-0 transition group-hover:opacity-100 hover:border-[#159447] hover:text-[#159447]"
        >
          <Plus size={14} />
        </button>
      )}
    </div>
  );
}

function CoursesSection({ courses, searchValue, onSearchChange, onAdd, onEdit, onDelete, full }) {
  return (
    <section className={`rounded-[22px] border border-[#e5ebe7] bg-white ${full ? "" : "mb-8"}`}>
      <div className="flex flex-col gap-4 border-b border-[#edf0ee] p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div>
          <h2 className="text-lg font-extrabold">Kurslar</h2>
          <p className="mt-1 text-xs text-gray-400">Platformadagi barcha kurslarni boshqaring</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchInput value={searchValue} onChange={onSearchChange} placeholder="Kurs qidirish..." />
          <button
            onClick={onAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#111816] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#159447]"
          >
            <Plus size={18} />
            Kurs qo'shish
          </button>
        </div>
      </div>

      {courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="Hali kurs qo'shilmagan" subtitle="Yangi kurs qo'shish uchun tugmani bosing" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#edf0ee] text-left">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Kurs</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Mentor</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">O'quvchilar</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Holat</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">Amal</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                const { icon: CourseIcon, style } = getCourseStyle(course.title);
                return (
                  <tr key={course.id} className="border-b border-[#f0f2f1] last:border-0 transition hover:bg-[#fafcfb]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${style}`}>
                          <CourseIcon size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{course.title}</p>
                          <p className="mt-0.5 text-[11px] text-gray-400">Online kurs</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{course.mentor}</td>
                    <td className="px-6 py-4 text-sm font-bold">{course.students}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-[#eaf7f0] px-3 py-1.5 text-[11px] font-bold text-[#159447]">
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => onEdit(course)} className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => onDelete(course.id)} className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500">
                          <Trash2 size={15} />
                        </button>
                        <button className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-100">
                          <MoreHorizontal size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function MentorsSection({ mentors, searchValue, onSearchChange, onAdd, onEdit, onDelete, full }) {
  return (
    <section className={`rounded-[22px] border border-[#e5ebe7] bg-white ${full ? "" : "mb-8"}`}>
      <div className="flex flex-col gap-4 border-b border-[#edf0ee] p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Users size={18} />
            </div>
            <h2 className="text-lg font-extrabold">Mentorlar</h2>
          </div>
          <p className="mt-2 text-xs text-gray-400">Platformadagi barcha mentorlar ro'yxati</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchInput value={searchValue} onChange={onSearchChange} placeholder="Mentor qidirish..." />
          <button
            onClick={onAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#111816] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#159447]"
          >
            <Plus size={18} />
            Mentor qo'shish
          </button>
        </div>
      </div>

      {mentors.length === 0 ? (
        <EmptyState icon={Users} title="Hali mentor qo'shilmagan" subtitle="Yangi mentor qo'shish uchun tugmani bosing" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="border-b border-[#edf0ee] text-left">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Mentor</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Mutaxassislik</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Holat</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">Amal</th>
              </tr>
            </thead>
            <tbody>
              {mentors.map((mentor) => (
                <tr key={mentor.id} className="border-b border-[#f0f2f1] last:border-0 transition hover:bg-[#fafcfb]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${mentor.color || "bg-purple-500"}`}>
                        {mentor.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{mentor.name}</p>
                        <p className="mt-0.5 text-[11px] text-gray-400">O'qituvchi</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{mentor.field}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-[#eaf7f0] px-3 py-1.5 text-[11px] font-bold text-[#159447]">
                      {mentor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onEdit(mentor)} className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => onDelete(mentor.id)} className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500">
                        <Trash2 size={15} />
                      </button>
                      <button className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-100">
                        <MoreHorizontal size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

// Hozircha ishga tushirilmagan — Natijalar va Savollar bo'lim komponentlari (keyinroq yoqiladi):
/*
function ResultsSection({ results, searchValue, onSearchChange, onAdd, onEdit, onDelete, full }) {
  return (
    <section className={`rounded-[22px] border border-[#e5ebe7] bg-white ${full ? "" : "mb-8"}`}>
      <div className="flex flex-col gap-4 border-b border-[#edf0ee] p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
              <Trophy size={18} />
            </div>
            <h2 className="text-lg font-extrabold">Natijalar</h2>
          </div>
          <p className="mt-2 text-xs text-gray-400">O'quvchilarning yutuqlari va natijalari</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchInput value={searchValue} onChange={onSearchChange} placeholder="Natija qidirish..." />
          <button
            onClick={onAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#111816] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#159447]"
          >
            <Plus size={18} />
            Natija qo'shish
          </button>
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState icon={Trophy} title="Hali natija qo'shilmagan" subtitle="Yangi natija qo'shish uchun tugmani bosing" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#edf0ee] text-left">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">O'quvchi</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Kurs</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Natija</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Baho</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">Amal</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id} className="border-b border-[#f0f2f1] last:border-0 transition hover:bg-[#fafcfb]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${result.color || "bg-orange-500"}`}>
                        {(result.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm font-bold">{result.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{result.course || "—"}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{result.achievement}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < (result.rating || 0) ? "fill-orange-400 text-orange-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onEdit(result)} className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => onDelete(result.id)} className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function QuestionsSection({ questions, searchValue, onSearchChange, onAdd, onEdit, onDelete, full }) {
  return (
    <section className={`rounded-[22px] border border-[#e5ebe7] bg-white ${full ? "" : "mb-8"}`}>
      <div className="flex flex-col gap-4 border-b border-[#edf0ee] p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <MessageCircleQuestion size={18} />
            </div>
            <h2 className="text-lg font-extrabold">Savollar</h2>
          </div>
          <p className="mt-2 text-xs text-gray-400">Ko'p so'raladigan savollar (FAQ)</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchInput value={searchValue} onChange={onSearchChange} placeholder="Savol qidirish..." />
          <button
            onClick={onAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#111816] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#159447]"
          >
            <Plus size={18} />
            Savol qo'shish
          </button>
        </div>
      </div>

      {questions.length === 0 ? (
        <EmptyState icon={MessageCircleQuestion} title="Hali savol qo'shilmagan" subtitle="Yangi savol qo'shish uchun tugmani bosing" />
      ) : (
        <div className="divide-y divide-[#f0f2f1]">
          {questions.map((question) => (
            <div key={question.id} className="flex items-start gap-4 p-5 md:p-6">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eaf7f0] text-[#159447]">
                <Quote size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{question.title}</p>
                <p className="mt-1 text-sm leading-6 text-gray-500">{question.answer}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => onEdit(question)} className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                  <Pencil size={15} />
                </button>
                <button onClick={() => onDelete(question.id)} className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
*/

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#e5ebe7] px-3 py-2.5">
      <Search size={17} className="text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400 sm:w-44"
      />
    </div>
  );
}

function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf7f0] text-[#159447]">
        <Icon size={24} />
      </div>
      <p className="text-sm font-bold">{title}</p>
      <p className="max-w-xs text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[520px] rounded-[24px] bg-white p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-extrabold">{title}</h2>
            <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
          </div>
          <button onClick={onClose} className="rounded-xl bg-gray-100 p-2 text-gray-500 transition hover:bg-gray-200">
            <X size={19} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalButtons({ onClose, submit }) {
  return (
    <div className="mt-7 flex gap-3">
      <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold transition hover:bg-gray-50">
        Bekor qilish
      </button>
      <button type="submit" className="flex-1 rounded-xl bg-[#111816] py-3 text-sm font-bold text-white transition hover:bg-[#159447]">
        {submit}
      </button>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      {label && <label className="mb-2 block text-xs font-bold">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#dfe5e2] px-4 py-3 text-sm outline-none transition focus:border-[#159447] focus:ring-4 focus:ring-[#159447]/10"
      />
    </div>
  );
}

// Hozircha ishga tushirilmagan — Savollar bo'limi bilan birga keyinroq yoqiladi:
/*
function TextArea({ label, value, onChange, placeholder }) {
  return (
    <div>
      {label && <label className="mb-2 block text-xs font-bold">{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-xl border border-[#dfe5e2] px-4 py-3 text-sm outline-none transition focus:border-[#159447] focus:ring-4 focus:ring-[#159447]/10"
      />
    </div>
  );
}
*/

export default Admin;