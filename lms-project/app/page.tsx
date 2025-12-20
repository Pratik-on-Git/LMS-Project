import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col z-10 w-full max-w-5xl items-center justify-center text-sm lg:flex">
        <Image
        className="gap-10"
          src="/favicon.png"
          alt="Neo LMS logo"
          width={150}
          height={150}
          priority
        />
        </div>
    </main>
  );
}
