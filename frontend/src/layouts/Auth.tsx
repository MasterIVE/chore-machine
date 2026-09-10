// layouts/AuthShell.tsx
function Auth({
  tagline,
  children,
}: {
  tagline: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex font-body text-ink">
      {/* Brand side — fixed across Login/Register */}
      <div className="hidden md:flex w-[42%] bg-navy-deep text-white p-10 flex-col justify-between">
        <div className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="w-6 h-6 rounded-[50%_50%_50%_0] bg-salmon rotate-45" />
          Chore Machine
        </div>

        <p className="font-display text-2xl font-semibold leading-snug max-w-xs">
          {tagline}
        </p>

        <div className="flex gap-2">
          <span className="w-8 h-8 rounded-[50%_50%_50%_0] bg-member-c rotate-45" />
          <span className="w-8 h-8 rounded-[50%_50%_50%_0] bg-salmon rotate-45" />
          <span className="w-8 h-8 rounded-[50%_50%_50%_0] bg-member-e rotate-45" />
          <span className="w-8 h-8 rounded-[50%_50%_50%_0] bg-member-d rotate-45" />
        </div>
      </div>

      {/* Form side */}
      <div className="flex-1 bg-sky flex items-center justify-center p-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
export default Auth;