export const documentIntegrity = {
  intro:
    "Document fraud is the fastest way to end a student's chances for good, and most of it starts at agencies. These commitments are not negotiable and cannot be switched off, including for the AI systems inside this platform.",
  commitments: [
    "Every transcript and certificate is verified against the original, or directly with the institution that issued it.",
    "No document is edited, retouched or altered by us, in any way, for any reason.",
    "We never write a bank statement, a source of funds letter or a work experience letter on a student's behalf.",
    "We decline to work with anyone who asks us to falsify or misrepresent a document.",
    "Statements of purpose are written in the student's own voice. We coach and we edit. We do not ghostwrite, and no automated system here may draft one.",
    "We keep a written file on each student for five years.",
    "We report suspected fraudulent documents to the relevant institution.",
  ],
};

export const dataProtection = {
  status: "draft" as const,
  statusNote:
    "This section is an unfinished draft. A lawyer has not reviewed it, and we publish it as a draft rather than as a finished policy. The open items below are real gaps.",
  collected: {
    intro: "We collect these only when a specific application step needs them:",
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
    "We take explicit written consent before collecting any sensitive document. That consent names exactly who the document will be shared with. It is recorded for each document category, timestamped, and can be withdrawn.",
  openItems: [
    {
      title: "Storage, access control and encryption",
      body: "Which storage system we use, who can reach which record, and whether stored documents are encrypted. All of this must be written down as what is actually in place, not what we intend.",
    },
    {
      title: "Written breach protocol",
      body: "Who is told, how quickly, and through which escalation path. None of that is written down yet.",
    },
    {
      title: "Retention period",
      body: "The five year file commitment needs checking against what the DPDP Act actually requires, which may be shorter or longer.",
    },
    {
      title: "Complaints procedure",
      body: "A named contact, a committed response time, an escalation path, and a test run before launch. For now it is only a placeholder.",
    },
  ],
  dpdpItems: [
    "A lawful basis for processing, stated for each data category",
    "Data principal rights: access, correction and erasure, with a way to use each one",
    "A designated grievance officer, named publicly",
    "A cross border transfer check for every non Indian vendor we use",
  ],
};

export const platformSafeguards = {
  intro:
    "The software enforces the same rules, so they do not depend on good intentions. They are permission checks in the code, not instructions in a prompt.",
  items: [
    "No automated system can mark a document verified. Only a named staff member can, and we log their name and the time.",
    "No automated system can draft a source of funds letter, a bank statement, a work experience letter or a statement of purpose.",
    "No automated system can submit an application, contact a student directly, or close a case.",
    "No admission or visa probability is calculated or shown anywhere, for anyone. Risk is shown as a named reason, never as a score.",
    "Every record shows whether a person or a machine set it, so a wrong status can always be traced to who set it.",
    "Development and staging systems run on made-up data. A real passport never leaves production.",
  ],
};
