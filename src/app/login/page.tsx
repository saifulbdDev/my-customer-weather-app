import Form from "@/components/login/form";

export default async function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 items-center font-mono text-sm lg:flex">
        <Form />
      </div>
    </main>
  );
}
