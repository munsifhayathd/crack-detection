export default function WelcomePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">
        Welcome to CrackDetect
      </h2>
      <p className="text-muted-foreground">
        Use the sidebar to explore the dashboard, upload survey data, review
        detections on the map, and manage processing jobs.
      </p>
    </div>
  );
}
