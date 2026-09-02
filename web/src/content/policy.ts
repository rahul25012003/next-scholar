export const documentIntegrity = {
  intro:
    "Document fraud is the fastest way to end a student's chances permanently, and agencies are where most of it originates. These commitments are not negotiable and not configurable, including for the AI systems that run inside this platform.",
  commitments: [
    "Every transcript and certificate is verified against the original document or directly with the issuing institution.",
    "No document is edited, retouched or altered by us, in any way, for any reason.",
    "We never write a bank statement, a source of funds letter or a work experience letter on a student's behalf.",
    "We decline to work with anyone who asks us to falsify or misrepresent a document.",
    "Statements of purpose are written in the student's own voice. We coach and we edit. We do not ghostwrite, and no automated system here is permitted to draft one.",
    "A written file is maintained for each student for five years.",
    "Suspected fraudulent documents are reported to the relevant institution.",
  ],
};

export const dataProtection = {
  status: "draft" as const,
  statusNote:
    "This section is an unfinished draft. It has not been reviewed by a lawyer, and it is published in that state rather than dressed up as a finished policy. The open items below are real gaps, listed as gaps.",
  collected: {
    intro: "Collected only where a specific application step requires it:",
    items: [
      "Academic transcripts and certificates",
      "Passport copies",
      "English test scores",
      "Bank statements and funding evidence",
      "Letters of recommendation",
      "Photographs for application forms",
    ],
  },
  consent:
    "Explicit written consent is taken before any sensitive document is collected, and that consent names exactly who the document will be shared with. Consent is recorded per document category, timestamped, and can be withdrawn.",
  openItems: [
    {
      title: "Storage, access control and encryption",
      body: "The specific storage system, who can reach which record, and the encryption status of documents at rest all need to be documented as implemented fact rather than intent.",
    },
    {
      title: "Written breach protocol",
      body: "Who is notified, within what timeframe, through which escalation path. None of that is written down yet.",
    },
    {
      title: "Retention period",
      body: "The five year written file commitment needs cross checking against what the DPDP Act actually requires, which may be shorter or longer.",
    },
    {
      title: "Complaints procedure",
      body: "A named contact, a response time commitment, an escalation path, and a test run before launch. Currently a structural placeholder.",
    },
  ],
  dpdpItems: [
    "Lawful basis for processing, stated per data category",
    "Data principal rights: access, correction and erasure, with a route to exercise each",
    "A designated grievance officer, named publicly",
    "A cross border transfer check for every non Indian vendor in the stack",
  ],
};

export const platformSafeguards = {
  intro:
    "The same rules are enforced in the software, not left to good intentions. These are permission checks in code, not instructions in a prompt.",
  items: [
    "No automated system can mark a document verified. Only a named staff member can, and the action is logged with their name and the timestamp.",
    "No automated system can draft a source of funds letter, a bank statement, a work experience letter or a statement of purpose.",
    "No automated system can submit an application, contact a student directly, or close a case.",
    "No admission or visa probability is calculated or displayed anywhere, for anyone. Risk is shown as a named reason, never as a score.",
    "Every record carries whether a human or a machine set it, so a wrong status always has a traceable author.",
    "Development and staging environments run on synthetic data. A real passport never leaves production.",
  ],
};
