import Cell from '@/components/cell';

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Use JavaScript to create your dataset.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Basic JavaScript is supported. Library imports, like importing langchain, are coming soon.
          This code will later be executed on the server to create your dataset.
        </p>
      </div>
      <div className="mt-4 w-[700px]">
        <Cell />
      </div>
      {Array.from(Array(10).keys()).map((i: number) => {
        return (
          <div
            key={i}
            className="flex h-36 w-full items-center justify-center rounded-full bg-gray-100 text-gray-500"
          >
            <p>Content {i}</p>
          </div>
        );
      })}
    </section>
  );
}
