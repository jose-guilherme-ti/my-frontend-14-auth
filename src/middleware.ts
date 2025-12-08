export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/users",
    "/posts",
    "/stepper",
    "/progresso",
    "/post_subcription",
    "/create_post"
  ],
};
