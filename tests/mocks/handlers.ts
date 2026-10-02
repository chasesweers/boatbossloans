import { http, HttpResponse } from "msw";

// jsdom resolves relative fetch URLs against this origin.
export const API = "http://localhost:3000";

export const handlers = [
  http.post(`${API}/api/newsletter`, async ({ request }) => {
    const body = (await request.json()) as { email?: string };
    if (body.email === "fail@example.com") {
      return HttpResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
    }
    return HttpResponse.json({ ok: true });
  }),
];
