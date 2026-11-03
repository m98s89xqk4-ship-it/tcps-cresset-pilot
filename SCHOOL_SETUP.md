# Reuse TCPS for another school

Set these three variables in Vercel → Project Settings → Environment Variables, then redeploy:

```env
NEXT_PUBLIC_SCHOOL_ID=your-school
NEXT_PUBLIC_SCHOOL_NAME="Your School Name"
NEXT_PUBLIC_PROGRAM_NAME="Elite Sports Performance"
```

For local use, copy `.env.example` to `.env.local`, edit it, and restart the app. Alternatively edit the defaults in `lib/school.ts`.

The home page, header, browser title and installable-app manifest all use this central setting. No page-by-page replacement is needed. Use a stable unique lowercase school ID: it separates browser records between schools. Keep `cresset` to retain existing Cresset records. Changing the display name alone keeps existing records; changing the ID opens a separate school record namespace. This does not add accounts, cloud syncing or access control. Deploy separate projects for separate schools.

## Open access
All athlete and coach screens are open. No login, password or role gate is present. Anyone using a browser profile can access that profile's records. Access layers can be added later. This package does not change external hosting access policies.
