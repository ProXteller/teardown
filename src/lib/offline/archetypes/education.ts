import type { ArchetypeTemplate } from '../types';

export const archetype: ArchetypeTemplate = {
  id: 'education',
  label: 'Learning platform & school',
  keywords: [
    'learn',
    'learning',
    'e-learning',
    'online courses',
    'courses',
    'course',
    'lessons',
    'classes',
    'curriculum',
    'quiz',
    'practice',
    'study',
    'tutoring',
    'homework',
    'certificate',
    'academy',
    'bootcamp',
    'language learning',
    'lms',
    'learning management system',
    'university',
    'college',
    'school',
    'school district',
    'students',
    'student portal',
    'faculty',
    'teachers',
    'campus',
    'admissions',
    'enroll',
    'enrollment',
    'degree',
    'tuition',
    'financial aid',
    'scholarship',
    'alumni',
    'edu',
  ],
  tagline: '{{name}} helps people learn, with courses, lessons and quizzes that keep track of progress along the way.',
  eli5:
    "Think of {{name}} as a school building turned into software. Courses are the classrooms, lessons and quizzes are the handouts, and a database acts as the teacher's gradebook, remembering exactly what each student finished and scored. When you watch a lesson or answer a quiz, your progress is saved on the server so you can pick up on any device, and teachers see the results on their dashboards. Universities usually connect several systems: a public website, a learning management system (LMS) for classes, and a student records system, all reached with one school login.",

  languages: [
    { name: 'TypeScript / JavaScript', usedFor: 'Course pages, the lesson player, quizzes and dashboards', share: 30 },
    { name: 'Python', usedFor: 'Backend APIs (for example Django), grading and learning analytics', share: 20 },
    { name: 'PHP', usedFor: 'Moodle, and Drupal or WordPress school websites', share: 15 },
    { name: 'SQL', usedFor: 'Courses, enrollments, progress and grades', share: 15 },
    { name: 'Ruby', usedFor: 'Rails-based LMSs such as Canvas', share: 10 },
    { name: 'Swift / Kotlin', usedFor: 'iOS and Android learning apps', share: 10 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'TypeScript',
          role: 'Lesson, quiz and dashboard screens',
          beginnerNote:
            'TypeScript labels data (this is a score, this is a list of lessons) so bugs like adding text to a number are caught before students ever see them.',
        },
        {
          name: 'HLS video player (hls.js / Video.js)',
          role: 'Smooth lecture videos',
          beginnerNote:
            'Videos are cut into small chunks at several qualities, and the player switches quality as your internet speeds up or slows down, instead of freezing.',
        },
        {
          name: 'Accessibility (WCAG)',
          role: 'Usable by every student',
          beginnerNote:
            'Captions, keyboard navigation and screen-reader labels let students with disabilities learn too. Schools are often legally required to provide this.',
        },
      ],
    },
    {
      layer: 'Mobile',
      items: [
        {
          name: 'React Native or native Swift / Kotlin',
          role: 'Learning on phones',
          beginnerNote:
            'Many students do their practice on a phone, so learning platforms build apps that send reminders and feel fast.',
        },
        {
          name: 'Offline downloads',
          role: 'Study without internet',
          beginnerNote:
            'Lessons can be saved to the device and progress is sent to the server later, when the phone is back online.',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Django, Ruby on Rails or Node.js',
          role: 'LMS API',
          beginnerNote:
            'The server handles the rules of school: who is enrolled, which lesson unlocks next, and grading quizzes where students cannot peek at the answer key.',
        },
        {
          name: 'Single sign-on (SAML / OpenID Connect)',
          role: 'One school login for everything',
          beginnerNote:
            'You log in once on your school\'s login page (often Shibboleth, Okta, Microsoft Entra ID or Google), and every campus system trusts that login.',
        },
        {
          name: 'LTI 1.3',
          role: 'Plugging tools into the LMS',
          beginnerNote:
            'A standard that lets outside tools, like a coding exercise site, open inside a course and send grades back to the gradebook.',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'PostgreSQL',
          role: 'Courses, enrollments and grades',
          beginnerNote:
            'A relational database keeps grades correct and consistent: a quiz attempt can never point to a course or student that does not exist.',
        },
        {
          name: 'Redis',
          role: 'Sessions, streaks and leaderboards',
          beginnerNote:
            'A super-fast in-memory store that is perfect for things checked constantly, like your daily streak or the top ten on a class leaderboard.',
        },
        {
          name: 'Data warehouse (BigQuery / Snowflake)',
          role: 'Learning analytics',
          beginnerNote:
            'A database built for big questions over millions of answers, such as "which quiz question do most students get wrong?"',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Amazon S3 + video transcoding',
          role: 'Storing and preparing lecture videos',
          beginnerNote:
            'Teachers upload one video file, and a transcoding job converts it into smaller streaming versions for phones, laptops and slow connections.',
        },
        {
          name: 'Background jobs (Celery / Sidekiq)',
          role: 'Work that can wait',
          beginnerNote:
            'Tasks like sending reminder emails, making certificates or syncing class rosters run in the background so pages stay fast.',
        },
        {
          name: 'Student information system (SIS)',
          role: 'Official records for schools',
          beginnerNote:
            'Universities keep official enrollments and final grades in systems like Ellucian Banner, Workday Student or PeopleSoft, which sync with the LMS.',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'Spaced repetition',
          role: 'Scheduling reviews',
          beginnerNote:
            'Practice apps bring back each fact right before you are likely to forget it, which helps memory far more than cramming.',
        },
        {
          name: 'Adaptive practice',
          role: 'Right difficulty for each learner',
          beginnerNote:
            'Models estimate what you already know from your answers and pick exercises that are challenging but not impossible.',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      {
        id: 'web',
        label: 'Student & Teacher Site',
        kind: 'client',
        tier: 0,
        tech: '{{frontend}} web app',
        description:
          'The website where students watch lessons and take quizzes, and teachers build courses and check the gradebook.',
      },
      {
        id: 'mobile',
        label: 'Mobile App',
        kind: 'client',
        tier: 0,
        tech: 'React Native or Swift / Kotlin',
        description:
          'The phone app for quick practice sessions, reminders and offline lessons. It uses the same API as the website.',
      },
      {
        id: 'cdn',
        label: 'CDN',
        kind: 'edge',
        tier: 1,
        tech: '{{hosting}}',
        description:
          'Servers around the world that deliver pages, scripts and lecture video chunks from nearby, so a whole class can press play at once.',
      },
      {
        id: 'idp',
        label: 'School Login (SSO)',
        kind: 'external',
        tier: 1,
        tech: 'SAML / OpenID Connect (Shibboleth, Okta, Entra ID, Google)',
        description:
          'The school\'s identity provider. It checks your username, password and two-factor code, then vouches for you to the learning platform.',
      },
      {
        id: 'api',
        label: 'LMS API',
        kind: 'gateway',
        tier: 2,
        tech: 'Django / Rails / Node.js',
        description:
          'The main entry point for app requests. It checks who you are and whether you are enrolled, then passes the work to the right service.',
      },
      {
        id: 'sis',
        label: 'Student Records (SIS)',
        kind: 'external',
        tier: 2,
        tech: 'Banner / Workday Student / PeopleSoft',
        description:
          'The registrar\'s official system of record for schools: who is enrolled in which class section, and final grades.',
      },
      {
        id: 'courses',
        label: 'Course Service',
        kind: 'service',
        tier: 3,
        tech: 'Python service',
        description:
          'Manages courses, modules, lessons and enrollments, and handles video uploads from teachers.',
      },
      {
        id: 'quiz',
        label: 'Quiz & Grading',
        kind: 'service',
        tier: 3,
        tech: 'Python service',
        description:
          'Sends quiz questions without the answers, grades submissions on the server and records every attempt.',
      },
      {
        id: 'progress',
        label: 'Progress Tracking',
        kind: 'service',
        tier: 3,
        tech: 'Node.js or Python service',
        description:
          'Records finished lessons, unlocks what comes next, and updates streaks, XP and completion percentages.',
      },
      {
        id: 'jobs',
        label: 'Background Jobs',
        kind: 'queue',
        tier: 3,
        tech: 'Celery or Sidekiq with a Redis queue',
        description:
          'A to-do list for slower work: reminder emails, certificates, roster imports and sending events to analytics.',
      },
      {
        id: 'db',
        label: 'LMS Database',
        kind: 'database',
        tier: 4,
        tech: 'PostgreSQL',
        description:
          'The gradebook and course catalog: courses, lessons, enrollments, quiz questions, attempts and completion records.',
      },
      {
        id: 'cache',
        label: 'Fast Counters',
        kind: 'cache',
        tier: 4,
        tech: 'Redis',
        description:
          'Keeps login sessions, daily streaks and leaderboards in memory, because they are read on almost every screen.',
      },
      {
        id: 'media',
        label: 'Video & Files',
        kind: 'storage',
        tier: 4,
        tech: 'Amazon S3 + video transcoding',
        description:
          'Stores lecture videos (already converted into streaming chunks), slides, PDFs and homework uploads.',
      },
      {
        id: 'warehouse',
        label: 'Learning Analytics',
        kind: 'database',
        tier: 4,
        tech: 'BigQuery / Snowflake',
        description:
          'A copy of learning events built for analysis, used to find confusing lessons, improve courses and spot students who may need help.',
      },
    ],
    edges: [
      { from: 'web', to: 'cdn', label: 'Pages, videos & API calls' },
      { from: 'mobile', to: 'cdn', label: 'API calls & video chunks' },
      { from: 'cdn', to: 'api', label: 'Dynamic requests' },
      { from: 'cdn', to: 'media', label: 'Video chunks on cache miss' },
      { from: 'web', to: 'idp', label: 'Redirect to school login' },
      { from: 'idp', to: 'api', label: 'Signed login response' },
      { from: 'api', to: 'courses', label: 'Courses & lessons' },
      { from: 'api', to: 'quiz', label: 'Questions & submissions' },
      { from: 'api', to: 'progress', label: 'Lesson completed' },
      { from: 'courses', to: 'db', label: 'Courses & enrollments' },
      { from: 'courses', to: 'media', label: 'Video uploads' },
      { from: 'quiz', to: 'db', label: 'Attempts & scores' },
      { from: 'quiz', to: 'progress', label: 'Passed or failed' },
      { from: 'progress', to: 'db', label: 'Completion records' },
      { from: 'progress', to: 'cache', label: 'Streaks & leaderboards' },
      { from: 'progress', to: 'jobs', label: 'Learning events' },
      { from: 'jobs', to: 'warehouse', label: 'Analytics events' },
      { from: 'sis', to: 'jobs', label: 'Nightly roster sync' },
      { from: 'jobs', to: 'db', label: 'Create enrollments' },
    ],
    flows: [
      {
        id: 'watch-lesson',
        title: 'You watch a lesson',
        emoji: '▶️',
        steps: [
          {
            from: 'web',
            to: 'cdn',
            narration: 'You click "Lesson 3: Loops". The page loads from a nearby CDN server, and its request for the lesson data is passed on.',
          },
          {
            from: 'cdn',
            to: 'api',
            narration: 'Lesson data is different for every student, so the CDN forwards that request to the LMS API.',
          },
          {
            from: 'api',
            to: 'courses',
            narration: 'The API checks your login and asks the course service for the lesson.',
          },
          {
            from: 'courses',
            to: 'db',
            narration:
              'The course service confirms you are enrolled and that Lesson 2 is done, then returns the title, notes and a link to the video.',
          },
          {
            from: 'cdn',
            to: 'media',
            narration:
              'The video player streams the lecture in small chunks from the CDN. If a nearby server lacks a chunk, it fetches it from storage once.',
          },
          {
            from: 'api',
            to: 'progress',
            narration: 'When you reach the end, the player tells the API, which passes "lesson completed" to progress tracking.',
          },
          {
            from: 'progress',
            to: 'cache',
            narration: 'Progress saves the completion and bumps your daily streak, so the flame counter updates right away.',
          },
        ],
      },
      {
        id: 'take-quiz',
        title: 'You submit a quiz',
        emoji: '📝',
        steps: [
          {
            from: 'mobile',
            to: 'cdn',
            narration: 'You pick your answers on your phone and tap Submit. The app sends only your choices, never the answer key.',
          },
          {
            from: 'cdn',
            to: 'api',
            narration: 'The request passes through to the LMS API, which checks your session.',
          },
          {
            from: 'api',
            to: 'quiz',
            narration: 'The quiz service compares your answers with the correct ones stored on the server and calculates your score.',
          },
          {
            from: 'quiz',
            to: 'db',
            narration: 'It saves the attempt, including every answer and the score, so teachers can review it later.',
          },
          {
            from: 'quiz',
            to: 'progress',
            narration: 'You scored 80%, above the 70% pass mark, so progress tracking unlocks the next lesson.',
          },
          {
            from: 'progress',
            to: 'jobs',
            narration: 'A "quiz passed" event is queued, which might trigger a certificate or a congratulations email.',
          },
          {
            from: 'jobs',
            to: 'warehouse',
            narration: 'The event also lands in the analytics warehouse, where teachers can see which questions confuse the most students.',
          },
        ],
      },
      {
        id: 'school-login',
        title: 'A university student logs in',
        emoji: '🎓',
        steps: [
          {
            from: 'sis',
            to: 'jobs',
            narration:
              'Every night before term starts, the registrar\'s student records system sends updated class rosters, and a background job picks them up.',
          },
          {
            from: 'jobs',
            to: 'db',
            narration: 'The job creates an enrollment for each student in each course section, and removes students who dropped.',
          },
          {
            from: 'web',
            to: 'idp',
            narration:
              'On the first day of class you click "Log in with your school account" and are redirected to your university\'s login page, with two-factor authentication.',
          },
          {
            from: 'idp',
            to: 'api',
            narration:
              'The school login sends your browser back with a digitally signed message saying who you are. The API verifies the signature and starts your session.',
          },
          {
            from: 'api',
            to: 'courses',
            narration: 'Your dashboard asks the course service for your courses this term.',
          },
          {
            from: 'courses',
            to: 'db',
            narration: 'Thanks to last night\'s roster sync, all your classes are already there, without you signing up for any of them.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'server/courses/models.py', note: 'Course, Lesson and Enrollment database models' },
    { path: 'server/courses/views.py', note: 'API endpoints for course pages and lesson lists' },
    { path: 'server/quizzes/views.py', note: 'Grades quiz submissions on the server' },
    { path: 'server/quizzes/serializers.py', note: 'Sends questions to the browser without the correct answers' },
    { path: 'server/progress/services.py', note: 'Marks lessons complete and unlocks the next one' },
    { path: 'server/progress/streaks.py', note: 'Updates daily streaks and leaderboards in Redis' },
    { path: 'server/auth/saml.py', note: 'Single sign-on with the school\'s identity provider' },
    { path: 'server/integrations/lti/launch.py', note: 'Opens outside tools inside a course with LTI 1.3' },
    { path: 'workers/roster_sync.py', note: 'Nightly import of class rosters from the SIS' },
    { path: 'workers/reminders.py', note: 'Sends "keep your streak" and assignment-due emails' },
    { path: 'workers/transcode_video.py', note: 'Converts uploaded lectures into streaming chunks' },
    { path: 'shared/review/scheduler.ts', note: 'Spaced repetition: when to review each card' },
    { path: 'db/migrations/0001_courses.sql', note: 'Tables for courses, lessons, enrollments and progress' },
    { path: 'analytics/hardest_questions.sql', note: 'Finds the quiz questions most students miss' },
    { path: 'infra/k8s/lms-api.yaml', note: 'Runs more API servers during exam weeks' },
  ],

  code: [
    {
      id: 'submit-quiz',
      title: 'Grading a quiz on the server',
      file: 'server/quizzes/views.py',
      language: 'Python (Django REST Framework)',
      explanation:
        'This endpoint receives a student\'s answers and grades them on the server. That matters: if the correct answers were sent to the browser, anyone could open the developer tools and read them. It checks that the student is enrolled, counts correct answers, and saves the attempt and the lesson completion inside one database transaction, so a crash can never leave one saved without the other.',
      code: `from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from courses.models import Enrollment
from progress.services import mark_lesson_complete
from .models import Quiz, QuizAttempt

PASSING_SCORE = 0.7


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_quiz(request, quiz_id):
    quiz = get_object_or_404(Quiz, pk=quiz_id)
    course = quiz.lesson.course
    if not Enrollment.objects.filter(user=request.user, course=course).exists():
        return Response({"error": "You are not enrolled in this course"}, status=403)

    answers = request.data.get("answers", {})  # {"question_id": "choice_id"}
    questions = list(quiz.questions.all())
    # Grade on the server: the browser never sees the answer key.
    correct = sum(1 for q in questions if answers.get(str(q.id)) == str(q.correct_choice_id))
    score = correct / len(questions) if questions else 0.0
    passed = score >= PASSING_SCORE

    with transaction.atomic():
        attempt = QuizAttempt.objects.create(
            user=request.user, quiz=quiz, answers=answers, score=score
        )
        if passed:
            mark_lesson_complete(request.user, quiz.lesson)

    return Response(
        {"attempt_id": attempt.id, "score": round(score * 100), "passed": passed,
         "correct": correct, "total": len(questions)}
    )`,
    },
    {
      id: 'lms-schema',
      title: 'Courses, enrollments and progress',
      file: 'db/migrations/0001_courses.sql',
      language: 'SQL (PostgreSQL)',
      explanation:
        'A course has ordered lessons, students join through enrollments, and each finished lesson becomes one row in lesson_progress. Composite primary keys, like (user_id, lesson_id), make it impossible to finish the same lesson twice. The query at the bottom powers a teacher dashboard: for each student it counts completed lessons and turns that into a percentage, using LEFT JOINs so students with zero progress still appear.',
      code: `CREATE TABLE courses (
  id    BIGSERIAL PRIMARY KEY,
  code  TEXT NOT NULL UNIQUE,              -- e.g. CS1428
  title TEXT NOT NULL
);

CREATE TABLE lessons (
  id        BIGSERIAL PRIMARY KEY,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  position  INT NOT NULL,                  -- order inside the course
  title     TEXT NOT NULL,
  video_key TEXT,                          -- file name in object storage
  UNIQUE (course_id, position)
);

CREATE TABLE enrollments (
  user_id   BIGINT NOT NULL,
  course_id BIGINT NOT NULL REFERENCES courses(id),
  role      TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'ta')),
  PRIMARY KEY (user_id, course_id)
);

CREATE TABLE lesson_progress (
  user_id      BIGINT NOT NULL,
  lesson_id    BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, lesson_id)         -- finishing twice counts once
);

-- Teacher dashboard: percent complete for every student in course 42
SELECT e.user_id,
       ROUND(100.0 * COUNT(p.lesson_id) / NULLIF(COUNT(l.id), 0)) AS percent_done
FROM enrollments e
LEFT JOIN lessons l ON l.course_id = e.course_id
LEFT JOIN lesson_progress p ON p.lesson_id = l.id AND p.user_id = e.user_id
WHERE e.course_id = 42 AND e.role = 'student'
GROUP BY e.user_id
ORDER BY percent_done DESC;`,
    },
    {
      id: 'spaced-repetition',
      title: 'Spaced repetition scheduler',
      file: 'shared/review/scheduler.ts',
      language: 'TypeScript',
      explanation:
        'Practice apps decide when to show you a flashcard again using spaced repetition. This is a simplified version of SM-2, a classic algorithm from the SuperMemo software that inspired apps like Anki. Each good answer makes the wait longer (1 day, 6 days, then multiplied by an "ease" factor), a wrong answer starts the card over, and hard answers lower the ease so tricky cards come back more often. Big platforms train their own models for this, but the idea is the same.',
      code: `export interface Card {
  repetitions: number; // correct reviews in a row
  intervalDays: number; // wait this long before the next review
  ease: number; // starts at 2.5; lower means "this card is hard for you"
  dueAt: Date;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** grade: 0 = no idea ... 3 = correct but hard ... 5 = perfect, instant answer */
export function review(card: Card, grade: 0 | 1 | 2 | 3 | 4 | 5, now = new Date()): Card {
  let { repetitions, intervalDays, ease } = card;

  if (grade >= 3) {
    // Remembered: wait longer each time
    if (repetitions === 0) intervalDays = 1;
    else if (repetitions === 1) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * ease);
    repetitions += 1;
  } else {
    // Forgot: see it again tomorrow and rebuild the streak
    repetitions = 0;
    intervalDays = 1;
  }

  // Easy answers raise the ease, hard ones lower it (never below 1.3)
  ease = Math.max(1.3, ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));

  return { repetitions, intervalDays, ease, dueAt: new Date(now.getTime() + intervalDays * DAY_MS) };
}

// A new card answered well three times: due in 1, then 6, then 15 days
let card: Card = { repetitions: 0, intervalDays: 0, ease: 2.5, dueAt: new Date() };
for (const grade of [4, 4, 5] as const) {
  card = review(card, grade);
  console.log(card.intervalDays, card.ease.toFixed(2)); // 1 2.50 / 6 2.50 / 15 2.60
}`,
    },
  ],

  playground: {
    title: 'Lesson quiz',
    description:
      'A mini lesson screen like a learning app or LMS: multiple-choice questions with instant feedback and explanations, a progress bar, XP, a daily streak and a 70% pass mark that unlocks the next lesson.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Lesson quiz</title>
<style>
:root {
  --brand: {{brand}}; /* @tweak color "Brand color" */
  --accent: {{accent}}; /* @tweak color "Selected answer" */
  --correct: #16a34a; /* @tweak color "Correct color" */
  --wrong: #dc2626; /* @tweak color "Wrong color" */
  --radius: 14px; /* @tweak range 0 28 "Corner radius" */
  --bar-height: 12px; /* @tweak range 4 24 "Progress bar height" */
}
* { box-sizing: border-box; }
body { margin: 0; padding: 16px; min-height: 100vh; background: #f7f7fb; color: #1f2937; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.top { display: flex; align-items: center; gap: 12px; }
.bar { flex: 1; height: var(--bar-height); background: #e5e7eb; border-radius: 99px; overflow: hidden; }
.fill { height: 100%; width: 0; background: var(--brand); border-radius: 99px; transition: width .4s; }
.streak { font-weight: 700; color: #ea580c; }
.course { margin: 16px 0 2px; font-size: 13px; color: #6b7280; }
h1 { margin: 0 0 14px; font-size: 22px; }
.card { background: #fff; border-radius: var(--radius); padding: 16px; box-shadow: 0 2px 10px rgba(0,0,0,.06); }
.card small { color: var(--brand); font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: .5px; }
.q { font-size: 18px; font-weight: 600; margin: 6px 0 0; }
.code { background: #111827; color: #a5f3fc; padding: 12px; border-radius: calc(var(--radius) / 2); font-size: 14px; margin: 12px 0 0; overflow-x: auto; }
.choices { display: grid; gap: 10px; margin: 14px 0; }
.choices button { text-align: left; font-size: 16px; padding: 14px; background: #fff; color: inherit; border: 2px solid #e5e7eb; border-bottom-width: 4px; border-radius: var(--radius); cursor: pointer; }
.choices button.picked { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, #fff); }
.choices button.right { border-color: var(--correct); background: color-mix(in srgb, var(--correct) 12%, #fff); }
.choices button.wrong { border-color: var(--wrong); background: color-mix(in srgb, var(--wrong) 12%, #fff); }
.feedback { display: none; padding: 12px 14px; border-radius: var(--radius); margin-bottom: 12px; font-size: 15px; background: #fff; }
.feedback.show { display: block; }
.feedback.ok { color: var(--correct); background: color-mix(in srgb, var(--correct) 14%, #fff); }
.feedback.bad { color: var(--wrong); background: color-mix(in srgb, var(--wrong) 12%, #fff); }
.main { width: 100%; padding: 15px; font-size: 16px; font-weight: 700; color: #fff; background: var(--brand); border: 0; border-radius: var(--radius); cursor: pointer; }
.main:disabled { opacity: .4; cursor: default; }
#done { text-align: center; padding: 16px 0; }
.trophy { font-size: 64px; }
.muted { color: #6b7280; font-size: 14px; }
</style>
</head>
<body>
<div class="top">
  <div class="bar"><div class="fill" id="fill"></div></div>
  <span class="streak">🔥 <span id="streak">3</span></span>
</div>
<p class="course" data-edit="course">{{name}} · Intro to Programming</p>
<h1 data-edit="lesson">Lesson 3: Loops</h1>

<section id="quiz">
  <div class="card">
    <small id="count"></small>
    <p class="q" id="question"></p>
    <pre class="code" id="code"></pre>
  </div>
  <div class="choices" id="choices"></div>
</section>

<section id="done" hidden>
  <div class="trophy">🏆</div>
  <h2 data-edit="doneTitle">Lesson complete!</h2>
  <p id="result"></p>
  <p class="muted" data-edit="doneText">Your progress is saved, so you can continue on any device.</p>
</section>

<div class="feedback" id="feedback"><b id="verdict"></b><span id="explain"></span></div>
<button class="main" id="check" disabled>Check</button>

<script>
// The lesson's questions. On a real site these come from the server WITHOUT the answers.
const questions = [
  { text: 'How many times does this loop print?', code: ['for i in range(3):', '    print(i)'], choices: ['2 times', '3 times', '4 times', 'Forever'], answer: 1, why: 'range(3) gives 0, 1 and 2, which is three numbers.' },
  { text: 'What numbers does range(1, 5) produce?', choices: ['1, 2, 3, 4, 5', '1, 2, 3, 4', '0, 1, 2, 3, 4, 5', '5 random numbers'], answer: 1, why: 'The start is included but the end is not.' },
  { text: 'Which loop keeps going as long as a condition is true?', choices: ['for', 'while', 'if', 'def'], answer: 1, why: 'A while loop checks its condition before every round.' },
  { text: 'What does break do inside a loop?', choices: ['Skips to the next round', 'Stops the loop right away', 'Restarts the loop', 'Causes an error'], answer: 1, why: 'break exits the loop; continue is the one that skips to the next round.' },
  { text: 'What is total after this runs?', code: ['total = 0', 'for n in [2, 4, 6]:', '    total += n'], choices: ['6', '10', '12', '246'], answer: 2, why: '0 + 2 + 4 + 6 = 12.' }
];
const PASS = 0.7; // need 70% to unlock the next lesson
let current = 0, picked = null, checked = false, correct = 0, streak = 3;
const $ = (id) => document.getElementById(id);

// Draw the current question
function show() {
  const q = questions[current];
  picked = null;
  checked = false;
  $('count').textContent = 'Question ' + (current + 1) + ' of ' + questions.length;
  $('question').textContent = q.text;
  $('code').textContent = (q.code || []).join('\\n');
  $('code').hidden = !q.code;
  $('choices').innerHTML = '';
  q.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.textContent = choice;
    btn.onclick = () => {
      if (checked) return;
      picked = i;
      document.querySelectorAll('.choices button').forEach((b, j) => b.classList.toggle('picked', j === i));
      $('check').disabled = false;
    };
    $('choices').appendChild(btn);
  });
  $('feedback').className = 'feedback';
  $('check').textContent = 'Check';
  $('check').disabled = true;
  $('fill').style.width = (current / questions.length) * 100 + '%';
}

// Grade the picked answer and explain why
function check() {
  const q = questions[current];
  const ok = picked === q.answer;
  checked = true;
  if (ok) correct++;
  const buttons = document.querySelectorAll('.choices button');
  buttons[q.answer].classList.add('right');
  if (!ok) buttons[picked].classList.add('wrong');
  $('verdict').textContent = ok ? 'Correct! +10 XP ' : 'Not quite. ';
  $('explain').textContent = q.why;
  $('feedback').className = 'feedback show ' + (ok ? 'ok' : 'bad');
  $('check').textContent = current === questions.length - 1 ? 'See results' : 'Continue';
  $('fill').style.width = ((current + 1) / questions.length) * 100 + '%';
}

// Show the score; passing unlocks the next lesson and grows the streak
function finish() {
  const score = correct / questions.length;
  const passed = score >= PASS;
  if (passed) $('streak').textContent = ++streak;
  $('quiz').hidden = true;
  $('done').hidden = false;
  $('feedback').className = 'feedback';
  $('result').textContent = 'You scored ' + Math.round(score * 100) + '% (' + correct + ' of ' + questions.length + ') and earned ' + correct * 10 + ' XP. ' +
    (passed ? 'Next lesson unlocked 🔓' : 'Score at least 70% to unlock the next lesson.');
  $('check').textContent = passed ? 'Practice again' : 'Try again';
}

$('check').onclick = () => {
  if (!$('done').hidden) {
    current = 0;
    correct = 0;
    $('done').hidden = true;
    $('quiz').hidden = false;
    return show();
  }
  if (!checked) return check();
  current++;
  if (current < questions.length) show();
  else finish();
};
show();
</script>
</body>
</html>`,
    challenges: [
      'Add a sixth question to the questions array about while loops, with four choices and an explanation.',
      'Change PASS from 0.7 to 0.9 and see how much harder it becomes to unlock the next lesson.',
      'Right now a missed question is gone for good. Add it back to the end of the list so the student tries it again, like many learning apps do, and decide how that should affect the score.',
      'Use the "Brand color" and "Progress bar height" tweaks to restyle the lesson in your school\'s colors.',
    ],
  },

  concepts: [
    {
      term: 'LMS (learning management system)',
      meaning:
        'Software that runs online classes: course pages, lessons, assignments, quizzes and a gradebook. Canvas, Moodle, Blackboard and Google Classroom are well-known examples.',
    },
    {
      term: 'Enrollment & rosters',
      meaning:
        'An enrollment links a person to a course with a role like student or teacher. Schools sync rosters from their official student records so the right people land in each class.',
    },
    {
      term: 'Progress tracking & prerequisites',
      meaning:
        'Saving what each learner has finished and using it to unlock the next step, like needing to pass Lesson 2\'s quiz before Lesson 3 opens.',
    },
    {
      term: 'Server-side grading',
      meaning:
        'Checking answers on the server instead of in the browser, because anything sent to the browser, including an answer key, can be read by the user.',
    },
    {
      term: 'Single sign-on (SSO)',
      meaning:
        'Logging in once with one account, such as your school ID, and being trusted by many separate systems like the LMS, email and library, using standards like SAML or OpenID Connect.',
    },
    {
      term: 'LTI (Learning Tools Interoperability)',
      meaning:
        'A standard that lets outside learning tools open inside an LMS course, know who the student is, and send grades back to the gradebook.',
    },
    {
      term: 'Spaced repetition',
      meaning:
        'Reviewing material at growing intervals, right before you would forget it. It is the idea behind many flashcard and language-learning apps.',
    },
    {
      term: 'Adaptive video streaming (HLS)',
      meaning:
        'Splitting a video into short chunks at several qualities so the player can switch quality mid-lecture to match the student\'s internet speed.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Plan a tiny course',
      detail:
        'Write three short lessons and a five-question quiz for each, stored as JSON or Markdown files. Keeping content as data makes it easy to add more later.',
    },
    {
      step: 'Build the lesson and quiz screens',
      detail:
        'Start from this playground in plain JavaScript, or rebuild it in React with Vite, showing one question at a time with feedback and a progress bar.',
    },
    {
      step: 'Add accounts and a database',
      detail:
        'Use Supabase for a hosted PostgreSQL database with sign-in built in, or Django with its built-in users and admin panel. Create tables for courses, lessons, enrollments and progress like the SQL above.',
    },
    {
      step: 'Grade on the server and unlock lessons',
      detail:
        'Move the answer key to the server, add a POST /quizzes/:id/submit endpoint, save each attempt, and only unlock the next lesson when the score passes.',
    },
    {
      step: 'Add videos, streaks and reminders',
      detail:
        'Host lesson videos as unlisted YouTube videos or on a streaming service like Mux or Cloudflare Stream, count daily streaks, and send reminder emails with a scheduled job.',
    },
    {
      step: 'Peek inside a real LMS',
      detail:
        'Moodle and Canvas LMS are both open source. Run one locally with Docker, create a course, and compare its database tables and features with your own version.',
    },
  ],
};
