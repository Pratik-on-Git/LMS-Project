import Image from "next/image";
import { MotionMain, MotionButton } from "@/components/ui/animated";
import { CardDescriptionWhite, CardTitle, CardBlue } from "@/components/ui/card";
  
export default function Home() {
  return (
    <MotionMain className="flex min-h-screen flex-col items-center justify-center p-24 bg--light-turquoise">
      <CardBlue className="flex flex-col items-center justify-center">
        <Image src="/favicon.png" alt="Neo LMS logo" width={50} height={50} priority/>
        <div className="flex flex-col gap-1 text-center">
          <CardTitle className="font--font-space-grotesk">Welcome to Neo LMS</CardTitle>
          <CardDescriptionWhite>
            Your learning management system at your fingertips.
          </CardDescriptionWhite>
        </div>
      </CardBlue>
      <MotionButton
        type="button"
        className="mt-6 bg--turquoise text--black font--font-space-grotesk flex flex-col items-center justify-center gap-6 rounded-sm px-6 py-3 shadow-sm font-medium"
        aria-label="Coming Soon"
      >
        Coming Soon
      </MotionButton>
    </MotionMain>
  );
}
