import { useState, type ChangeEvent, type SubmitEvent } from "react";

type Errors = Record<string, string>;

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? (
    <p role="alert" className="text-xs text-red-600 -mt-3 mb-3">
      {msg}
    </p>
  ) : null;

function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const validate = (): Errors => {
    const e: Errors = {};
    if (!/^\S+@\S+\.\S+$/.test(values.email)) e.email = "Enter a valid email";
    if (!values.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));

        if (res.status === 400) {
          // DRF validation shape, e.g. { email: ["This field is required."] }
          const serverErrors: Errors = {};
          for (const [key, val] of Object.entries(body)) {
            serverErrors[key] = Array.isArray(val) ? String(val[0]) : String(val);
          }
          setFormError(serverErrors.non_field_errors ?? null);
          setErrors(serverErrors);
          return;
        }
        if (res.status === 401) {
          setFormError("Incorrect email or password.");
          return;
        }
        throw new Error(
          res.status >= 500 ? "Server error. Try again later." : "Sign in failed."
        );
      }

      window.location.href = "/";
    } catch (err) {
      if (err instanceof TypeError) setFormError("Network error. Check your connection.");
      else if (err instanceof Error) setFormError(err.message);
      else setFormError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const labelClass = "text-[11.5px] font-semibold uppercase tracking-wide text-slate";
  const inputClass =
    "w-full bg-white border border-slate-light rounded-lg px-3 py-2.5 text-sm mb-4 mt-1";

  return (
    <div className="min-h-screen flex font-body text-ink">
      <div className="hidden md:flex w-[42%] bg-navy-deep text-white p-10 flex-col justify-between">
        <div className="logo">
          <div className="mark"></div> Chore Machine
        </div>
        <div>
          <div className="font-display text-2xl font-semibold leading-snug max-w-xs">
            Don't like the tasks that were generated for you? Don't worry, you can always reroll!
          </div>
        </div>
        <div className="flex gap-2">
          <span className="w-8 h-8 rounded-[50%_50%_50%_0] bg-member-c rotate-45" />
          <span className="w-8 h-8 rounded-[50%_50%_50%_0] bg-salmon rotate-45" />
          <span className="w-8 h-8 rounded-[50%_50%_50%_0] bg-member-e rotate-45" />
          <span className="w-8 h-8 rounded-[50%_50%_50%_0] bg-member-d rotate-45" />
        </div>
      </div>

      <div className="flex-1 bg-sky flex items-center justify-center p-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          <div className="flex flex-col items-center mb-6">
            <h2 className="font-display text-xl text-navy-deep mb-1.5">Welcome back</h2>
            <p className="text-sm text-slate mb-6">Sign in to your groups and chores.</p>
          </div>

          {formError && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}

          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" name="email" type="email" value={values.email}
            onChange={handleChange} aria-invalid={!!errors.email}
            className={inputClass} placeholder="you@google.com" />
          <FieldError msg={errors.email} />

          <label htmlFor="password" className={labelClass}>Password</label>
          <input id="password" name="password" type="password" value={values.password}
            onChange={handleChange} aria-invalid={!!errors.password}
            className={inputClass} placeholder="••••••••••" />
          <FieldError msg={errors.password} />

          <button type="submit" disabled={submitting}
            className="w-full bg-salmon text-ink font-display font-bold py-3 rounded-lg disabled:opacity-60">
            {submitting ? "Signing in..." : "Sign in"}
          </button>

          <div className="auth-divider">
            <div className="line"></div>or<div className="line"></div>
          </div>
          <button className="auth-submit" type="button">Continue with Google</button>

          <p className="text-center text-xs text-slate mt-4">
            No account?{" "}
            <a href="/register" className="text-salmon font-semibold">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;