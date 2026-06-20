"use client";

import { AuthGuard } from "@/components/layout/auth-guard";
import { AssessmentPageClient } from "@/components/assessment/assessment-page-client";
import { ASSESSMENT_MODES } from "@/lib/constants";

export default function GlobalAssessmentPage() {
  return (
    <AuthGuard role="candidate">
      <AssessmentPageClient
        mode="global"
        title={ASSESSMENT_MODES.global}
      />
    </AuthGuard>
  );
}
