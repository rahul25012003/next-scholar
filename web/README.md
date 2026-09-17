# Next Scholar — web app

The Next.js application. What the product is, how it is built, and the
decisions a future change should not undo are in the root
[README](../README.md) and [`docs/`](../docs/).

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # vitest
npm run lint
npm run build
npm start            # needs SESSION_SECRET, 32 characters or more
npm run smoke        # against the running build, in a second shell
```

`NEXT_SCHOLAR_DEMO_DATA=true` loads the synthetic cases, for walking the
signed-in surfaces locally. Stop `npm start` before running `npm run build`
again: both use `.next`, and a server left running keeps serving the old
build's manifest.
