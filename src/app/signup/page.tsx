import Form from "@/components/signup/form";

export default function SignUp() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 items-center font-mono text-sm lg:flex">
        <Form />
      </div>
    </main>
  );
}
