function Register() {
  return (
    <div className="min-h-screen flex font-body text-ink">
      <div className="hidden md:flex w-[42%] bg-navy-deep text-white p-10 flex-col justify-between">
          <div className="logo"><div className="mark"></div> Chore Machine</div>
          <div>
            <div className="font-display text-2xl font-semibold leading-snug max-w-xs">Set up your account, then start a group in under a minute.</div>
          </div>
          <div className="flex gap-2">
            <span className="w-8 h-8 rounded-[50%_50%_50%_0] bg-member-c rotate-45" />
            <span className="w-8 h-8 rounded-[50%_50%_50%_0] bg-salmon rotate-45" />
            <span className="w-8 h-8 rounded-[50%_50%_50%_0] bg-member-e rotate-45" />
            <span className="w-8 h-8 rounded-[50%_50%_50%_0] bg-member-d rotate-45" />
          </div>
        </div>
    <div className="flex-1 bg-sky flex items-center justify-center p-10">

          <form action="" className="flex flex-col gap-3 w-full">
          <div>
            <h2 className="font-display text-xl text-navy-deep mb-1.5">Create your account</h2>
            <p className="text-sm text-slate mb-6">Takes about 30 seconds.</p>
          </div>

            <label className="text-[11.5px] font-semibold uppercase tracking-wide text-slate">Full name: </label>
            <input className="w-full bg-white border border-slate-light rounded-lg px-3 py-2.5 text-sm mb-4 mt-1" placeholder="Your Name" />

            <label className="text-[11.5px] font-semibold uppercase tracking-wide text-slate">Email: </label>
            <input className="w-full bg-white border border-slate-light rounded-lg px-3 py-2.5 text-sm mb-4 mt-1" placeholder="you@gmail.com" />

            <label className="text-[11.5px] font-semibold uppercase tracking-wide text-slate">Password: </label>
            <input className="w-full bg-white border border-slate-light rounded-lg px-3 py-2.5 text-sm mb-4 mt-1" type="password" placeholder="••••••••••" />

            <label className="text-[11.5px] font-semibold uppercase tracking-wide text-slate">Confirm password: </label>
            <input className="w-full bg-white border border-slate-light rounded-lg px-3 py-2.5 text-sm mb-4 mt-1" type="password" placeholder="••••••••••" />

            <button className="w-full bg-salmon text-ink font-display font-bold py-3 rounded-lg mt-2">
              Create account
            </button>

            <p className="text-center text-xs text-slate mt-4" >
              Already have an account? <span className="text-salmon font-semibold"><a href="/login">Sign in</a></span>
            </p>

          </form>
        </div>  
      </div>  
  )
}
export default Register