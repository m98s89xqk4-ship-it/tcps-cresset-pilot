/** Change these values once for each school deployment; no page edits required. */
export const school = {
  id: process.env.NEXT_PUBLIC_SCHOOL_ID || 'cresset',
  name: process.env.NEXT_PUBLIC_SCHOOL_NAME || 'Cresset Christian Academy',
  program: process.env.NEXT_PUBLIC_PROGRAM_NAME || 'Elite Sports Performance',
};
export const schoolTitle = `${school.name} | TCPS ${school.program}`;
