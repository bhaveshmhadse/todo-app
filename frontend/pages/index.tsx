import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/signup");
  }, []);

  return <div>Hello</div>;
}

// https://backend.mhadsebhavesh.workers.dev/
