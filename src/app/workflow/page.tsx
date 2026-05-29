import WorkflowPage from "@/components/workflow/WorkflowPage";

export const metadata = {
  title: "Bits AI Lab — Workflow Canvas",
  description:
    "An AI automation pipeline, live. Bits AI Lab builds this for your business.",
  robots: { index: false, follow: false },
};

export default function WorkflowRoute() {
  return <WorkflowPage />;
}
