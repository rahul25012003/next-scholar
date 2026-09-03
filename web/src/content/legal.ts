/**
 * The legal pages.
 *
 * Until now the site published a data protection section inside the anti fraud
 * page and no standalone policies at all, while setting an authentication
 * cookie. That is the gap these documents close.
 *
 * The honesty constraint that applies everywhere else on this platform applies
 * here too, and it bites harder: a policy is a promise, and a promise made by
 * an entity that does not exist yet cannot be enforced against anyone. So every
 * document carries its review state at the top, in the reader's view, rather
 * than in a footnote. `reviewState` is "draft-published" on all of them, which
 * is true: they are written, they are complete enough to be relied on for what
 * they describe, and no lawyer has yet read them.
 *
 * The alternative was to publish nothing, which is what we were doing, or to
 * publish them without the caveat, which would be the first dishonest page on
 * the site.
 */

export type LegalBlock =
  | { kind: "text"; body: string }
  | { kind: "list"; intro?: string; items: string[] }
  | { kind: "definitions"; items: { term: string; body: string }[] }
  | {
      kind: "table";
      caption: string;
      columns: string[];
      rows: string[][];
    }
  | { kind: "callout"; tone: "note" | "warning"; title: string; body: string };

export type LegalSection = {
  id: string;
  heading: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  slug: string;
  title: string;
  lede: string;
  /**
   * Whether a qualified person has reviewed the text. Never set to reviewed
   * without a name and a date, because an unreviewed policy claiming review is
   * worse than an unreviewed policy admitting it.
   */
  reviewState: "draft-published" | "reviewed";
  reviewedBy: string | null;
  reviewedOn: string | null;
  lastUpdated: string;
  /** What is still missing from this document, listed as gaps. */
  openItems: string[];
  sections: LegalSection[];
};

const NOT_INCORPORATED =
  "Next Scholar is not yet incorporated. Until it is, there is no registered entity for this document to bind and no CIN, GSTIN or registered address to print. Those fields stay empty on this site rather than carrying placeholder values, and this document takes effect against the entity on the day it is registered.";

/* ------------------------------------------------------------------ *
 * Privacy policy
 * ------------------------------------------------------------------ */

export const privacyPolicy: LegalDocument = {
  slug: "privacy",
  title: "Privacy policy",
  lede:
    "What we collect, why we collect it, who it reaches, how long we keep it, and what you can make us do about it. Written against India's Digital Personal Data Protection Act, 2023, because that is the law that governs a Bengaluru consultancy handling your passport.",
  reviewState: "draft-published",
  reviewedBy: null,
  reviewedOn: null,
  lastUpdated: "2026-09-03",
  openItems: [
    "A lawyer has not reviewed this text. It is published in that state rather than presented as settled.",
    "The grievance officer is a defined role with no named holder yet, because there is no entity to appoint one. The interim route is set out in the Complaints section.",
    "The storage provider and its region are not yet contracted, so the cross-border transfer position in the Transfers section is stated as intent rather than as implemented fact.",
    "Retention periods are computed by the platform today and enforced by deletion only once the database is in place. That gap is stated in the Retention section rather than hidden.",
  ],
  sections: [
    {
      id: "who",
      heading: "Who this policy is from",
      blocks: [
        { kind: "callout", tone: "warning", title: "No registered entity yet", body: NOT_INCORPORATED },
        {
          kind: "text",
          body: "Next Scholar is a study abroad consultancy based in Bengaluru, Karnataka, serving clients across India. Under the Digital Personal Data Protection Act, 2023 we are a data fiduciary: we decide what personal data is collected and why. You are the data principal, and the rights set out below are yours rather than a courtesy we extend.",
        },
      ],
    },
    {
      id: "collect",
      heading: "What we collect",
      blocks: [
        {
          kind: "text",
          body: "Only what a specific step in your application requires, and only when that step is live. We do not collect documents speculatively so that they are on file in case they become useful.",
        },
        {
          kind: "table",
          caption: "Every category of personal data we hold, why, and the lawful basis for it",
          columns: ["What", "Why we need it", "Lawful basis"],
          rows: [
            [
              "Name, email address, phone number",
              "To identify your account, reach you about your own application, and answer you when you ask us something",
              "Your consent, given at signup, and the performance of the service you engage us for",
            ],
            [
              "Academic transcripts, degree certificates, mark sheets",
              "To check eligibility against a programme's stated requirements, and to submit applications on your behalf",
              "Your consent, recorded per document category before the document is collected",
            ],
            [
              "Passport copy",
              "Identity on university applications and on the visa file",
              "Your consent, recorded per document category",
            ],
            [
              "English and language test results",
              "To meet the language condition on each application",
              "Your consent, recorded per document category",
            ],
            [
              "Bank statements, loan sanction letters, funding evidence",
              "To evidence funds to a visa authority and, where required, to a university",
              "Your consent, recorded per document category",
            ],
            [
              "Letters of recommendation",
              "To submit with applications that ask for references",
              "Your consent, recorded per document category",
            ],
            [
              "Photographs for application forms",
              "Because some application forms require one",
              "Your consent, recorded per document category",
            ],
            [
              "Notes written by your counsellor about your case",
              "To run your application competently, and so that a colleague covering for them can pick it up",
              "The performance of the service you engage us for",
            ],
            [
              "Communication history: email, WhatsApp and call notes",
              "So that what was said to you and by whom is a record rather than a memory",
              "The performance of the service, and your separate opt in for each messaging channel",
            ],
            [
              "Session cookie",
              "To keep you signed in, and for nothing else",
              "Strictly necessary for a service you asked for. See the cookie policy.",
            ],
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Consent is per document category, and it is withdrawable",
          body: "Before any sensitive document is collected we take explicit consent for that category, we record who the document may be shared with by name, and we timestamp it. You can withdraw any of those consents from your portal at any time. Withdrawal does not delete the record that consent once existed, because that record is part of the audit answer if you ever ask us what we did with a document.",
        },
      ],
    },
    {
      id: "not-collect",
      heading: "What we do not collect, and will not",
      blocks: [
        {
          kind: "list",
          items: [
            "We do not buy contact lists, and we did not get your number from one.",
            "We do not run advertising or analytics trackers on this site. There is no third-party pixel here, which is why there is no consent banner asking you to accept one.",
            "We do not collect caste, religion, political affiliation or health data, and no field on this platform stores them.",
            "We do not collect a document to keep it. If a step does not require it, we do not ask for it.",
            "We do not use your documents or your case notes to train any AI model, ours or anyone else's.",
          ],
        },
      ],
    },
    {
      id: "ai",
      heading: "Where automated systems touch your data",
      blocks: [
        {
          kind: "text",
          body: "This platform uses AI models for a defined and short list of tasks: summarising a case for your counsellor, drafting an internal message for a human to edit and send, extracting fields from a document you uploaded for a human to confirm, checking your file for missing items, and answering your questions from your own record and our published policies. Every one of those runs on your data.",
        },
        {
          kind: "list",
          intro: "The limits on that are enforced in code rather than in policy, which means the software refuses rather than the staff remembering:",
          items: [
            "No automated system can mark a document verified. Only a named member of staff can, and the action is logged with their name and the timestamp.",
            "No automated system can draft a bank statement, a source of funds letter, a work experience letter or a statement of purpose.",
            "No automated system can submit an application, contact you directly, or close your case.",
            "No automated system calculates or displays a probability of admission or of a visa decision, for you or for anyone internally.",
            "Every field on your record carries whether a human or a machine set it, so a wrong value always has a traceable author.",
            "Where a model provider processes your data, it is under a contract that forbids training on it. That contract is a condition of the provider being in this stack at all.",
          ],
        },
      ],
    },
    {
      id: "sharing",
      heading: "Who your data reaches",
      blocks: [
        {
          kind: "list",
          intro: "Only the following, and each one only for the step it is named for:",
          items: [
            "Universities and their application platforms, for the applications you ask us to submit. Which universities, by name, is recorded in the consent for that document category.",
            "uni-assist, APS India, and equivalent bodies, where the route requires their involvement.",
            "Visa authorities and their appointed commercial partners, where a visa application requires it.",
            "Our own infrastructure providers: hosting, database, document storage and email delivery. Each is a processor acting on our instructions, not a recipient free to use your data.",
            "AI model providers, for the defined tasks above, under contracts forbidding training on your data.",
            "A regulator, court or authority, where we are legally obliged. If that happens and we are permitted to tell you, we will.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "We do not sell your data, and we do not take referral money without publishing it",
          body: "There is no arrangement under which your contact details are passed to a lender, an accommodation provider, a forex service or an insurer in exchange for a fee, unless that arrangement and its remuneration are published on this site and you have separately agreed to the introduction. Publishing what we earn is the whole basis of this business, and an undisclosed referral funnel is the exact thing it exists to correct.",
        },
      ],
    },
    {
      id: "transfers",
      heading: "Transfers outside India",
      blocks: [
        {
          kind: "text",
          body: "Applying abroad necessarily sends your documents abroad: a UK university cannot assess a transcript it has not received. Beyond that, some of our infrastructure providers process data outside India.",
        },
        {
          kind: "text",
          body: "Our intent, stated here as intent because the contracts are not signed yet, is that primary document storage sits in an Indian region, that every non-Indian processor is checked against the transfer restrictions the DPDP Act permits the government to impose, and that the list of processors and their regions is published on this page once contracted. Until that list is here, treat this section as a commitment rather than as a description of a running system.",
        },
      ],
    },
    {
      id: "retention",
      heading: "How long we keep it",
      blocks: [
        {
          kind: "table",
          caption: "Retention periods by category",
          columns: ["What", "How long", "Why that long"],
          rows: [
            [
              "Case file, including notes and communication history",
              "Five years from the date your case is closed",
              "Our anti fraud commitment maintains a written file for five years, so that a question about what we did on an application can still be answered years later",
            ],
            [
              "Sensitive documents: passport, transcripts, bank statements",
              "Deleted when the applications they were collected for have concluded, or on withdrawal of consent, whichever is first",
              "There is no reason to hold a passport copy after the visa is decided",
            ],
            [
              "Audit trail of who read and changed your record",
              "Five years from the date your case is closed",
              "An audit trail that is deleted before the file it describes cannot answer a dispute",
            ],
            [
              "Account and login records",
              "Until you close your account, then 90 days",
              "The 90 days is to reverse an accidental closure",
            ],
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "The clock is computed. The deletion is not yet enforced.",
          body: "Today the platform calculates the retention state of every record and shows it on the operations dashboard. It does not yet delete anything automatically, because the durable database that would hold the deletion job is not in place. That is a real gap between this policy and the running system, and it is stated here rather than glossed. Until it closes, deletion on request is performed by hand and is not slower for it.",
        },
      ],
    },
    {
      id: "rights",
      heading: "Your rights, and how to use them",
      blocks: [
        {
          kind: "definitions",
          items: [
            {
              term: "Access",
              body: "Ask for a copy of the personal data we hold about you, a list of who it has been shared with, and the notes on your case. Your portal already shows most of this live. For the rest, ask and we will send it within 30 days.",
            },
            {
              term: "Correction and completion",
              body: "Ask us to correct anything wrong or incomplete. Your counsellor can correct a value on your record directly, and every correction is logged with its reason, so a fix is visible rather than silent.",
            },
            {
              term: "Erasure",
              body: "Ask us to delete your data. We will, except where we are required to keep something: an application already submitted to a university cannot be recalled by us, and the five year anti fraud file has a stated purpose. We will tell you exactly what we kept and why rather than refusing in general terms.",
            },
            {
              term: "Withdraw consent",
              body: "Withdraw consent for any document category, or for any messaging channel, from your portal. Messaging stops immediately. Documents already submitted with an application cannot be unsubmitted, and we will say so plainly rather than implying otherwise.",
            },
            {
              term: "Grievance redressal",
              body: "Complain about how we have handled your data, and get a substantive answer. The route is in the next section.",
            },
            {
              term: "Nominate someone",
              body: "Nominate a person to exercise these rights on your behalf if you die or become incapable of exercising them yourself. Ask us and we will record the nomination on your file.",
            },
          ],
        },
      ],
    },
    {
      id: "complaints",
      heading: "Complaints, and the grievance officer",
      blocks: [
        {
          kind: "callout",
          tone: "warning",
          title: "The role is defined. The holder is not appointed yet.",
          body: "The DPDP Act requires a data fiduciary to publish a grievance officer's contact details. We cannot appoint one before the entity exists, and we are not going to print a name that is not real. What follows is the route that works today and the commitment that binds on the day of incorporation.",
        },
        {
          kind: "list",
          intro: "Today:",
          items: [
            "Raise it with your counsellor first. Most complaints are a misunderstanding about a document and are resolved the same day.",
            "If that does not resolve it, use the consultation booking form and mark it as a data complaint. It reaches the founder directly, and it is the only channel that currently does.",
            "You will get a substantive answer, not an acknowledgement, within seven working days.",
          ],
        },
        {
          kind: "list",
          intro: "On the day the entity is registered:",
          items: [
            "A named grievance officer, with a direct email address and a phone number, published on this page and in the footer.",
            "A stated response commitment of seven working days, and a stated escalation path if that is missed.",
            "Your right to escalate to the Data Protection Board of India, stated with the route to do it, whether or not you have come to us first.",
          ],
        },
      ],
    },
    {
      id: "breach",
      heading: "If something goes wrong",
      blocks: [
        {
          kind: "text",
          body: "A personal data breach means telling you and telling the Data Protection Board of India. Our commitment is to notify the Board and every affected person without undue delay once a breach is established, to say what happened rather than that an incident occurred, to say what data was involved, and to say what we are doing about it.",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "The written breach protocol is an open gap",
          body: "Who is notified in what order, within what timeframe, through which escalation path, and who has authority to declare a breach: none of that is written down yet. It is listed among the open items at the top of this page because that is what it is. The commitment above is real; the runbook behind it is not written.",
        },
      ],
    },
    {
      id: "children",
      heading: "Applicants under 18",
      blocks: [
        {
          kind: "text",
          body: "We do not currently take on applicants under 18. The DPDP Act requires verifiable parental consent for a child's data and forbids tracking or targeted advertising directed at children, and we would rather decline the work than implement that badly. If you are under 18 and want to study abroad, a parent or guardian can book the consultation and we will tell you honestly whether we are the right people to help.",
        },
      ],
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      blocks: [
        {
          kind: "text",
          body: "The date at the top of this page is the date it last changed. Material changes will be notified to anyone with an account, by email, before they take effect, and the previous version will be available on request. We will not change this policy quietly and rely on you re-reading it.",
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Terms of use
 * ------------------------------------------------------------------ */

export const termsOfUse: LegalDocument = {
  slug: "terms",
  title: "Terms of use",
  lede:
    "What this site is, what an account gets you, what we will and will not do, and what happens if we disagree. Short, because a long one is usually hiding something.",
  reviewState: "draft-published",
  reviewedBy: null,
  reviewedOn: null,
  lastUpdated: "2026-09-03",
  openItems: [
    "A lawyer has not reviewed this text.",
    "The service agreement that governs a paid engagement is a separate document, signed per client. Its standard terms are summarised on this page and are not yet published in full.",
    "No registered entity exists to be a party to these terms. They take effect against the entity on the day it is registered.",
  ],
  sections: [
    {
      id: "scope",
      heading: "What these terms cover",
      blocks: [
        { kind: "callout", tone: "warning", title: "No registered entity yet", body: NOT_INCORPORATED },
        {
          kind: "text",
          body: "These terms cover your use of this website, the free tools on it, and any account you create. A paid engagement is governed by a separate written service agreement, signed by both sides before any fee is due. Where the two differ, the service agreement wins for the work it covers.",
        },
      ],
    },
    {
      id: "what-this-is",
      heading: "What this site is, and is not",
      blocks: [
        {
          kind: "list",
          items: [
            "It is a study abroad consultancy's site, publishing what we earn on every university we recommend, including the ones that pay us nothing.",
            "It is not a university, an admissions authority, a visa authority, or an agent of any of them. See the non affiliation disclaimer.",
            "It is not a lender, a broker, an insurer or a currency exchange, and it does not hold a licence to be any of those.",
            "It is not an immigration adviser regulated by any authority. Where a route requires regulated immigration advice, we will tell you so and not give it.",
            "Nothing on this site is a guarantee of admission, of a visa, of a scholarship, or of an outcome of any kind. Anyone who offers you one of those is either lying or committing fraud on your behalf.",
          ],
        },
      ],
    },
    {
      id: "accuracy",
      heading: "The figures on this site",
      blocks: [
        {
          kind: "text",
          body: "Every figure here carries the official body it came from and the date it was written into the site, and each one says whether a named person has since re-checked it at source. Fees, thresholds and immigration rules change without notice and frequently. Verify anything you are about to spend money against at its official source, or ask us to, and treat our figures as a planning starting point rather than as a decided fact.",
        },
        {
          kind: "text",
          body: "Commission figures carry a verification state of their own, from unverified market estimate through to verified and cleared for publication. An unverified estimate is labelled as one everywhere it appears, and it may not be presented as a contract term because it is not one.",
        },
      ],
    },
    {
      id: "tools",
      heading: "The free tools",
      blocks: [
        {
          kind: "list",
          items: [
            "They are free, they need no account, and no result is ever withheld behind a form.",
            "They run entirely in your browser. Nothing you type into a calculator is transmitted to us or stored anywhere.",
            "Each one shows its formula, its arithmetic and its source, so you can check it rather than trust it.",
            "None of them produces a probability, a score or a prediction, and none of them is a substitute for the deciding institution's own conversion or assessment.",
            "A figure you calculated here does not belong on an application form. Use the number on your official transcript.",
          ],
        },
      ],
    },
    {
      id: "account",
      heading: "Your account",
      blocks: [
        {
          kind: "list",
          items: [
            "Signing up creates a student account. Staff accounts are created only by someone who already holds one, and a signup can never produce one.",
            "You are responsible for keeping your password to yourself. Tell us immediately if you think someone else has it.",
            "One person, one account. Do not share it, because the audit trail attributes everything done in your account to you.",
            "We may suspend an account that is being used to submit documents that are not the account holder's, or to abuse a member of staff. Both are rare and both have happened in this industry.",
            "You can close your account whenever you like. What happens to your data then is in the privacy policy under Retention.",
          ],
        },
      ],
    },
    {
      id: "our-obligations",
      heading: "What we commit to",
      blocks: [
        {
          kind: "list",
          items: [
            "To tell you when we think you should not go abroad at all, if that is our honest assessment. It is part of the paid consultation and it is not a comfortable conversation to sell.",
            "To publish the commission we earn on every institution we recommend to you, before we recommend it, in writing, including where the figure runs above the category average.",
            "To verify every document against the original or with the issuing institution, and to never edit, retouch or alter one for any reason.",
            "To never write a bank statement, a source of funds letter, a work experience letter or a statement of purpose on your behalf, and to never let an automated system draft one.",
            "To tell you which universities pay us nothing, and to keep recommending them where they are the right answer.",
            "To publish our outcomes quarterly, refusals included.",
          ],
        },
      ],
    },
    {
      id: "your-obligations",
      heading: "What we need from you",
      blocks: [
        {
          kind: "list",
          items: [
            "Accurate documents and an accurate account of your record, including backlogs, gaps and previous refusals. Every one of those is workable when disclosed and fatal when discovered.",
            "Your own words in anything that is meant to be your own words. We coach and we edit a statement of purpose; we do not write one, and a ghostwritten one is detectable and disqualifying.",
            "Responses inside the deadlines we set out, because most of them are somebody else's deadline and we cannot move them.",
            "Not asking us to falsify or misrepresent anything. We will decline, and we will end the engagement.",
          ],
        },
      ],
    },
    {
      id: "fees",
      heading: "Fees, and what governs them",
      blocks: [
        {
          kind: "text",
          body: "The consultation is priced in public. Advisory fees are stated per destination route on this site, and the reason the German public university route costs more is that no university on it pays us anything. Nothing is charged that was not stated in writing before you agreed to it.",
        },
        {
          kind: "text",
          body: "A paid engagement runs on a signed service agreement setting out scope, fee, timeline and what is excluded. Refunds and cancellation are governed by the refund policy, which is a separate page with actual windows and figures on it rather than a sentence saying fees are non-refundable.",
        },
      ],
    },
    {
      id: "ip",
      heading: "What belongs to whom",
      blocks: [
        {
          kind: "list",
          items: [
            "Your documents, your transcripts and your writing remain yours. We hold them to do the work you engaged us for.",
            "The content on this site, including the guides and the tools, is ours. You are welcome to read it, quote it with attribution, and check our arithmetic. Republishing it wholesale as your own is not on.",
            "Where we produce a document for you, a shortlist, an assessment, a funding plan, it is yours to keep and to take to another consultant.",
          ],
        },
      ],
    },
    {
      id: "liability",
      heading: "Where our responsibility ends",
      blocks: [
        {
          kind: "text",
          body: "We are responsible for doing the work we were engaged to do, competently and honestly, and we accept liability for failing to. We are not responsible for a decision made by a university, a visa authority, a lender or a landlord, because none of those decisions is ours to make, and no consultancy that tells you otherwise is being straight with you.",
        },
        {
          kind: "list",
          intro: "Specifically, we are not liable for:",
          items: [
            "An admission decision, a visa refusal, or a scholarship outcome.",
            "A change in immigration rules, fees or thresholds after we advised you, though we will tell you when one lands and rework the plan.",
            "A deadline missed because information we asked for did not arrive in time.",
            "Anything in a document you gave us that was not true.",
            "The acts of a third party you engaged directly, including a lender, an insurer or an accommodation provider.",
          ],
        },
        {
          kind: "text",
          body: "Nothing here excludes liability that cannot lawfully be excluded, including for fraud or for death or personal injury caused by negligence. This section does not limit your rights under the Consumer Protection Act, 2019.",
        },
      ],
    },
    {
      id: "disputes",
      heading: "If we disagree",
      blocks: [
        {
          kind: "list",
          items: [
            "Tell us first, in writing. We would rather fix it than argue about it, and most disputes in this industry are a communication failure with a document at the bottom of it.",
            "You will get a substantive written answer within seven working days.",
            "If that does not settle it, these terms are governed by Indian law and the courts at Bengaluru have jurisdiction.",
            "A dispute about a published commission figure has its own route: it is on the Open Ledger, the figure is frozen while it is examined, and the fact of the dispute is published rather than the figure quietly changing.",
          ],
        },
      ],
    },
    {
      id: "changes",
      heading: "Changes to these terms",
      blocks: [
        {
          kind: "text",
          body: "The date at the top is the date these terms last changed. Material changes are notified to account holders by email before they take effect. A change to these terms does not change a signed service agreement already in force.",
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Cookie policy
 * ------------------------------------------------------------------ */

export const cookiePolicy: LegalDocument = {
  slug: "cookies",
  title: "Cookie policy",
  lede:
    "One cookie, set only when you sign in, used only to keep you signed in. This page exists because we set it and previously said nothing about it, and because a site with no trackers should be able to prove that in a sentence.",
  reviewState: "draft-published",
  reviewedBy: null,
  reviewedOn: null,
  lastUpdated: "2026-09-03",
  openItems: [
    "A lawyer has not reviewed this text.",
    "If analytics is ever added, it will be off by default, it will be listed in the table below before it runs, and it will require an opt in. That is a commitment on this page rather than a setting somewhere.",
  ],
  sections: [
    {
      id: "what",
      heading: "What we set",
      blocks: [
        {
          kind: "table",
          caption: "Every cookie this site sets",
          columns: ["Name", "What it does", "When it is set", "How long it lasts", "Type"],
          rows: [
            [
              "next_scholar_session",
              "Holds a signed token identifying your session, so that moving between pages does not sign you out. It carries your user id, your role and an expiry, and it is signed so it cannot be edited or forged.",
              "Only when you successfully sign in. Never on a marketing page, and never before you sign in.",
              "Until it expires or you sign out",
              "Strictly necessary",
            ],
          ],
        },
        {
          kind: "list",
          intro: "Its technical properties, because they are the part that matters:",
          items: [
            "httpOnly, so no JavaScript on the page can read it, which is what makes stealing it hard.",
            "Signed, so a modified cookie is rejected rather than trusted. The tests for this deliberately try to forge, edit and expire one.",
            "SameSite protected, so another site cannot use it to act as you.",
            "Secure in production, so it is never sent over a plain connection.",
            "It contains no document, no transcript and no contact detail. It identifies a session, and nothing more.",
          ],
        },
      ],
    },
    {
      id: "no-banner",
      heading: "Why there is no cookie banner",
      blocks: [
        {
          kind: "text",
          body: "Because a consent banner exists to obtain consent for cookies that are not strictly necessary, and we do not set any. There is no analytics, no advertising pixel, no session recording, no heatmap, no A/B testing tool and no social embed on this site. A banner asking you to accept cookies we do not set would be theatre, and it would train you to click accept on the sites where it does matter.",
        },
        {
          kind: "callout",
          tone: "note",
          title: "You can still refuse the one cookie we set",
          body: "Blocking it is entirely within your control, in your browser's settings, and it costs you nothing on the public site: every guide, every tool and every policy page works with cookies blocked entirely. The only thing it prevents is staying signed in to a portal account, which is what the cookie is for.",
        },
      ],
    },
    {
      id: "third-party",
      heading: "Third-party content on this site",
      blocks: [
        {
          kind: "text",
          body: "Two external services serve images to this site: a public flag artwork host, and a photography host for the decorative photographs. Both receive your IP address and browser details, as any server does when your browser requests a file from it. Neither sets a cookie through this site, and neither receives anything about who you are or what you are applying for.",
        },
        {
          kind: "text",
          body: "There are no embedded videos, no chat widgets, no font trackers and no maps. Fonts are served from this site's own origin.",
        },
      ],
    },
    {
      id: "storage",
      heading: "Local storage and the tools",
      blocks: [
        {
          kind: "text",
          body: "The calculators keep the numbers you type in the page's memory while you are using them, which is how a total updates as you type. Nothing is written to your device's storage, nothing is sent to us, and closing the tab discards all of it. That is why a calculator here cannot show you your last result and does not ask you to sign in to save one.",
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Refund and cancellation policy
 * ------------------------------------------------------------------ */

export const refundPolicy: LegalDocument = {
  slug: "refund-policy",
  title: "Refunds and cancellation",
  lede:
    "Windows, figures and exclusions, stated as figures. Most consultancies answer this question with the sentence 'fees are non-refundable', which is a policy for their benefit and not a policy at all.",
  reviewState: "draft-published",
  reviewedBy: null,
  reviewedOn: null,
  lastUpdated: "2026-09-03",
  openItems: [
    "A lawyer has not reviewed this text.",
    "No payment provider is connected yet, so no fee has been collected under this policy and no refund has been processed under it. The processing times below are commitments rather than measured performance.",
  ],
  sections: [
    {
      id: "principles",
      heading: "The two principles behind this page",
      blocks: [
        {
          kind: "list",
          items: [
            "You pay for work, and where the work has not been done you get your money back. Where it has been done, you keep the output, and it is yours to take elsewhere.",
            "Money we have already paid to someone else on your instruction, a university deposit, a test fee, a government fee, cannot be refunded by us because we do not have it. We will say which line that is and how much, rather than refusing the whole request.",
          ],
        },
      ],
    },
    {
      id: "consultation",
      heading: "The paid consultation",
      blocks: [
        {
          kind: "table",
          caption: "Consultation refunds",
          columns: ["When you cancel", "What you get back", "Processed within"],
          rows: [
            ["More than 24 hours before the session", "The full fee", "5 working days"],
            [
              "Inside 24 hours, or you do not attend",
              "Nothing, though you may reschedule once at no charge if you tell us before the session starts",
              "Not applicable",
            ],
            [
              "We cancel or reschedule, for any reason",
              "The full fee, or a rescheduled session at your choice",
              "5 working days",
            ],
            [
              "You attend and the written assessment does not arrive within 24 hours",
              "The full fee, and you keep the assessment when it arrives",
              "5 working days",
            ],
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "The assessment is the deliverable, not the meeting",
          body: "A consultation produces a written assessment within 24 hours with two or three ranked destinations and the risks attached to each. If that does not arrive on time, the fee comes back whether or not the meeting was useful. That is the commitment the fee buys.",
        },
      ],
    },
    {
      id: "advisory",
      heading: "The advisory fee",
      blocks: [
        {
          kind: "text",
          body: "The advisory fee covers the engagement from shortlist through to arrival. It is charged in stages against work delivered, and what follows describes what is refundable at each point.",
        },
        {
          kind: "table",
          caption: "Advisory fee refunds by stage",
          columns: ["Where the engagement is", "What is refundable"],
          rows: [
            [
              "Agreement signed, shortlist not yet delivered",
              "The full fee paid to date, less nothing. No work product has been handed over.",
            ],
            [
              "Shortlist delivered, no application submitted",
              "Everything except the shortlist stage fee. You keep the shortlist, including the commission figures on it.",
            ],
            [
              "Applications submitted",
              "The stages not yet reached. Submitted applications cannot be unsubmitted, and application fees paid to universities are theirs rather than ours.",
            ],
            [
              "Offer received, visa file not started",
              "The visa, pre-departure and arrival stage fees.",
            ],
            [
              "Visa refused",
              "The pre-departure and arrival stage fees, in full. A refusal is not a reason to keep money for work that will now not happen.",
            ],
            [
              "You decide not to go",
              "Every stage not yet delivered, at whatever point you tell us.",
            ],
          ],
        },
      ],
    },
    {
      id: "never",
      heading: "What we never refund, and why",
      blocks: [
        {
          kind: "list",
          items: [
            "University application fees, deposits and tuition. Paid to the institution, held by the institution, refundable only under the institution's own policy, which we will read with you before you transfer anything.",
            "Government and statutory fees: visa fees, the Immigration Health Surcharge, IRP registration, APS and dMAT fees. Non-refundable by the body that charges them, including on a refusal.",
            "Test fees: IELTS, TOEFL, PTE, TestDaF. Governed by the test provider's own cancellation terms.",
            "Third-party charges you incurred directly: courier, notarisation, translation, medical tests, blocked account handling fees.",
            "Work already delivered. If you have the shortlist, the assessment, the funding plan or the prepared visa file, that stage is done.",
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "One exception that runs the other way",
          body: "If we made a mistake that cost you a fee, a missed deadline that was ours, a document error we introduced, a wrong figure we published and you relied on, we refund the fee we charged for that stage and we cover the third-party cost our mistake caused. That is not a goodwill gesture, it is what being responsible for our own work means.",
        },
      ],
    },
    {
      id: "how",
      heading: "How to claim",
      blocks: [
        {
          kind: "list",
          items: [
            "Ask in writing, by email or through your portal. A phone call is fine to start with, and we will confirm it in writing before acting on it.",
            "Say what you are claiming and why. You do not need to argue it: if it falls inside a window above, quoting the window is enough.",
            "We answer within 3 working days with a decision and, where the answer is partial, a line by line breakdown of what is refundable and what is not.",
            "Approved refunds are processed within 5 working days to the original payment method. Bank processing can add a few days on top and is outside our control.",
            "If you disagree with the decision, the dispute route in the terms of use applies, and no clause on this page stops you using it.",
          ],
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Non-affiliation disclaimer
 * ------------------------------------------------------------------ */

export const nonAffiliation: LegalDocument = {
  slug: "non-affiliation",
  title: "Non affiliation disclaimer",
  lede:
    "We name a lot of official bodies on this site, because you cannot explain these routes without naming them. We are not any of them, we do not act for any of them, and none of them has endorsed us.",
  reviewState: "draft-published",
  reviewedBy: null,
  reviewedOn: null,
  lastUpdated: "2026-09-03",
  openItems: [
    "A lawyer has not reviewed this text.",
    "Where a commercial partnership with any named body ever exists, it will be added to this page with its terms and its remuneration, and it will be disclosed on every page where the recommendation appears.",
  ],
  sections: [
    {
      id: "bodies",
      heading: "The bodies we name, and our relationship with each",
      blocks: [
        {
          kind: "table",
          caption: "Named organisations and our relationship to them",
          columns: ["Organisation", "What it actually is", "Our relationship"],
          rows: [
            [
              "APS India, the Academic Evaluation Centre",
              "The body that verifies Indian academic documents for German university admission, and which administers the dMAT",
              "None. We are not an APS agent, we cannot expedite an APS application, and we charge nothing for APS itself. We explain the process and check your documents against its requirements before you submit.",
            ],
            [
              "uni-assist e.V.",
              "The service many German universities use to pre-check international applications",
              "None. We are not a uni-assist partner and we have no channel into it that you do not have.",
            ],
            [
              "DAAD",
              "The German Academic Exchange Service, which funds scholarships and publishes guidance",
              "None. We are not a DAAD representative and we do not administer, influence or have advance sight of any DAAD scholarship.",
            ],
            [
              "UKVI, UK Visas and Immigration",
              "The Home Office directorate that decides UK visa applications",
              "None. We are not an immigration adviser regulated by any UK authority, we cannot influence a decision, and we do not offer regulated immigration advice.",
            ],
            [
              "Irish Immigration Service Delivery",
              "The Department of Justice service that decides Irish visa applications",
              "None, on the same terms.",
            ],
            [
              "German missions in India",
              "The embassy and consulates that issue German national visas",
              "None. We cannot obtain, expedite or reserve a visa appointment, and anyone who tells you they can should be asked how.",
            ],
            [
              "Universities named on this site",
              "The institutions that decide admissions",
              "Some pay agents a commission and some do not, and which is which is published on the Open Ledger with the figure. None of them has endorsed us, and being listed here is not a partnership.",
            ],
            [
              "IELTS, TOEFL, PTE, TestDaF, DSH, telc, Goethe-Institut",
              "Language test providers and their administering bodies",
              "None. We are not a test centre, we do not sell test bookings, and we earn nothing from a test you book.",
            ],
            [
              "anabin, and the Zentralstelle fur auslandisches Bildungswesen",
              "The German database and body that assess foreign qualification equivalence",
              "None. We read anabin as anyone can. We do not decide an equivalence and we cannot change one.",
            ],
          ],
        },
      ],
    },
    {
      id: "cannot",
      heading: "What follows from that",
      blocks: [
        {
          kind: "list",
          intro: "Because we are none of the above, there are things we cannot do, and it is worth being explicit since parts of this industry imply otherwise:",
          items: [
            "We cannot guarantee admission to any university, or influence an admission decision.",
            "We cannot guarantee a visa, expedite a decision, or obtain an appointment slot that is not publicly available.",
            "We cannot expedite APS, uni-assist or a language test result.",
            "We cannot secure a scholarship, or improve your standing in a scholarship process.",
            "We cannot change an anabin classification or a credit equivalence.",
            "We cannot make a document say something it does not say. That one is a policy as well as a limitation.",
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "If a consultancy offers you any of the above, that is the tell",
          body: "Nobody in this market can do those things, so an offer to do them is either a lie about the offer or a plan to falsify something. Both end with your application refused and, in the second case, with a permanent mark against your name at the body that catches it.",
        },
      ],
    },
    {
      id: "trademarks",
      heading: "Names and trademarks",
      blocks: [
        {
          kind: "text",
          body: "Every organisation name and trademark on this site belongs to its owner and is used for identification and description only. Their use here is not a claim of association, sponsorship or endorsement in either direction. Where an organisation would prefer a different form of words about it on this site, we would rather hear from them than guess: the contact route is on the privacy policy page.",
        },
      ],
    },
  ],
};

export const legalDocuments: LegalDocument[] = [
  privacyPolicy,
  termsOfUse,
  cookiePolicy,
  refundPolicy,
  nonAffiliation,
];

export function legalDocumentFor(slug: string): LegalDocument | null {
  return legalDocuments.find((doc) => doc.slug === slug) ?? null;
}
