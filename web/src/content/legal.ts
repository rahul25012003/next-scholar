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
  "Next Scholar is not yet incorporated. Until it is, there is no registered entity for this document to bind, and no CIN, GSTIN or registered address to show. We leave those details blank rather than fill them with placeholders. This document applies to the entity from the day it is registered.";

/* ------------------------------------------------------------------ *
 * Privacy policy
 * ------------------------------------------------------------------ */

export const privacyPolicy: LegalDocument = {
  slug: "privacy",
  title: "Privacy policy",
  lede:
    "What we collect, why, who it is shared with, how long we keep it, and your rights over it. Written for India's Digital Personal Data Protection Act, 2023, the law that applies to a Bengaluru consultancy handling your passport.",
  reviewState: "draft-published",
  reviewedBy: null,
  reviewedOn: null,
  lastUpdated: "2026-09-03",
  openItems: [
    "A lawyer has not reviewed this text. We publish it as a draft, not as a settled policy.",
    "The grievance officer role is defined, but no one holds it yet, because there is no registered entity to appoint them. Until then, use the route in the Complaints section.",
    "We have not yet signed a contract with a storage provider or chosen its region. So the Transfers section describes what we intend, not what is already in place.",
    "A case past its retention period is now deleted automatically. That deletion does not yet survive a server restart, and it does not yet remove the audit trail. The 'How long we keep it' section explains both gaps.",
  ],
  sections: [
    {
      id: "who",
      heading: "Who this policy is from",
      blocks: [
        { kind: "callout", tone: "warning", title: "No registered entity yet", body: NOT_INCORPORATED },
        {
          kind: "list",
          items: [
            "Next Scholar is a study abroad consultancy based in Bengaluru, Karnataka. We serve clients across India.",
            "Under the Digital Personal Data Protection Act, 2023, we are a data fiduciary. That means we decide what personal data is collected and why.",
            "You are the data principal. The rights below are yours, not a favour from us.",
          ],
        },
      ],
    },
    {
      id: "collect",
      heading: "What we collect",
      blocks: [
        {
          kind: "text",
          body: "We collect only what a specific step in your application needs, and only once that step is under way. We never collect documents just in case they are useful later.",
        },
        {
          kind: "table",
          caption: "Every category of personal data we hold, why, and the lawful basis for it",
          columns: ["What", "Why we need it", "Lawful basis"],
          rows: [
            [
              "Name, email address, phone number",
              "To identify your account, contact you about your application, and reply when you ask us something",
              "Your consent, given at signup, and the need to deliver the service you engaged us for",
            ],
            [
              "Academic transcripts, degree certificates, mark sheets",
              "To check you meet a programme's stated requirements, and to submit applications for you",
              "Your consent, recorded for each document category before we collect it",
            ],
            [
              "Passport copy",
              "Proof of identity on university applications and on the visa file",
              "Your consent, recorded for each document category",
            ],
            [
              "English and language test results",
              "To meet the language requirement on each application",
              "Your consent, recorded for each document category",
            ],
            [
              "Bank statements, loan sanction letters, funding evidence",
              "To show a visa authority, and a university where needed, that you have the funds",
              "Your consent, recorded for each document category",
            ],
            [
              "Letters of recommendation",
              "To send with applications that ask for references",
              "Your consent, recorded for each document category",
            ],
            [
              "Photographs for application forms",
              "Some application forms require one",
              "Your consent, recorded for each document category",
            ],
            [
              "Notes written by your counsellor about your case",
              "To manage your application properly, and so a colleague covering for your counsellor can take over",
              "The need to deliver the service you engaged us for",
            ],
            [
              "Communication history: email, WhatsApp and call notes",
              "So there is a written record of what was said to you, and by whom",
              "The need to deliver the service, and your separate opt in for each messaging channel",
            ],
            [
              "Session cookie",
              "To keep you signed in, and nothing else",
              "Strictly necessary for a service you asked for. See the cookie policy.",
            ],
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "You consent per document category, and you can withdraw it",
          body: "Before we collect any sensitive document, we ask for your explicit consent for that category. We record, by name, who the document may be shared with, and we timestamp the consent. You can withdraw any consent from your portal at any time. Withdrawing does not delete the record that you once consented, because we need that record to answer you if you ever ask what we did with a document.",
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
            "We do not run advertising or analytics trackers on this site. There is no third-party pixel, so there is no consent banner asking you to accept one.",
            "We do not collect caste, religion, political affiliation or health data. No field on this platform stores them.",
            "We do not collect documents to keep on file. If a step does not need a document, we do not ask for it.",
            "We do not use your documents or your case notes to train any AI model, ours or anyone else's.",
          ],
        },
      ],
    },
    {
      id: "ai",
      heading: "Where automated systems use your data",
      blocks: [
        {
          kind: "list",
          intro: "This platform uses AI models for a short, fixed list of tasks. Each one runs on your data:",
          items: [
            "Summarising a case for your counsellor.",
            "Drafting an internal message, which a person edits and sends.",
            "Pulling details out of a document you uploaded, for a person to confirm.",
            "Checking your file for missing items.",
            "Answering your questions from your own record and our published policies.",
          ],
        },
        {
          kind: "list",
          intro: "These limits are enforced in the software, not left to staff to remember:",
          items: [
            "No automated system can mark a document verified. Only a named member of staff can, and we log their name and the time.",
            "No automated system can draft a bank statement, a source of funds letter, a work experience letter or a statement of purpose.",
            "No automated system can submit an application, contact you directly, or close your case.",
            "No automated system calculates or shows a probability of admission or of a visa decision, to you or to anyone on our team.",
            "Every field on your record shows whether a person or a machine set it, so a wrong value can always be traced to who set it.",
            "Where an AI model provider processes your data, it does so under a contract that forbids training on it. We do not use any provider without that contract.",
          ],
        },
      ],
    },
    {
      id: "sharing",
      heading: "Who we share your data with",
      blocks: [
        {
          kind: "list",
          intro: "Only these, and each one only for the step named:",
          items: [
            "Universities and their application platforms, for the applications you ask us to submit. The consent for that document category names which universities.",
            "uni-assist, APS India and similar bodies, where your route needs them.",
            "Visa authorities and the commercial partners they appoint, where a visa application needs it.",
            "Our own infrastructure providers: hosting, database, document storage and email delivery. Each one acts only on our instructions and is not free to use your data.",
            "AI model providers, for the tasks listed above, under contracts that forbid training on your data.",
            "A regulator, court or authority, where the law requires it. If that happens and we are allowed to tell you, we will.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "We do not sell your data, and we do not take referral money without publishing it",
          body: "We never pass your contact details to a lender, an accommodation provider, a forex service or an insurer for a fee, unless two things are true: the arrangement and what we are paid for it are published on this site, and you have separately agreed to the introduction.",
        },
      ],
    },
    {
      id: "transfers",
      heading: "Transfers outside India",
      blocks: [
        {
          kind: "text",
          body: "Applying abroad means your documents go abroad. A UK university cannot assess a transcript it has not received. Some of our infrastructure providers also process data outside India.",
        },
        {
          kind: "list",
          intro: "The contracts are not signed yet, so this is what we intend, not what is in place:",
          items: [
            "Main document storage will be in an Indian region.",
            "Every processor outside India will be checked against any transfer restrictions the government sets under the DPDP Act.",
            "Once the contracts are signed, we will publish the list of processors and their regions on this page.",
          ],
        },
        {
          kind: "text",
          body: "Until that list appears here, read this section as a commitment, not as a description of a running system.",
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
              "Our anti fraud commitment keeps a written file for five years, so a question about our work on an application can still be answered years later",
            ],
            [
              "Sensitive documents: passport, transcripts, bank statements",
              "Deleted when the applications they were collected for are finished, or when you withdraw consent, whichever comes first",
              "There is no reason to keep a passport copy after the visa is decided",
            ],
            [
              "Audit trail of who read and changed your record",
              "Five years from the date your case is closed",
              "An audit trail deleted before the file it describes cannot settle a dispute",
            ],
            [
              "Account and login records",
              "Until you close your account, then 90 days",
              "The 90 days lets us undo an accidental closure",
            ],
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Case files are now deleted automatically. Two gaps remain.",
          body: "A case past its five year retention date is now deleted automatically, by the same scheduled job that runs the platform's other daily housekeeping. No person has to check a dashboard first. Two things are not yet true. First, that job does not delete the audit trail of who read and changed the file, so the trail currently lasts longer than the five years stated above. Second, until a permanent database is connected, this deletion does not survive a server restart, like every other change on the platform today. If you ask us in writing, we will close either gap by hand in the meantime.",
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
              body: "Ask for a copy of the personal data we hold about you, a list of who it has been shared with, and the notes on your case. Your portal already shows most of this. For the rest, ask and we will send it within 30 days.",
            },
            {
              term: "Correction and completion",
              body: "Ask us to correct anything wrong or incomplete. Your counsellor can fix a value on your record directly. Every correction is logged with its reason, so a fix is visible, not silent.",
            },
            {
              term: "Erasure",
              body: "Ask us to delete your data and we will, except where we must keep something. We cannot recall an application already submitted to a university, and the five year anti fraud file has a stated purpose. We will tell you exactly what we kept and why, rather than refusing in general terms.",
            },
            {
              term: "Withdraw consent",
              body: "Withdraw consent for any document category or messaging channel from your portal. Messages stop immediately. Documents already submitted with an application cannot be taken back, and we will tell you that plainly.",
            },
            {
              term: "Grievance redressal",
              body: "Complain about how we have handled your data, and get a proper answer. The route is in the next section.",
            },
            {
              term: "Nominate someone",
              body: "Name a person to use these rights for you if you die or can no longer use them yourself. Ask us and we will record the nomination on your file.",
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
          title: "The role is defined. No one is appointed to it yet.",
          body: "The DPDP Act requires a data fiduciary to publish a grievance officer's contact details. We cannot appoint one before the entity exists, and we will not print a name that is not real. Below is what you can do today, and the commitment that applies from the day of incorporation.",
        },
        {
          kind: "list",
          intro: "Today:",
          items: [
            "If you have a counsellor on a case with us, raise it with them first. Most complaints are a misunderstanding about a document and are sorted out the same day.",
            "There is no public complaints channel yet. The booking form sends nothing, and the email address for complaints goes live with the registered company.",
            "Once a complaint reaches us, you will get a proper answer, not just an acknowledgement, within seven working days.",
          ],
        },
        {
          kind: "list",
          intro: "From the day the entity is registered:",
          items: [
            "A named grievance officer, with a direct email address and a phone number, published on this page and in the footer.",
            "A stated reply time of seven working days, and a stated escalation path if we miss it.",
            "Your right to escalate to the Data Protection Board of India, with the route to do it, whether or not you have come to us first.",
          ],
        },
      ],
    },
    {
      id: "breach",
      heading: "If something goes wrong",
      blocks: [
        {
          kind: "list",
          intro: "A personal data breach means telling you and telling the Data Protection Board of India. Once a breach is confirmed, we commit to:",
          items: [
            "Notify the Board and every affected person without undue delay.",
            "Say what actually happened, not just that an incident occurred.",
            "Say what data was involved.",
            "Say what we are doing about it.",
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "The written breach protocol is an open gap",
          body: "None of this is written down yet: who is told in what order, within what time, through which escalation path, and who has the authority to declare a breach. The commitment above is real. The step-by-step plan behind it is not written yet.",
        },
      ],
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      blocks: [
        {
          kind: "list",
          items: [
            "The date at the top of this page is the date it last changed.",
            "Before a significant change takes effect, we will email everyone with an account.",
            "The previous version is available on request.",
            "We will not change this policy quietly and rely on you re-reading it.",
          ],
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
    "What this site is, what an account gives you, what we will and will not do, and what happens if we disagree.",
  reviewState: "draft-published",
  reviewedBy: null,
  reviewedOn: null,
  lastUpdated: "2026-09-03",
  openItems: [
    "A lawyer has not reviewed this text.",
    "Paid work is covered by a separate service agreement, signed with each client. This page summarises its standard terms. The full terms are not published yet.",
    "There is no registered entity yet to be a party to these terms. They apply to the entity from the day it is registered.",
  ],
  sections: [
    {
      id: "scope",
      heading: "What these terms cover",
      blocks: [
        { kind: "callout", tone: "warning", title: "No registered entity yet", body: NOT_INCORPORATED },
        {
          kind: "list",
          items: [
            "These terms cover your use of this website, its free tools, and any account you create.",
            "Paid work is covered by a separate written service agreement, signed by both sides before any fee is due.",
            "Where the two differ, the service agreement wins for the work it covers.",
          ],
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
            "It is the website of a study abroad consultancy.",
            "It is not a university, an admissions authority, a visa authority, or an agent of any of them. See the non affiliation disclaimer.",
            "It is not a lender, a broker, an insurer or a currency exchange, and it holds no licence to be any of those.",
            "It is not an immigration adviser regulated by any authority. Where a route needs regulated immigration advice, we will tell you so and not give it.",
            "Nothing on this site guarantees admission, a visa, a scholarship, or any other outcome. Anyone who offers you one of those is either lying or committing fraud on your behalf.",
          ],
        },
      ],
    },
    {
      id: "accuracy",
      heading: "The figures on this site",
      blocks: [
        {
          kind: "list",
          items: [
            "Every figure here shows the official body it came from and the date we added it to the site.",
            "Each figure also says whether a named person has re-checked it at source since then.",
            "Fees, thresholds and immigration rules change often and without notice.",
            "Before you spend money based on a figure, check it at its official source, or ask us to.",
            "Treat our figures as a starting point for planning, not as settled fact.",
          ],
        },
        {
          kind: "text",
          body: "Commission figures also show how far they have been checked, from unverified market estimate up to verified and cleared for publication. An unverified estimate is labelled as one wherever it appears. It may not be presented as a contract term, because it is not one.",
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
            "They are free, they need no account, and no result is ever held back behind a form.",
            "They run entirely in your browser. Nothing you type into a calculator is sent to us or stored anywhere.",
            "Each one shows its formula, its working and its source, so you can check it rather than trust it.",
            "None of them gives a probability, a score or a prediction. None of them replaces the deciding institution's own conversion or assessment.",
            "Do not put a figure you calculated here on an application form. Use the number on your official transcript.",
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
            "Signing up creates a student account. Staff accounts can only be created by someone who already has one. Signing up can never create a staff account.",
            "You are responsible for keeping your password private. Tell us immediately if you think someone else has it.",
            "One person, one account. Do not share it, because the audit trail records everything done in your account as done by you.",
            "We may suspend an account used to submit documents that are not the account holder's, or to abuse a member of staff. Both are rare, and both have happened in this industry.",
            "You can close your account at any time. What happens to your data then is in the privacy policy, under 'How long we keep it'.",
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
            "To tell you if we honestly think you should not go abroad at all. It is part of the paid consultation, even though it is a hard thing to sell.",
            "To publish, in writing, the commission we earn on every institution we recommend to you, before we recommend it, including where it is above the category average.",
            "To verify every document against the original or with the issuing institution, and never to edit, retouch or alter one for any reason.",
            "Never to write a bank statement, a source of funds letter, a work experience letter or a statement of purpose for you, and never to let an automated system draft one.",
            "To tell you which universities pay us nothing, and to keep recommending them where they are the right choice.",
            "To publish our results every quarter, refusals included.",
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
            "Accurate documents and an accurate account of your record, including backlogs, gaps and past refusals. Each of these can be worked with if you tell us, and is fatal if it is discovered later.",
            "Your own words in anything meant to be in your own words. We coach and edit a statement of purpose. We do not write one. A ghostwritten one can be detected and will disqualify you.",
            "Replies within the deadlines we set, because most are someone else's deadline and we cannot move them.",
            "Not asking us to falsify or misrepresent anything. We will refuse, and we will end the engagement.",
          ],
        },
      ],
    },
    {
      id: "fees",
      heading: "Fees, and what governs them",
      blocks: [
        {
          kind: "list",
          items: [
            "The consultation price is public.",
            "Advisory fees are shown on this site for each destination route.",
            "We charge nothing that was not stated in writing before you agreed to it.",
            "Paid work runs on a signed service agreement that sets out the scope, fee, timeline and what is not included.",
            "Refunds and cancellation are covered by the refund policy, a separate page with actual time windows and figures.",
          ],
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
            "Your documents, transcripts and writing stay yours. We hold them to do the work you engaged us for.",
            "The content on this site, including the guides and the tools, is ours. You are welcome to read it, quote it with credit, and check our arithmetic. You may not republish it wholesale as your own.",
            "Any document we produce for you, such as a shortlist, an assessment or a funding plan, is yours to keep and to take to another consultant.",
          ],
        },
      ],
    },
    {
      id: "liability",
      heading: "Where our responsibility ends",
      blocks: [
        {
          kind: "list",
          items: [
            "We are responsible for doing the work you engaged us for, competently and honestly. We accept liability if we fail to.",
            "We are not responsible for a decision made by a university, a visa authority, a lender or a landlord. None of those decisions is ours to make, and any consultancy that says otherwise is not being straight with you.",
          ],
        },
        {
          kind: "list",
          intro: "In particular, we are not liable for:",
          items: [
            "An admission decision, a visa refusal, or a scholarship outcome.",
            "A change in immigration rules, fees or thresholds after we advised you. We will still tell you when one happens and rework the plan.",
            "A deadline missed because information we asked for did not arrive in time.",
            "Anything untrue in a document you gave us.",
            "The actions of a third party you dealt with directly, including a lender, an insurer or an accommodation provider.",
          ],
        },
        {
          kind: "text",
          body: "Nothing here excludes liability that the law does not allow us to exclude, including for fraud, or for death or personal injury caused by negligence. This section does not limit your rights under the Consumer Protection Act, 2019.",
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
            "Tell us first, in writing. We would rather fix the problem than argue about it. Most disputes in this industry come down to a misunderstanding over a document.",
            "You will get a proper written answer within seven working days.",
            "If that does not settle it, these terms are governed by Indian law and the courts at Bengaluru have jurisdiction.",
            "A dispute about a published commission figure has its own route. It goes on the Open Ledger, the figure is frozen while we look into it, and we publish the dispute rather than quietly changing the figure.",
          ],
        },
      ],
    },
    {
      id: "changes",
      heading: "Changes to these terms",
      blocks: [
        {
          kind: "list",
          items: [
            "The date at the top is the date these terms last changed.",
            "Before a significant change takes effect, we email everyone with an account.",
            "A change to these terms does not change a signed service agreement already in force.",
          ],
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
    "One cookie, set only when you sign in, and used only to keep you signed in. This site has no trackers, and this page explains the one cookie it does set.",
  reviewState: "draft-published",
  reviewedBy: null,
  reviewedOn: null,
  lastUpdated: "2026-09-03",
  openItems: [
    "A lawyer has not reviewed this text.",
    "If we ever add analytics, it will be off by default, listed in the table below before it runs, and used only if you opt in. That is a commitment on this page, not just a setting somewhere.",
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
              "Holds a signed token for your session, so moving between pages does not sign you out. It contains your user id, your role and an expiry time. It is signed, so it cannot be edited or forged.",
              "Only when you sign in successfully. Never on a marketing page, and never before you sign in.",
              "Until it expires or you sign out",
              "Strictly necessary",
            ],
          ],
        },
        {
          kind: "list",
          intro: "Its technical details, which are the part that matters:",
          items: [
            "httpOnly: no JavaScript on the page can read it, which makes it hard to steal.",
            "Signed: a changed cookie is rejected, not trusted. Our tests deliberately try to forge, edit and expire one.",
            "SameSite protected: another site cannot use it to act as you.",
            "Secure in production: it is never sent over an unencrypted connection.",
            "It holds no document, no transcript and no contact detail. It identifies a session, and nothing more.",
          ],
        },
      ],
    },
    {
      id: "no-banner",
      heading: "Why there is no cookie banner",
      blocks: [
        {
          kind: "list",
          items: [
            "A cookie banner is there to ask your consent for cookies that are not strictly necessary. We do not set any.",
            "This site has no analytics, no advertising pixel, no session recording, no heatmap, no A/B testing tool and no social embed.",
            "A banner asking you to accept cookies we do not set would be for show. It would also train you to click accept on the sites where it does matter.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "You can still refuse the one cookie we set",
          body: "You can block it in your browser settings. It costs you nothing on the public site: every guide, every tool and every policy page works with all cookies blocked. The only thing you lose is staying signed in to a portal account, which is what the cookie is for.",
        },
      ],
    },
    {
      id: "third-party",
      heading: "Third-party content on this site",
      blocks: [
        {
          kind: "list",
          items: [
            "Two outside services supply images to this site: a public host for flag artwork, and a photo host for the decorative photographs.",
            "Both receive your IP address and browser details, as any server does when your browser asks it for a file.",
            "Neither sets a cookie through this site. Neither receives anything about who you are or what you are applying for.",
            "There are no embedded videos, chat widgets, font trackers or maps. Fonts are served from this site itself.",
          ],
        },
      ],
    },
    {
      id: "storage",
      heading: "Local storage and the tools",
      blocks: [
        {
          kind: "list",
          items: [
            "The calculators keep the numbers you type in the page's memory while you use them. That is how a total updates as you type.",
            "Nothing is written to your device's storage, and nothing is sent to us.",
            "Closing the tab clears all of it.",
            "That is why a calculator here cannot show your last result, and does not ask you to sign in to save one.",
          ],
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
    "When you can get money back, how much, how fast, and what we cannot refund, stated in actual figures rather than a line saying 'fees are non-refundable'.",
  reviewState: "draft-published",
  reviewedBy: null,
  reviewedOn: null,
  lastUpdated: "2026-09-03",
  openItems: [
    "A lawyer has not reviewed this text.",
    "No payment provider is connected yet. So no fee has been collected and no refund has been processed under this policy. The processing times below are commitments, not measured results.",
  ],
  sections: [
    {
      id: "principles",
      heading: "The two principles behind this page",
      blocks: [
        {
          kind: "list",
          items: [
            "You pay for work. If the work has not been done, you get your money back. If it has been done, you keep what we produced, and it is yours to take elsewhere.",
            "Money we have already paid to someone else on your instruction, such as a university deposit, a test fee or a government fee, cannot be refunded by us, because we do not have it. We will tell you which item that is and how much, rather than refusing the whole request.",
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
              "Less than 24 hours before the session, or you do not attend",
              "Nothing. But you may reschedule once at no charge if you tell us before the session starts",
              "Not applicable",
            ],
            [
              "We cancel or reschedule, for any reason",
              "The full fee, or a rescheduled session, whichever you choose",
              "5 working days",
            ],
            [
              "You attend, but the written assessment does not arrive within 24 hours",
              "The full fee, and you keep the assessment when it arrives",
              "5 working days",
            ],
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "You pay for the written assessment, not the meeting",
          body: "A consultation produces a written assessment within 24 hours, with two or three ranked destinations and the risks of each. If it does not arrive on time, you get the fee back, whether or not the meeting was useful. That is what the fee buys.",
        },
      ],
    },
    {
      id: "advisory",
      heading: "The advisory fee",
      blocks: [
        {
          kind: "text",
          body: "The advisory fee covers our work from shortlist to arrival. It is charged in stages, as work is delivered. The table shows what is refundable at each stage.",
        },
        {
          kind: "table",
          caption: "Advisory fee refunds by stage",
          columns: ["Where the engagement is", "What is refundable"],
          rows: [
            [
              "Agreement signed, shortlist not yet delivered",
              "The full fee paid so far, with nothing deducted. No work has been handed over yet.",
            ],
            [
              "Shortlist delivered, no application submitted",
              "Everything except the shortlist stage fee. You keep the shortlist.",
            ],
            [
              "Applications submitted",
              "The stages not yet reached. A submitted application cannot be undone, and application fees paid to universities are theirs, not ours.",
            ],
            [
              "Offer received, visa file not started",
              "The visa, pre-departure and arrival stage fees.",
            ],
            [
              "Visa refused",
              "The pre-departure and arrival stage fees, in full. A refusal is no reason for us to keep money for work that will now not happen.",
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
            "University application fees, deposits and tuition. These are paid to and held by the institution, and can only be refunded under its own policy. We will read that policy with you before you transfer anything.",
            "Government and statutory fees: visa fees, the Immigration Health Surcharge, IRP registration, APS and dMAT fees. The bodies that charge them do not refund them, even after a refusal.",
            "Test fees: IELTS, TOEFL, PTE, TestDaF. The test provider's own cancellation terms apply.",
            "Third-party charges you paid directly: courier, notarisation, translation, medical tests, blocked account handling fees.",
            "Work already delivered. If you have the shortlist, the assessment, the funding plan or the prepared visa file, that stage is done.",
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "One exception, in your favour",
          body: "If our mistake cost you a fee, such as a missed deadline that was ours, a document error we introduced, or a wrong figure we published that you relied on, we refund our fee for that stage. We also cover the third-party cost our mistake caused. This is not a goodwill gesture. It is what being responsible for our own work means.",
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
            "Ask in writing, by email or through your portal. You can start with a phone call, and we will confirm it in writing before acting on it.",
            "Say what you are claiming and why. You do not need to argue it: if it falls inside a window above, quoting the window is enough.",
            "We reply within 3 working days with a decision. If only part is refundable, we give a line by line breakdown of what is and what is not.",
            "Approved refunds are processed within 5 working days to the original payment method. Your bank may add a few days on top, which is outside our control.",
            "If you disagree with the decision, you can use the dispute route in the terms of use. Nothing on this page stops you.",
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
    "We name many official bodies on this site, because these routes cannot be explained without them. We are not any of them, we do not act for any of them, and none of them has endorsed us.",
  reviewState: "draft-published",
  reviewedBy: null,
  reviewedOn: null,
  lastUpdated: "2026-09-03",
  openItems: [
    "A lawyer has not reviewed this text.",
    "If we ever form a commercial partnership with any named body, we will add it to this page with its terms and what we are paid. We will also disclose it on every page where the recommendation appears.",
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
              "The body that verifies Indian academic documents for German university admission, and runs the dMAT",
              "None. We are not an APS agent, we cannot speed up an APS application, and we charge nothing for APS itself. We explain the process and check your documents against its requirements before you submit.",
            ],
            [
              "uni-assist e.V.",
              "The service many German universities use to pre-check international applications",
              "None. We are not a uni-assist partner, and we have no channel into it that you do not have.",
            ],
            [
              "DAAD",
              "The German Academic Exchange Service, which funds scholarships and publishes guidance",
              "None. We are not a DAAD representative. We do not run, influence or get early sight of any DAAD scholarship.",
            ],
            [
              "UKVI, UK Visas and Immigration",
              "The Home Office directorate that decides UK visa applications",
              "None. We are not an immigration adviser regulated by any UK authority. We cannot influence a decision, and we do not offer regulated immigration advice.",
            ],
            [
              "Irish Immigration Service Delivery",
              "The Department of Justice service that decides Irish visa applications",
              "None, on the same terms.",
            ],
            [
              "German missions in India",
              "The embassy and consulates that issue German national visas",
              "None. We cannot get, speed up or reserve a visa appointment. If anyone tells you they can, ask them how.",
            ],
            [
              "Universities named on this site",
              "The institutions that decide admissions",
              "Some pay agents a commission and some do not. The Open Ledger shows which, with the figure. None of them has endorsed us, and being listed here is not a partnership.",
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
      heading: "What we cannot do",
      blocks: [
        {
          kind: "list",
          intro: "Because we are none of the above, there are things we cannot do. We say so plainly, because parts of this industry suggest otherwise:",
          items: [
            "We cannot guarantee admission to any university, or influence an admission decision.",
            "We cannot guarantee a visa, speed up a decision, or get an appointment slot that is not publicly available.",
            "We cannot speed up APS, uni-assist or a language test result.",
            "We cannot secure a scholarship, or improve your standing in a scholarship process.",
            "We cannot change an anabin classification or a credit equivalence.",
            "We cannot make a document say something it does not say. That is our policy as well as a limit.",
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "If a consultancy offers you any of the above, that is the warning sign",
          body: "Nobody in this market can do those things. So an offer to do them is either a lie about the offer or a plan to falsify something. Both end with your application refused. In the second case, it also leaves a permanent mark against your name at the body that catches it.",
        },
      ],
    },
    {
      id: "trademarks",
      heading: "Names and trademarks",
      blocks: [
        {
          kind: "list",
          items: [
            "Every organisation name and trademark on this site belongs to its owner. We use them only to identify and describe.",
            "Using a name here does not claim any association, sponsorship or endorsement, in either direction.",
            "If an organisation would like different wording about it on this site, we would rather hear from them than guess. The contact route is on the privacy policy page.",
          ],
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
