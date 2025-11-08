import { User } from "@/app/(dashboard)/users/columns";

export const getGreeting = (user: User) => {
  if (!user) return { greeting: "", message: "" };
  const hour = new Date().getHours();
  let greeting;
  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }
  return {
    greeting: `${greeting}, ${user.name.split(" ")[0]}!`,
    message: "Here's your productivity snapshot for today.",
  };
};
