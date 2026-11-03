export default {
  async fetch(request: Request) {
    try {
      const [{ createApplication }, { createBlobStore }] = await Promise.all([
        import("../server/application.js"),
        import("../server/storage.js"),
      ]);
      return await createApplication(createBlobStore())(request);
    } catch (error) {
      const detail =
        error instanceof Error
          ? error.message.slice(0, 500)
          : "Unknown startup error";
      console.error("API startup failed:", detail);
      return Response.json(
        {
          error: "API_STARTUP_FAILED",
          message: "Server xidmətini işə salmaq alınmadı.",
        },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }
  },
};
