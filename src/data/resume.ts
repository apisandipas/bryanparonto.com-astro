export const person = {
  name: "Bryan Paronto",
  role: "Software Developer & Consultant",
  employer: "Atomic Object",
  since: "2023",
  location: "Chicago, IL",
  email: "bparonto@gmail.com",
  github: "https://github.com/apisandipas",
  twitch: "https://twitch.tv/cablecardigital",
  resume: "/bryan-paronto-resume.pdf",
  tagline:
    "I build tools, write about what I’m learning, and tinker with the software and systems that help me do better work.",
  summary:
    "UI-focused full-stack engineer with 15+ years building accessible, fast web products, including a homepage seen by 20 million people a month.",
  site: "https://bryanparonto.com",
};

export interface Job {
  id: string;
  role: string;
  company: string;
  start: string; // YYYY-MM
  end?: string; // YYYY-MM, undefined = present
  also?: string; // extra date range note
  bullets: string[];
  /** Folded by default (DESIGN.md §6.5): roles that ended before 2016. */
  folded?: boolean;
}

export const jobs: Job[] = [
  {
    id: "atomic-object",
    role: "Software Developer & Consultant",
    company: "Atomic Object",
    start: "2023",
    // DRAFT: Bryan to edit. Client work is confidential; keep it generic.
    bullets: [
      "Design and build custom web software for Atomic's clients, from early discovery through launch and ongoing support.",
      "Work in small, self-managed teams alongside designers and delivery leads, owning features across the front end and API.",
      "Client names are confidential. Happy to talk about the work itself.",
    ],
  },
  {
    id: "kind-systems",
    role: "Consultant & Sr. Front-End Engineer",
    company: "Kind Systems",
    start: "2022-08",
    end: "2023",
    bullets: [
      "Embedded on the VA.gov Public Websites team at the Department of Veterans Affairs.",
      "Rebuilt the VA.gov homepage, which sees 20 million unique visitors a month.",
      "Helped resolve thousands of accessibility infractions across the public site.",
    ],
  },
  {
    id: "cable-car",
    role: "Principal Consultant & Owner",
    company: "Cable Car Digital, LLC",
    start: "2020-11",
    end: "2022-08",
    bullets: [
      "Architected and led development of web projects built with React and Express.",
      "Built a reusable, multi-brand React component library for a top appliance maker (JennAir).",
      "Helped small startups launch products, including an automated cleaning-service scheduling app.",
    ],
  },
  {
    id: "caxy",
    role: "Sr. JavaScript Developer",
    company: "Caxy Interactive",
    start: "2019-04",
    end: "2022-04",
    also: "2019-04 – 2020-10, 2021-10 – 2022-04",
    bullets: [
      "Helped lead JavaScript applications built with React, Redux, Apollo Client, Node.js and Gatsby.",
      "Designed REST and GraphQL APIs with Express and Apollo Server.",
      "Shipped an e-commerce app (Alpine Home Air), an LMS, investor and client-screening portals, and responsive email templates.",
    ],
  },
  {
    id: "groundspark",
    role: "Lead Front-End Engineer",
    company: "GroundSpark",
    start: "2018-02",
    end: "2018-11",
    bullets: [
      "Owned new front-end features on a large Rails + Backbone/Marionette app for a social-media SaaS startup.",
      "Planned the roadmap for an incremental move to React, and led the front end of a new social analytics dashboard.",
    ],
  },
  {
    id: "the-program",
    role: "Front-End Engineer",
    company: "The PROGRAM",
    start: "2016-08",
    end: "2017-10",
    bullets: [
      "Built internal tools, including a retail-associate training portal, for high-profile athletic-apparel clients with Craft CMS, WordPress and React/Redux.",
      "Consulted on technical choices and feature planning.",
    ],
  },
  {
    id: "doejo",
    role: "Web Developer",
    company: "Doejo",
    start: "2013-02",
    end: "2016-01",
    folded: true,
    bullets: [
      "Full-stack developer in a fast-paced agency and startup studio: WordPress, Rails, Express and Angular SPAs.",
      "Led the React rebuild of Zap2It's TV listings grid for Tribune Media.",
      "Advised sales on technical recommendations for proposals.",
    ],
  },
  {
    id: "freelance",
    role: "Freelance Web Developer",
    company: "Self-employed",
    start: "2012-03",
    end: "2013-02",
    folded: true,
    bullets: ["Built sites and apps for small businesses, agencies and startups with WordPress, Rails and Sinatra."],
  },
  {
    id: "homes-com",
    role: "Web Designer",
    company: "Homes.com",
    start: "2010-01",
    end: "2012-03",
    folded: true,
    bullets: [
      "Built personalized templates for real-estate agents, and set the department's coding standard.",
      "Ran departmental training in HTML5, CSS3 and JavaScript/jQuery.",
    ],
  },
];

export const years = (j: Job) => {
  const from = j.start.slice(0, 4);
  const to = j.end ? j.end.slice(0, 4) : "now";
  return from === to ? from : `${from}–${to}`;
};

// Essentials only: one row per area, rendered as an org table.
export const skills: [string, string][] = [
  ["Languages", "TypeScript, JavaScript, SQL, HTML & CSS"],
  ["Front end", "React, TanStack, Tailwind CSS, Astro, Next.js"],
  ["Back end", "Node.js, Bun, Hono, TanStack Start, REST & GraphQL APIs"],
  ["Data", "PostgreSQL, Drizzle ORM, SQLite, Redis"],
  ["AI", "Claude API, tool use & structured output, Claude Code"],
  ["Practice", "Accessibility (WCAG), design systems, leading small teams, scoping & estimation"],
];

// DRAFT: Bryan to edit.
export const now = {
  heading: "Building client software at Atomic Object",
  items: [
    { done: true, text: "Three years of consulting on custom web software (clients confidential)" },
    { done: true, text: "Living in Emacs and org-mode, on Linux, for nearly everything" },
    { done: false, text: "Writing again: Emacs, Linux and front-end craft" },
  ],
};
