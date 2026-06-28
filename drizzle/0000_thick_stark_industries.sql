CREATE TABLE "entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"sentiment_score" real,
	"reflected_phrase" text,
	"open_question" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weekly_summaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"week_start" date NOT NULL,
	"top_topics" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"mood_trend" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"relief_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
