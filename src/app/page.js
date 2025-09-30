// "use client";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/book-cover");
} 

// "use client";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function Home() {
//   const router = useRouter();

//   useEffect(() => {
//     router.replace("/book-cover"); // safer than push for initial redirect
//   }, [router]);

//   return <div>Redirecting...</div>;
// }


// "use client";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function Home() {
//   const router = useRouter();

//   useEffect(() => {
//     router.push("/book-cover");
//   }, [router]);

//   return null;
// }