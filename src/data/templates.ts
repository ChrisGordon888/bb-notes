export const templates = {
  blank: "",

  freestyle: `[FREESTYLE]

Ideas:
-
-
-

Punch-ins:
-
-
-
`,

  songStructureV1: `[HOOK]

[VERSE 1]

[HOOK]

[VERSE 2]

[BRIDGE]

[HOOK / OUTRO]
`,

  songStructureV2: `[INTRO]

[VERSE 1]

[PRE-HOOK]

[HOOK]

[VERSE 2]

[PRE-HOOK]

[HOOK]

[OUTRO]
`,

  songStructureV3: `[INTRO]

[HOOK]

[VERSE 1]

[HOOK]

[VERSE 2]

[BRIDGE]

[FINAL HOOK]

[OUTRO]
`,
};

/**
 * Creates a reusable type from the template object keys.
 *
 * Dev tip:
 * keyof typeof templates automatically becomes:
 * "blank" | "freestyle" | "songStructureV1" ...
 *
 * This prevents typos and keeps the app type-safe.
 */
export type TemplateType = keyof typeof templates;