type BodyProps = {
  heading?: () => React.ReactNode;
  children: React.ReactNode;
};

export default function Body({ heading, children }: BodyProps) {
  return (
    <div className="space-y-4">
      <div className="bg-green-900/70 text-white space-y-4 px-4 py-6 lg:rounded-md">
        <div>
          <h1 className="text-yellow-400 text-3xl font-bold">Little Lemon</h1>
          <h2 className="text-xl font-semibold">Chicago</h2>
        </div>
        {heading && <div className="mt-4">{heading()}</div>}
      </div>
      {children}
    </div>
  );
}
