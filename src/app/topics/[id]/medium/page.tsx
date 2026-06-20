"use client";

import { useParams } from "next/navigation";
import { AuthGuard } from "@/components/layout/auth-guard";
import { AssessmentPageClient } from "@/components/assessment/assessment-page-client";
import { ASSESSMENT_MODES, TOPIC_LABELS } from "@/lib/constants";
import type { TopicId } from "@/types";

export default function TopicMediumPage() {
  const params = useParams();
  const id = params.id as TopicId;

  return (
    <AuthGuard role="candidate">
      <AssessmentPageClient
        mode="medium"
        topicId={id}
        title={`${TOPIC_LABELS[id]} — ${ASSESSMENT_MODES.medium}`}
      />
    </AuthGuard>
  );
}
