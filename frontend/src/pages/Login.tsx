function Login() {

  

  return (

    <div className="min-h-screen flex font-body text-ink">
      
    <div className="hidden md:flex w-[42%] bg-navy-deep text-white p-10 flex-col justify-between">
          <div className="logo"><div className="mark"></div> Chore Machine</div>
          <div>
            <div className="tagline">Don't like the tasks that were generated for you? Dont worry, you can always reroll!</div>
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
          <div className="flex flex-col items-center mb-6">
            <h2 className="font-display text-xl text-navy-deep mb-1.5">Welcome back</h2>
            <p className="text-sm text-slate mb-6">Sign in to your groups and chores.</p>
          </div>

            <label className="text-[11.5px] font-semibold uppercase tracking-wide text-slate">Email: </label>
            <input className="field placeholder" placeholder="you@flat4b.com" />

            <label className="text-[11.5px] font-semibold uppercase tracking-wide text-slate">Password: </label>
            <input className="field placeholder" placeholder="••••••••••" type="password" />

            <button className="w-full bg-salmon text-ink font-display font-bold py-3 rounded-lg">
              <a href="">Sign in</a> 
            </button>

            <div className="auth-divider"><div className="line"></div>or<div className="line"></div></div>
            <button className="auth-submit" type="button">Continue with Google</button>

            <p className="text-center text-xs text-slate mt-4">
              No account? <span className="text-salmon font-semibold"><a href="/register">Register</a></span>
            </p>
        </form>
            
    </div>
    </div>
  )
}
export default Login