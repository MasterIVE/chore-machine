function Register() {
  return (
    <div className="min-h-screen flex font-body text-ink">
      <div className="hidden md:flex w-[42%] bg-navy-deep text-white p-10 flex-col justify-between">
          <div className="logo"><div className="mark"></div> Chore Machine</div>
          <div>
            <div className="tagline">Set up your account, then start a group in under a minute.</div>
          </div>
          <div className="palette-preview">
            <div className="swatch-blob bg:var(--member-c)" ></div>
            <div className="swatch-blob bg:var(--salmon)" ></div>
            <div className="swatch-blob bg:var(--member-e)"></div>
            <div className="swatch-blob bg:var(--member-d) "></div>
          </div>
        </div>
    <div className="flex-1 bg-sky flex items-center justify-center p-10">

          <form action="" className="flex flex-col gap-3 w-full">
          <div>
            <h2 className="font-display text-xl text-navy-deep mb-1.5">Create your account</h2>
            <p className="text-sm text-slate mb-6">Takes about 30 seconds.</p>
          </div>

            <label className="field-label">Full name: </label>
            <input className="field placeholder" placeholder="Your Name" />

            <label className="field-label">Email: </label>
            <input className="field placeholder" placeholder="you@gmail.com" />

            <label className="field-label">Password: </label>
            <input className="field placeholder" type="password" placeholder="••••••••••" />

            <label className="field-label">Confirm password: </label>
            <input className="field placeholder" type="password" placeholder="••••••••••" />

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