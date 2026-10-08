import { useState } from "react";
import { User, Lock, Eye, EyeOff, Check, ArrowRight } from "lucide-react";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    resetMessages();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    resetMessages();

    // 1) Admin tekshiruvi
    if (username === "admin" && password === "123") {
      onLogin("admin");
      return;
    }

    // 2) Ro'yxatdan o'tgan foydalanuvchi tekshiruvi (Firestore)
    setLoading(true);
    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        setError("Bunday foydalanuvchi topilmadi. Ro'yxatdan o'ting.");
        setLoading(false);
        return;
      }

      const userDoc = snap.docs[0].data();

      if (userDoc.password === password) {
        onLogin("user");
      } else {
        setError("Login yoki parol noto'g'ri. Ro'yxatdan o'ting.");
      }
    } catch (err) {
      console.error(err);
      setError("Xatolik yuz berdi, qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!username || !password) {
      setError("Login va parolni to'ldiring");
      return;
    }

    if (username === "admin") {
      setError("Bu login band, boshqa login tanlang");
      return;
    }

    if (password !== confirmPassword) {
      setError("Parollar mos kelmadi");
      return;
    }

    setLoading(true);
    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        setError("Bu login band, boshqa login tanlang");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "users"), {
        username,
        password,
        createdAt: Date.now(),
      });

      setSuccess("Ro'yxatdan muvaffaqiyatli o'tdingiz! Endi kiring.");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => switchMode("login"), 1200);
    } catch (err) {
      console.error(err);
      setError("Xatolik yuz berdi, qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const isRegister = mode === "register";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dce8df] via-[#e7efe6] to-[#eef3ec] px-4 py-6 overflow-hidden">
      <div className="relative w-full max-w-[380px]">
        <div className="relative bg-white rounded-[22px] shadow-[0_24px_50px_-16px_rgba(15,40,25,0.18)] px-6 sm:px-7 pt-6 pb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <img
                src="/imgs/logo.png"
                alt="iTeach"
                className="h-8 w-auto object-contain"
              />
            </div>

            <p className="text-[11.5px] text-[#8b9a90] text-right pt-1">
              {isRegister ? (
                <>
                  Hisobingiz bormi?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="text-[#1fae63] font-semibold hover:underline"
                  >
                    Kirish →
                  </button>
                </>
              ) : (
                <>
                  Hisobingiz yo'qmi?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    className="text-[#1fae63] font-semibold hover:underline"
                  >
                    Ro'yxatdan o'ting →
                  </button>
                </>
              )}
            </p>
          </div>

          <h1 className="text-[21px] font-extrabold tracking-tight text-[#0b120e] mb-1">
            {isRegister ? "Ro'yxatdan o'tish" : "Xush kelibsiz!"}
          </h1>

          <p className="text-[13px] text-[#7c8b80] leading-snug mb-5">
            {isRegister
              ? "Yangi hisob yarating va ta'lim yo'lingizni boshlang"
              : "Hisobingizga kiring va o'z ta'lim yo'lingizni davom ettiring"}
          </p>

          <form onSubmit={isRegister ? handleRegister : handleLogin}>
            <Field label="Login" htmlFor="username">
              <div className="relative">
                <User
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-[#9aa8a0] pointer-events-none"
                  strokeWidth={1.8}
                />
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Login kiriting"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e7ebe6] bg-[#f7f9f6] text-[13.5px] text-[#22302a] outline-none transition-all duration-150 hover:border-[#cfd9cf] focus:border-[#3ddc84] focus:bg-white focus:shadow-[0_0_0_4px_rgba(61,220,132,0.14)]"
                />
              </div>
            </Field>

            <Field label="Parol" htmlFor="password">
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-[#9aa8a0] pointer-events-none"
                  strokeWidth={1.8}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#e7ebe6] bg-[#f7f9f6] text-[13.5px] text-[#22302a] outline-none transition-all duration-150 hover:border-[#cfd9cf] focus:border-[#3ddc84] focus:bg-white focus:shadow-[0_0_0_4px_rgba(61,220,132,0.14)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={
                    showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa8a0] hover:text-[#1fae63] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-[18px] h-[18px]" strokeWidth={1.8} />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" strokeWidth={1.8} />
                  )}
                </button>
              </div>
            </Field>

            {isRegister && (
              <Field label="Parolni tasdiqlang" htmlFor="confirmPassword">
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-[#9aa8a0] pointer-events-none"
                    strokeWidth={1.8}
                  />
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e7ebe6] bg-[#f7f9f6] text-[13.5px] text-[#22302a] outline-none transition-all duration-150 hover:border-[#cfd9cf] focus:border-[#3ddc84] focus:bg-white focus:shadow-[0_0_0_4px_rgba(61,220,132,0.14)]"
                  />
                </div>
              </Field>
            )}

            {error && (
              <p className="mb-3 text-[12.5px] font-semibold text-red-500">
                {error}
              </p>
            )}

            {success && (
              <p className="mb-3 text-[12.5px] font-semibold text-[#1fae63]">
                {success}
              </p>
            )}

            {!isRegister && (
              <div className="flex items-center justify-between mb-4 text-[12.5px]">
                <button
                  type="button"
                  onClick={() => setRemember((r) => !r)}
                  className="flex items-center gap-1.5 text-[#5b6a60] select-none"
                >
                  <span
                    className={`w-[17px] h-[17px] rounded-[5px] border-[1.5px] flex items-center justify-center transition-colors duration-150 ${
                      remember
                        ? "bg-[#1fae63] border-[#1fae63]"
                        : "bg-white border-[#cfd9cf]"
                    }`}
                  >
                    {remember && (
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    )}
                  </span>
                  Meni eslab qol
                </button>

                
                 <a href="#"
                  className="text-[#1fae63] font-semibold hover:underline"
                >
                  Parolni unutdingizmi?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-[15px] text-white bg-gradient-to-r from-[#3ddc84] to-[#189358] shadow-[0_10px_24px_-6px_rgba(24,147,88,0.5)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-6px_rgba(24,147,88,0.6)] hover:brightness-105 active:translate-y-0 active:scale-[0.99] disabled:opacity-60"
            >
              <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
              {loading
                ? "Iltimos kuting..."
                : isRegister
                ? "Ro'yxatdan o'tish"
                : "Kirish"}
            </button>
          </form>

          {!isRegister && (
            <>
              <div className="flex items-center gap-3 my-6 text-[12px] text-[#a3ada0]">
                <span className="flex-1 h-px bg-[#ececec]" />
                yoki
                <span className="flex-1 h-px bg-[#ececec]" />
              </div>

              <div className="flex gap-3">
                <SocialButton label="Google">
                  <path
                    d="M21.8 12.23c0-.75-.07-1.47-.2-2.16H12v4.1h5.5c-.24 1.28-.96 2.36-2.05 3.09v2.56h3.32c1.94-1.79 3.06-4.42 3.06-7.59Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 22c2.77 0 5.09-.92 6.79-2.5l-3.32-2.56c-.92.62-2.1.98-3.47.98-2.67 0-4.93-1.8-5.74-4.22H2.83v2.65C4.52 19.72 7.98 22 12 22Z"
                    fill="#34A853"
                  />
                  <path
                    d="M6.26 13.7A5.98 5.98 0 0 1 6.26 10.3V7.65H2.83a10 10 0 0 0 0 8.7l3.43-2.65Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 6.06c1.5 0 2.85.52 3.91 1.53l2.93-2.93C17.08 3.03 14.77 2 12 2 7.98 2 4.52 4.28 2.83 7.65l3.43 2.65C7.07 7.87 9.33 6.06 12 6.06Z"
                    fill="#EA4335"
                  />
                </SocialButton>

                <SocialButton label="Facebook">
                  <path
                    d="M22 12.06c0-5.6-4.4-10.06-10-10.06S2 6.46 2 12.06C2 17.06 5.66 21.2 10.44 22v-7.03H7.9v-2.9h2.53V9.87c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.86h2.78l-.45 2.9h-2.33V22C18.34 21.2 22 17.06 22 12.06Z"
                    fill="#4267B2"
                  />
                </SocialButton>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, htmlFor, children }) {
  return (
    <div className="mb-4">
      <label
        htmlFor={htmlFor}
        className="block text-[12.5px] font-semibold text-[#3a4740] mb-1.5"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function SocialButton({ label, children }) {
  return (
    <button
      type="button"
      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#e7ebe6] bg-white font-semibold text-[13.5px] text-[#33403a] transition-all duration-150 hover:border-[#cfd9cf] hover:bg-[#f7f9f6] hover:-translate-y-0.5"
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
        {children}
      </svg>
      {label}
    </button>
  );
}