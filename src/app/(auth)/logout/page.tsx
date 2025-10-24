// Anywhere (RSC or client)
import { signOut } from "@/app/(auth)/actions";

export default function SignOutForm() {
  return (
    <form action={signOut}>
      <button className="rounded-md border px-3 py-2">Sign out</button>
    </form>
  );
}
