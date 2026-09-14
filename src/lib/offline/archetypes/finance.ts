import type { ArchetypeTemplate } from '../types';

export const archetype: ArchetypeTemplate = {
  id: 'finance',
  label: 'Finance & payments',

  keywords: [
    'bank',
    'banking',
    'online banking',
    'payments',
    'payment processing',
    'send money',
    'money transfer',
    'transfer money',
    'pay',
    'wallet',
    'debit card',
    'credit card',
    'checking account',
    'savings account',
    'high-yield savings',
    'interest',
    'loans',
    'mortgage',
    'credit score',
    'invest',
    'investing',
    'stocks',
    'etfs',
    'brokerage',
    'trading',
    'portfolio',
    'crypto',
    'bitcoin',
    'ethereum',
    'exchange',
    'fintech',
    'fdic',
    'invoices',
    'payroll',
    'merchant',
    'budgeting',
  ],

  tagline: '{{name}} is a financial service for storing, sending or investing money, built so that every cent is tracked and never lost.',

  eli5:
    "{{name}} is like a super-careful accountant that never sleeps. Every time money moves, it writes the change down twice, once where the money left and once where it arrived, so the books always balance. Before any payment goes through, it checks who you are, makes sure the same request can't accidentally run twice, and asks a fraud system whether anything looks suspicious.",

  languages: [
    { name: 'Java / Kotlin', usedFor: 'Core banking, payments and ledger services', share: 30 },
    { name: 'Go', usedFor: 'Fast, simple API and payment-routing services', share: 20 },
    { name: 'SQL', usedFor: 'Ledgers, balances, reconciliation and regulatory reports', share: 15 },
    { name: 'Python', usedFor: 'Fraud models, risk analysis and data pipelines', share: 15 },
    { name: 'TypeScript', usedFor: 'Web dashboards and customer-facing websites', share: 10 },
    { name: 'Swift & Kotlin (mobile)', usedFor: 'iPhone and Android banking apps', share: 10 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'Multi-factor authentication (MFA)',
          role: 'Proving it is really you',
          beginnerNote:
            'Besides a password, you confirm with something you have, like a code from your phone, a passkey or Face ID. A stolen password alone is then not enough to get in.',
        },
        {
          name: 'Hosted card & bank-login fields',
          role: 'Keeping sensitive data out of the page',
          beginnerNote:
            'Card numbers and bank logins are typed into secure fields run by specialist providers, so the main website code never touches the raw details.',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Java / Kotlin',
          role: 'Core payment and ledger services',
          beginnerNote:
            'Strongly typed languages with decades of use in banks. The compiler catches many mistakes early, which matters when a bug could move real money.',
        },
        {
          name: 'Go',
          role: 'APIs and routing services',
          beginnerNote:
            'A simple, fast language from Google. Several modern banks and payment companies use it for services that handle many requests at once.',
        },
        {
          name: 'Idempotency keys',
          role: 'No accidental double payments',
          beginnerNote:
            'The app attaches a unique ID to every payment request. If the network drops and the app retries, the server sees the same ID and returns the first result instead of paying twice.',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'PostgreSQL',
          role: 'The double-entry ledger',
          beginnerNote:
            'A relational database with strong transactions: both halves of a money movement are saved together or not at all, so money can never vanish halfway.',
        },
        {
          name: 'Apache Kafka',
          role: 'Stream of money events',
          beginnerNote:
            'Every event like "transfer created" or "card declined" is written to a durable log that fraud, notifications and reporting systems all read.',
        },
        {
          name: 'Redis',
          role: 'Idempotency keys & rate limits',
          beginnerNote:
            'Very fast in-memory storage used for quick checks, like "have we already seen this request?" or "how many transfers has this account made in the last hour?".',
        },
        {
          name: 'Append-only audit log',
          role: 'A permanent record for regulators',
          beginnerNote:
            'Records who did what and when, stored so it cannot be edited or deleted (for example Amazon S3 with Object Lock). Auditors and regulators rely on it.',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Hardware security modules (HSMs)',
          role: 'Guarding encryption keys',
          beginnerNote:
            'Special tamper-resistant devices, often rented from the cloud (like AWS CloudHSM), that hold the most important keys and do encryption without ever revealing them.',
        },
        {
          name: 'Banking rails',
          role: 'Moving money between banks',
          beginnerNote:
            'The shared networks banks use to move money: card networks like Visa and Mastercard, ACH in the US, SEPA in Europe and faster real-time schemes. Fintechs usually connect through a partner bank.',
        },
        {
          name: 'Kubernetes on a major cloud',
          role: 'Running services reliably',
          beginnerNote:
            'Services run as many copies across several data centers, so if one machine or even one building fails, payments keep working.',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'Fraud detection models',
          role: 'Stopping suspicious payments',
          beginnerNote:
            'Models trained on past fraud score each payment in milliseconds, looking at amount, device, location and behavior, and block or hold the risky ones.',
        },
        {
          name: 'KYC & identity verification',
          role: 'Knowing who customers are',
          beginnerNote:
            '"Know Your Customer" laws require checking a real identity before opening an account. Providers compare your ID photo with a selfie and check official databases.',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      {
        id: 'web',
        label: 'Web Dashboard',
        kind: 'client',
        tier: 0,
        tech: '{{frontend}} in the browser',
        description:
          'The {{name}} website where you check balances, see statements and move money. It logs you out automatically after a few idle minutes to protect your account.',
      },
      {
        id: 'mobile',
        label: 'Mobile App',
        kind: 'client',
        tier: 0,
        tech: 'Swift (iOS) · Kotlin (Android)',
        description:
          'The phone app most customers use every day. It unlocks with Face ID or a fingerprint and binds your account to a trusted device.',
      },
      {
        id: 'cdn',
        label: 'Edge & Firewall',
        kind: 'edge',
        tier: 1,
        tech: '{{hosting}} + web application firewall',
        description:
          'Serves the website files quickly and blocks attacks like floods of fake traffic or password-guessing bots before they reach the real servers.',
      },
      {
        id: 'api',
        label: 'API Gateway & Auth',
        kind: 'gateway',
        tier: 2,
        tech: 'Go gateway · OAuth 2.0 tokens',
        description:
          'Checks your login token and MFA on every request, limits how fast requests can arrive, and routes them to internal services over encrypted connections.',
      },
      {
        id: 'kyc',
        label: 'Identity Verification',
        kind: 'external',
        tier: 2,
        tech: 'KYC provider (e.g. Onfido, Persona)',
        description:
          'An outside service that checks your government ID and selfie and screens you against sanctions lists, as "Know Your Customer" laws require.',
      },
      {
        id: 'rails',
        label: 'Bank & Card Networks',
        kind: 'external',
        tier: 2,
        tech: 'Partner bank · ACH / SEPA · Visa / Mastercard',
        description:
          'The shared networks that actually move money between banks. Transfers leave through them and results (settled, returned, declined) come back, sometimes days later.',
      },
      {
        id: 'accounts',
        label: 'Accounts & Onboarding',
        kind: 'service',
        tier: 3,
        tech: 'Kotlin service',
        description:
          'Opens accounts, stores customer profiles and runs the sign-up checks. Nobody can move money until their identity is verified.',
      },
      {
        id: 'payments',
        label: 'Payments Service',
        kind: 'service',
        tier: 3,
        tech: 'Go service',
        description:
          'Handles every request to move money: checks the idempotency key, asks for a fraud score, records it in the ledger and sends it out over the right network.',
      },
      {
        id: 'ledger',
        label: 'Ledger Service',
        kind: 'service',
        tier: 3,
        tech: 'Java service (double-entry)',
        description:
          'The single source of truth for money. Every movement is saved as matching entries that add up to zero, so balances can always be proven correct.',
      },
      {
        id: 'risk',
        label: 'Fraud & Risk Engine',
        kind: 'ml',
        tier: 3,
        tech: 'Python models + rules engine',
        description:
          'Scores each payment in milliseconds using rules and machine learning, and decides: allow it, hold it for a human to review, or block it.',
      },
      {
        id: 'db',
        label: 'Ledger Database',
        kind: 'database',
        tier: 4,
        tech: 'PostgreSQL (replicated)',
        description:
          'Stores accounts and ledger entries with strict transactions. Copies in other data centers take over within moments if the main one fails.',
      },
      {
        id: 'redis',
        label: 'Fast Checks',
        kind: 'cache',
        tier: 4,
        tech: 'Redis',
        description:
          'Holds short-lived data for instant checks: recent idempotency keys, rate limits, and counters like "transfers from this account in the last hour".',
      },
      {
        id: 'events',
        label: 'Event Log',
        kind: 'queue',
        tier: 4,
        tech: 'Apache Kafka',
        description:
          'A durable, ordered record of every money event. Fraud models, push notifications, statements and reports all read from it.',
      },
      {
        id: 'audit',
        label: 'Audit Archive',
        kind: 'storage',
        tier: 4,
        tech: 'Amazon S3 with Object Lock',
        description:
          'A write-once archive of every event and admin action, kept for years. Object Lock prevents anyone, even administrators, from editing or deleting records early.',
      },
    ],
    edges: [
      { from: 'web', to: 'cdn', label: 'HTTPS (TLS)' },
      { from: 'mobile', to: 'cdn', label: 'HTTPS API calls' },
      { from: 'cdn', to: 'api', label: 'Filtered requests' },
      { from: 'api', to: 'accounts', label: 'Sign up & profile' },
      { from: 'api', to: 'payments', label: 'Move money' },
      { from: 'api', to: 'ledger', label: 'Balances & statements' },
      { from: 'rails', to: 'api', label: 'Webhooks: settled / returned' },
      { from: 'accounts', to: 'kyc', label: 'ID & selfie check' },
      { from: 'accounts', to: 'db', label: 'Customer records' },
      { from: 'accounts', to: 'events', label: 'AccountOpened' },
      { from: 'payments', to: 'redis', label: 'Idempotency check' },
      { from: 'payments', to: 'risk', label: 'Fraud score?' },
      { from: 'payments', to: 'ledger', label: 'Post journal entry' },
      { from: 'payments', to: 'rails', label: 'Send ACH / card transfer' },
      { from: 'ledger', to: 'db', label: 'Balanced entries (transaction)' },
      { from: 'ledger', to: 'events', label: 'Balance changed' },
      { from: 'risk', to: 'redis', label: 'Velocity counters' },
      { from: 'events', to: 'risk', label: 'Behavior history' },
      { from: 'events', to: 'audit', label: 'Archive every event' },
    ],
    flows: [
      {
        id: 'open-account',
        title: 'You open an account',
        emoji: '🪪',
        steps: [
          {
            from: 'mobile',
            to: 'cdn',
            narration: 'You enter your name, address and date of birth, then photograph your ID and take a selfie in the app.',
          },
          {
            from: 'cdn',
            to: 'api',
            narration: 'The firewall checks the traffic looks human, and the encrypted request reaches the API gateway.',
          },
          {
            from: 'api',
            to: 'accounts',
            narration: 'The gateway hands your application to the Accounts service, which creates an account in "pending verification" status.',
          },
          {
            from: 'accounts',
            to: 'kyc',
            narration:
              'The identity provider checks that your ID is genuine, that your face matches the photo, and that you are not on a sanctions list.',
          },
          {
            from: 'accounts',
            to: 'db',
            narration: 'Verification passed, so your account is marked active and gets its own ledger account with a balance of zero.',
          },
          {
            from: 'accounts',
            to: 'events',
            narration: 'An "AccountOpened" event is published, which triggers a welcome notification.',
          },
          {
            from: 'events',
            to: 'audit',
            narration:
              'The event, including which checks were run and their results, is archived permanently, because regulators can ask to see it years later.',
          },
        ],
      },
      {
        id: 'send-money',
        title: 'You send $50 to a friend',
        emoji: '💸',
        steps: [
          {
            from: 'mobile',
            to: 'cdn',
            narration:
              'You tap Send. The app creates a unique idempotency key for this payment and sends it with the amount and your friend\'s account.',
          },
          {
            from: 'cdn',
            to: 'api',
            narration: 'The gateway checks your login token and that this device is trusted, then forwards the request.',
          },
          {
            from: 'api',
            to: 'payments',
            narration: 'The Payments service receives the transfer request.',
          },
          {
            from: 'payments',
            to: 'redis',
            narration:
              'It checks whether this idempotency key was seen before. If your phone lost signal and retried, you get the first result instead of sending $100.',
          },
          {
            from: 'payments',
            to: 'risk',
            narration:
              'The fraud engine scores the payment: a known device, a friend you have paid before and a normal amount means low risk, so it is allowed.',
          },
          {
            from: 'payments',
            to: 'ledger',
            narration: 'Payments asks the Ledger to record the transfer as one journal entry.',
          },
          {
            from: 'ledger',
            to: 'db',
            narration:
              'In a single transaction the ledger writes -$50 on your account and +$50 on your friend\'s. They add up to zero, so no money was created or lost.',
          },
        ],
      },
      {
        id: 'withdraw-to-bank',
        title: 'You withdraw to your bank',
        emoji: '🏦',
        steps: [
          {
            from: 'payments',
            to: 'ledger',
            narration:
              'You ask to move $200 to your bank. The ledger moves it from your balance into a "money on its way out" clearing account, so you cannot spend it twice.',
          },
          {
            from: 'payments',
            to: 'rails',
            narration: 'Payments sends the transfer to the partner bank, which submits it to the ACH network in its next batch.',
          },
          {
            from: 'rails',
            to: 'api',
            narration:
              'One to two business days later, the bank sends a webhook saying the transfer settled. The gateway verifies the message\'s signature first.',
          },
          {
            from: 'api',
            to: 'payments',
            narration: 'The confirmed result is passed to the Payments service, which matches it to your original withdrawal.',
          },
          {
            from: 'payments',
            to: 'ledger',
            narration:
              'The ledger posts a second entry taking the $200 out of the clearing account. If the transfer had bounced, the money would go back to your balance instead.',
          },
          {
            from: 'ledger',
            to: 'events',
            narration: 'A "WithdrawalSettled" event is published, and you get a notification that the money arrived.',
          },
          {
            from: 'events',
            to: 'audit',
            narration: 'Both ledger entries and the bank\'s confirmation are archived, so the whole journey can be traced later.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'services/payments/cmd/server/main.go', note: 'Starts the payments HTTP server' },
    { path: 'services/payments/internal/transfers/handler.go', note: 'The "send money" endpoint' },
    { path: 'services/payments/internal/idempotency/store.go', note: 'Saves each response by key and replays it on retries' },
    { path: 'services/payments/internal/rails/ach_client.go', note: 'Sends transfers to the partner bank for the ACH network' },
    { path: 'services/payments/internal/webhooks/bank_webhooks.go', note: 'Checks signatures on "settled" and "returned" messages from the bank' },
    { path: 'services/ledger/src/main/java/com/example/ledger/JournalService.java', note: 'Posts balanced entries inside one database transaction' },
    { path: 'services/ledger/src/main/java/com/example/ledger/Reconciliation.java', note: "Nightly job comparing the ledger with the bank's own statements" },
    { path: 'services/ledger/src/main/resources/db/migration/V1__double_entry_ledger.sql', note: 'Ledger accounts, journal entries and postings tables' },
    { path: 'services/accounts/src/main/kotlin/com/example/accounts/OnboardingService.kt', note: 'Runs identity checks before activating an account' },
    { path: 'risk/rules/transfer_rules.py', note: 'Hand-written fraud rules like "new account + large amount"' },
    { path: 'risk/models/train_fraud_model.py', note: 'Trains the fraud model on past payments labeled fraud or not' },
    { path: 'audit/archiver/archive_events.go', note: 'Copies every Kafka event into the locked S3 archive' },
    { path: 'infra/terraform/audit_bucket_object_lock.tf', note: 'Creates the write-once audit bucket' },
    { path: 'infra/k8s/payments-deployment.yaml', note: 'Runs payments across several data centers so one failure is survivable' },
    { path: 'docs/runbooks/stuck-transfers.md', note: 'Step-by-step guide for engineers when transfers get stuck' },
  ],

  code: [
    {
      id: 'transfer-endpoint',
      title: 'A safe "send money" endpoint',
      file: 'services/payments/internal/transfers/handler.go',
      language: 'Go',
      explanation:
        'Phones lose signal all the time, so apps retry requests. To make retries safe, the app sends an Idempotency-Key header, a random ID it creates once per payment. If the server has already handled that key, it simply replays the saved answer instead of moving money again. Amounts are whole cents in an int64, never floats. The fraud check runs before anything is written, and the ledger saves both sides of the transfer in one database transaction.',
      code: `import (
	"encoding/json"
	"errors"
	"net/http"
)

type TransferRequest struct {
	FromAccount string \`json:"from_account"\`
	ToAccount   string \`json:"to_account"\`
	AmountCents int64  \`json:"amount_cents"\` // whole cents: never use floats for money
}
// POST /v1/transfers with the header "Idempotency-Key: <unique id made by the app>"
func (s *Server) CreateTransfer(w http.ResponseWriter, r *http.Request) {
	key := r.Header.Get("Idempotency-Key")
	var req TransferRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || key == "" || req.AmountCents <= 0 {
		http.Error(w, "invalid transfer request", http.StatusBadRequest)
		return
	}
	// Seen this key already? The app retried after a network blip, so replay the first answer.
	if saved, found := s.idempotency.Get(r.Context(), key); found {
		writeJSON(w, http.StatusOK, saved)
		return
	}
	if s.risk.Decide(r.Context(), req) == "block" {
		http.Error(w, "transfer blocked: please confirm it was you", http.StatusForbidden)
		return
	}
	// One DB transaction; a UNIQUE key column stops two simultaneous retries both posting.
	transfer, err := s.ledger.PostTransfer(r.Context(), key, req.FromAccount, req.ToAccount, req.AmountCents)
	switch {
	case errors.Is(err, ErrInsufficientFunds):
		http.Error(w, "insufficient funds", http.StatusUnprocessableEntity)
	case err != nil:
		http.Error(w, "temporary problem: safe to retry with the same key", http.StatusServiceUnavailable)
	default:
		s.idempotency.Save(r.Context(), key, transfer)
		writeJSON(w, http.StatusCreated, transfer)
	}
}`,
    },
    {
      id: 'double-entry-ledger',
      title: 'A double-entry ledger',
      file: 'services/ledger/src/main/resources/db/migration/V1__double_entry_ledger.sql',
      language: 'SQL (PostgreSQL)',
      explanation:
        'Instead of storing one "balance" number that gets overwritten, a ledger stores every movement. Each journal entry has two or more postings, and they must add up to zero: money leaving one account (negative) always arrives in another (positive). A balance is just the sum of an account\'s postings, so it can be recalculated and checked at any time. Old rows are never edited; mistakes are fixed with a new reversing entry, which keeps a complete history for auditors.',
      code: `-- Money is never created or destroyed here, only moved between accounts.
CREATE TABLE ledger_accounts (
  id       BIGSERIAL PRIMARY KEY,
  owner_id BIGINT,               -- NULL for the company's own accounts (fees, bank clearing)
  name     TEXT NOT NULL,        -- e.g. 'alice_wallet', 'ach_clearing', 'fee_revenue'
  currency CHAR(3) NOT NULL      -- ISO code like 'USD'
);

CREATE TABLE journal_entries (
  id              BIGSERIAL PRIMARY KEY,
  idempotency_key TEXT UNIQUE NOT NULL,  -- the same request can never be recorded twice
  description     TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Each entry has 2+ postings: negative = money leaves the account, positive = it arrives.
CREATE TABLE postings (
  entry_id     BIGINT NOT NULL REFERENCES journal_entries(id),
  account_id   BIGINT NOT NULL REFERENCES ledger_accounts(id),
  amount_cents BIGINT NOT NULL CHECK (amount_cents <> 0),
  PRIMARY KEY (entry_id, account_id)
);

-- History is append-only: the app may add rows but never change or delete them.
REVOKE UPDATE, DELETE ON journal_entries, postings FROM payments_app;

-- Alice (account 1) sends Bob (account 2) $50: one entry, two postings, total zero.
BEGIN;
WITH entry AS (
  INSERT INTO journal_entries (idempotency_key, description)
  VALUES ('9f1c2e7a-transfer', 'Alice pays Bob') RETURNING id
)
INSERT INTO postings (entry_id, account_id, amount_cents)
SELECT id, 1, -5000 FROM entry UNION ALL SELECT id, 2, 5000 FROM entry;
COMMIT;

SELECT SUM(amount_cents) AS balance_cents FROM postings WHERE account_id = 1; -- a balance is just a sum
-- Every entry must balance, so this safety check should return no rows:
SELECT entry_id FROM postings GROUP BY entry_id HAVING SUM(amount_cents) <> 0;`,
    },
    {
      id: 'fraud-rules',
      title: 'Scoring a payment for fraud',
      file: 'risk/rules/transfer_rules.py',
      language: 'Python',
      explanation:
        'Fraud checks often start as simple rules that add up warning signs: a brand-new account, a large amount, a recipient you have never paid, an unknown device, or many transfers in a short time (called velocity, usually counted in Redis). The total score decides whether to allow, hold for a human reviewer, or block. Real systems combine rules like these with machine learning models trained on millions of past payments, and must answer in a few milliseconds.',
      code: `from dataclasses import dataclass

@dataclass
class Transfer:
    amount_cents: int
    account_age_days: int
    recipient_is_new: bool      # never paid this person before
    device_is_known: bool       # a phone this customer has used before
    transfers_last_hour: int    # "velocity", counted in Redis

def risk_score(t: Transfer) -> int:
    """Add up warning signs. Each rule is simple; together they catch a lot."""
    score = 0
    if t.amount_cents > 100_000:       # more than $1,000
        score += 30
    if t.account_age_days < 7:
        score += 25
    if t.recipient_is_new:
        score += 20
    if not t.device_is_known:
        score += 20
    if t.transfers_last_hour >= 5:
        score += 30
    return score

def decide(t: Transfer) -> str:
    score = risk_score(t)
    if score >= 70:
        return "block"    # stop it and ask the customer to confirm
    if score >= 40:
        return "review"   # hold the money while a human analyst checks
    return "allow"

# Paying a regular friend $25 from your usual phone:
print(decide(Transfer(2_500, 400, False, True, 1)))      # -> allow  (score 0)
# A 2-day-old account sending $1,500 to someone new from an unknown phone:
print(decide(Transfer(150_000, 2, True, False, 1)))      # -> block  (30 + 25 + 20 + 20 = 95)`,
    },
  ],

  playground: {
    title: 'Wallet & send money',
    description:
      'A mini {{name}} wallet: pick a friend, send money, then simulate a network retry to see idempotency stop a double payment. Switch to the Ledger tab to see every payment written twice, adding up to zero.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Wallet</title>
<style>
:root {
  --brand: {{brand}}; /* @tweak color "Brand color" */
  --accent: {{accent}}; /* @tweak color "Card gradient end" */
  --bg: #f3f5f8; /* @tweak color "Background" */
  --radius: 16px; /* @tweak range 0 28 "Corner radius" */
  --balance-size: 36px; /* @tweak range 24 52 "Balance text size" */
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: #1d2433; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
header { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px 6px; }
.logo { font-size: 20px; color: var(--brand); }
.card { margin: 8px 16px; padding: 18px 20px; border-radius: var(--radius); color: #fff; background: linear-gradient(135deg, var(--brand), var(--accent)); }
.card small { opacity: .85; font-size: 13px; }
.balance { font-size: var(--balance-size); font-weight: 800; margin: 6px 0 4px; }
.eye { float: right; border: 0; border-radius: 999px; padding: 4px 10px; background: rgba(255,255,255,.22); color: #fff; cursor: pointer; }
.panel { margin: 12px 16px; padding: 14px; border-radius: var(--radius); background: #fff; }
h2 { font-size: 15px; margin: 0 0 10px; }
.friends { display: flex; gap: 10px; }
.friend { flex: 1; padding: 8px 4px; border: 2px solid #e6e8ec; border-radius: var(--radius); background: #fff; cursor: pointer; }
.friend span { display: block; font-size: 24px; }
.friend.on { border-color: var(--brand); }
.amount { display: flex; align-items: center; gap: 4px; margin: 12px 0 8px; font-size: 28px; font-weight: 700; }
.amount input { width: 100%; border: 0; border-bottom: 2px solid #e6e8ec; font-size: 28px; font-weight: 700; outline: none; }
.amount input:focus { border-color: var(--brand); }
.quick button { padding: 5px 12px; border: 1px solid #e6e8ec; border-radius: 999px; background: #f7f8fa; cursor: pointer; }
.send { width: 100%; margin-top: 12px; padding: 13px; border: 0; border-radius: var(--radius); background: var(--brand); color: #fff; font-size: 16px; font-weight: 700; cursor: pointer; }
.retry { width: 100%; margin-top: 8px; padding: 9px; border: 1px dashed #99a; border-radius: var(--radius); background: none; color: #556; cursor: pointer; }
.status { min-height: 18px; font-size: 13px; margin: 10px 0 0; }
.tabs { display: flex; gap: 6px; margin-bottom: 6px; }
.tabs button { flex: 1; padding: 7px; border: 0; border-radius: var(--radius); background: #eef0f3; font-weight: 600; cursor: pointer; }
.tabs button.on { background: var(--brand); color: #fff; }
ul { list-style: none; margin: 0; padding: 0; }
li { display: flex; justify-content: space-between; padding: 9px 0; border-top: 1px solid #f0f1f4; font-size: 14px; }
li.ledger { display: block; font-family: ui-monospace, Menlo, monospace; font-size: 11px; line-height: 1.5; }
.in { color: #12805c; }
.note { margin: 0 16px 20px; font-size: 11px; color: #778; text-align: center; }
</style>
</head>
<body>
<header><b class="logo" data-edit="logo">{{name}}</b><span>🙂</span></header>
<section class="card">
  <button class="eye" id="eye">Hide</button>
  <small data-edit="balanceLabel">Available balance</small>
  <div class="balance" id="balance"></div>
  <small>Account •••• 4821</small>
</section>
<section class="panel">
  <h2 data-edit="sendTitle">Send money</h2>
  <div class="friends" id="friends"></div>
  <div class="amount">$<input id="amount" type="number" min="0.01" step="0.01" value="25.00" aria-label="Amount"></div>
  <div class="quick" id="quick"><button data-amt="10">$10</button> <button data-amt="25">$25</button> <button data-amt="50">$50</button></div>
  <button class="send" id="send" data-edit="cta">Send now</button>
  <button class="retry" id="retry">📶 Simulate a network retry</button>
  <p class="status" id="status"></p>
</section>
<section class="panel">
  <div class="tabs" id="tabs"><button data-tab="activity">Activity</button><button data-tab="ledger">Ledger</button></div>
  <ul id="list"></ul>
</section>
<p class="note" data-edit="note">Every payment is written twice, and each entry adds up to zero</p>

<script>
// Double-entry ledger: each entry has postings (account, cents) that must sum to zero
const entries = [
  { key: 'seed-2', text: 'Coffee Corner', postings: [['You', -475], ['Coffee Corner', 475]] },
  { key: 'seed-1', text: 'Paycheck', postings: [['Employer', -125000], ['You', 125000]] }
];
const friends = [
  { name: 'Maya', emoji: '🦊' },
  { name: 'Leo', emoji: '🐼' },
  { name: 'Sam', emoji: '🐙' }
];
const processedKeys = new Set(entries.map((e) => e.key)); // what the "server" has already handled
let to = 'Maya';
let tab = 'activity';
let hidden = false;
let lastKey = null;
const $ = (id) => document.getElementById(id);
const money = (cents) => (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

// Your balance is never stored: it is the sum of all your postings
function balance() {
  let total = 0;
  entries.forEach((e) => e.postings.forEach((p) => { if (p[0] === 'You') total += p[1]; }));
  return total;
}

function status(text) { $('status').textContent = text; }

// Pretend server endpoint. The key makes retries safe (idempotency)
function sendPayment(key) {
  if (processedKeys.has(key)) return status('↩️ Same idempotency key seen before: duplicate ignored, no double payment');
  const cents = Math.round(parseFloat($('amount').value) * 100); // money in whole cents
  if (!(cents > 0)) return status('Enter an amount greater than $0');
  if (cents > balance()) return status('❌ Insufficient funds');
  processedKeys.add(key);
  entries.unshift({ key: key, text: 'To ' + to, postings: [['You', -cents], [to, cents]] });
  status('✅ Sent ' + money(cents) + ' to ' + to);
  render();
}

function render() {
  $('balance').textContent = hidden ? '••••••' : money(balance());
  $('eye').textContent = hidden ? 'Show' : 'Hide';

  $('friends').innerHTML = '';
  friends.forEach((f) => {
    const b = document.createElement('button');
    b.className = 'friend' + (f.name === to ? ' on' : '');
    b.innerHTML = '<span></span>';
    b.firstChild.textContent = f.emoji;
    b.appendChild(document.createTextNode(f.name));
    b.onclick = () => { to = f.name; render(); };
    $('friends').appendChild(b);
  });

  document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
  $('list').innerHTML = '';
  entries.forEach((e) => {
    const li = document.createElement('li');
    if (tab === 'activity') {
      const mine = e.postings.find((p) => p[0] === 'You')[1];
      li.innerHTML = '<span></span><b></b>';
      li.firstChild.textContent = e.text;
      li.lastChild.textContent = (mine > 0 ? '+' : '−') + money(Math.abs(mine));
      li.lastChild.className = mine > 0 ? 'in' : '';
    } else {
      const sum = e.postings.reduce((s, p) => s + p[1], 0);
      li.className = 'ledger';
      li.textContent = e.postings.map((p) => p[0] + ' ' + (p[1] > 0 ? '+' : '') + money(p[1])).join('   ') + '   → sum ' + money(sum) + (sum === 0 ? ' ✓' : ' ✗');
    }
    $('list').appendChild(li);
  });
}

$('send').onclick = () => {
  lastKey = 'req-' + Date.now() + '-' + Math.random().toString(16).slice(2, 8); // a brand-new key per payment
  sendPayment(lastKey);
};
$('retry').onclick = () => (lastKey ? sendPayment(lastKey) : status('Send a payment first, then retry that same request'));
$('quick').onclick = (e) => { if (e.target.dataset.amt) $('amount').value = Number(e.target.dataset.amt).toFixed(2); };
$('tabs').onclick = (e) => { if (e.target.dataset.tab) { tab = e.target.dataset.tab; render(); } };
$('eye').onclick = () => { hidden = !hidden; render(); };

render();
</script>
</body>
</html>`,
    challenges: [
      'Change the "Brand color" and "Card gradient end" tweaks to restyle the balance card, buttons and tabs.',
      'Send a payment, tap "Simulate a network retry", and check the Ledger tab: there is still only one entry. Then make the retry button create a new key each time and watch the double payment happen.',
      'Add a fee: every payment also moves 1% from You to a "Fees" account, as a third posting in the same entry so it still sums to zero.',
      'Add a daily limit: refuse payments once the total sent today would go over $500, with a friendly message.',
    ],
  },

  concepts: [
    {
      term: 'Double-entry bookkeeping',
      meaning:
        'A centuries-old accounting method: every movement of money is recorded in at least two accounts, one losing and one gaining, and the amounts always add up to zero, so errors are easy to spot.',
    },
    {
      term: 'Ledger',
      meaning:
        'The permanent list of every money movement. Balances are calculated from it rather than stored alone, and mistakes are fixed by adding a new correcting entry instead of editing history.',
    },
    {
      term: 'Idempotency',
      meaning:
        'An operation is idempotent if doing it twice has the same effect as doing it once. Payment APIs use idempotency keys so a retried request never moves money twice.',
    },
    {
      term: 'ACID transactions',
      meaning:
        'Database guarantees that a group of changes happens completely or not at all (atomic), even during crashes, so money can never leave one account without arriving in the other.',
    },
    {
      term: 'Money as integers',
      meaning:
        'Amounts are stored in the smallest unit, like cents, as whole numbers. Floating-point numbers cannot store values like 0.10 exactly, and tiny errors are unacceptable with money.',
    },
    {
      term: 'KYC & AML',
      meaning:
        '"Know Your Customer" and "Anti-Money Laundering" laws require financial companies to verify who their customers are and to watch for and report suspicious activity.',
    },
    {
      term: 'Clearing & settlement',
      meaning:
        'A payment can look instant in the app while the real money moves between banks later, sometimes days later. Settlement is the moment it has truly and finally arrived.',
    },
    {
      term: 'Audit trail',
      meaning:
        'A tamper-proof record of who did what and when. It lets companies prove to auditors and regulators exactly what happened to every cent.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Start with a ledger',
      detail:
        'Create accounts, journal_entries and postings tables in PostgreSQL (or SQLite), store amounts in cents, and write a query that proves every entry sums to zero.',
    },
    {
      step: 'Build a transfer API',
      detail:
        'Write a POST /transfers endpoint in Express or FastAPI that requires an Idempotency-Key header and writes both postings inside one database transaction.',
    },
    {
      step: 'Add secure login',
      detail:
        'Use a proven auth service such as Supabase Auth, Auth0 or Clerk and turn on multi-factor authentication. Never invent your own password storage.',
    },
    {
      step: 'Connect pretend money',
      detail:
        'Use Stripe test mode for card payments or the Plaid Sandbox for linking bank accounts. Keep student projects on test money; handling real funds requires licenses or a partner bank.',
    },
    {
      step: 'Add fraud rules and an audit log',
      detail:
        'Write a few simple rules (daily limit, many transfers per hour, new recipient) and record every action in an append-only audit table your app can insert into but never update.',
    },
    {
      step: 'Build the dashboard and deploy',
      detail:
        'Show balances, a transaction list and a monthly chart, let users download a CSV statement, then deploy the frontend to Vercel and the API to Render or Fly.io.',
    },
  ],
};
