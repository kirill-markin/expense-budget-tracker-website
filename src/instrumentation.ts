export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { default: nodeProcess } = await import("node:process");

    nodeProcess.stdout.write(
      `${JSON.stringify({
        event: "runtime_versions",
        node: nodeProcess.version,
        undici: nodeProcess.versions.undici,
      })}\n`
    );
  }
}
