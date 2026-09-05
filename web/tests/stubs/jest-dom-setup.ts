import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// This suite does not run with vitest's `globals: true`, so testing-library's
// own auto-cleanup (which only registers itself against a global `afterEach`)
// never fires, and one test's rendered tree leaks into the next.
afterEach(cleanup);
