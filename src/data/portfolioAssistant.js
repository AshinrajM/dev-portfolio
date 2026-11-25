import { exhibitionProjects, systems } from '@/data/portfolio';

export const starterQuestions = [
  "What is Ashin's tech stack?",
  'Tell me about MJK Finance',
  'Does Ashin build SEO-friendly websites?',
  'How can I contact Ashin?',
];

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasAny(text, keywords) {
  return keywords.some((kw) => text.includes(kw));
}

function formatProjectReply(project) {
  const links = project.liveUrl
    ? [{ label: `Visit ${project.domain}`, href: project.liveUrl, external: true }]
    : [];

  return {
    text: `${project.name} (${project.tag})\n\nRole: ${project.role}\n\nContext: ${project.context}\n\nOutcome: ${project.outcome}`,
    links,
    suggestions: ['Show all client projects', "What is Ashin's tech stack?"],
  };
}

export function answerPortfolioQuestion(rawQuery) {
  const q = normalize(rawQuery);
  if (!q) {
    return {
      text: 'Ask me anything about Ashin’s projects, tech stack, experience, or how to get in touch.',
      suggestions: starterQuestions,
    };
  }

  // 1. Greetings
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(q)) {
    return {
      text: 'Hi! I can answer questions about Ashin Raj M.’s client projects, full-stack experience, SEO-friendly websites, and contact details.',
      suggestions: starterQuestions,
    };
  }

  // 2. Direct project matching (automatically works for any project in portfolio.js)
  const projectAliases = {
    '01': ['mjk', 'micro finance', 'microfinance', 'loan'],
    '02': ['axon', 'lms', 'learning management', 'ffmpeg', 'digitalocean'],
    '03': ['abe', 'pte', 'assessment', 'mock test'],
    '04': ['aurex', 'builders'],
    '05': ['urban', 'dubai', 'workspace', 'coworking'],
    '06': ['alphaarc', 'alpha arc', 'study abroad'],
    '07': ['imperium', 'health', 'medical tourism'],
  };

  for (const project of exhibitionProjects) {
    const nameMatch = q.includes(normalize(project.name));
    const domainMatch = project.domain && q.includes(normalize(project.domain.split('.')[0]));
    const aliases = projectAliases[project.id] || [];
    const aliasMatch = hasAny(q, aliases);

    if (nameMatch || domainMatch || aliasMatch) {
      return formatProjectReply(project);
    }
  }

  // 3. Contact / Hire / Availability
  if (
    hasAny(q, [
      'contact',
      'email',
      'mail',
      'reach',
      'hire',
      'available',
      'availability',
      'linkedin',
      'talk',
      'connect',
    ])
  ) {
    return {
      text: 'Ashin is available for the right full-stack or web development opportunity.\n\nEmail: ashinrajeevan319@gmail.com\nLinkedIn: linkedin.com/in/ashin-raj-m-9201251ba',
      links: [
        {
          label: 'Email Ashin',
          href: 'mailto:ashinrajeevan319@gmail.com?subject=Let%E2%80%99s%20build%20something',
          external: true,
        },
        {
          label: 'LinkedIn Profile',
          href: 'https://www.linkedin.com/in/ashin-raj-m-9201251ba/',
          external: true,
        },
      ],
      suggestions: ['Tell me about MJK Finance', "What is Ashin's experience?"],
    };
  }

  // 4. SEO & Websites
  if (hasAny(q, ['seo', 'search engine', 'ranking', 'cms', 'website', 'websites'])) {
    const websiteNames = exhibitionProjects
      .filter((p) => p.category === 'websites')
      .map((p) => `${p.name} (${p.domain})`)
      .join(', ');

    return {
      text: `Yes — Ashin builds SEO-friendly websites with semantic markup, clean metadata, and Core Web Vitals performance optimization.\n\nClient Websites & CMS: ${websiteNames}.`,
      links: [{ label: 'Explore Work', href: '#work' }],
      suggestions: ['Tell me about Aurex Builders', 'Tell me about Imperium Health Group'],
    };
  }

  // 5. Tech Stack / Skills
  if (
    hasAny(q, [
      'stack',
      'tech',
      'skill',
      'python',
      'django',
      'react',
      'next',
      'postgres',
      'postgresql',
      'redis',
      'celery',
      'nginx',
      'gunicorn',
      'linux',
      'api',
      'backend',
      'frontend',
    ])
  ) {
    const stackSummary = systems.map((s) => `• ${s.name}: ${s.tech}`).join('\n');
    return {
      text: `Ashin works across the full stack:\n\n${stackSummary}\n\nDeployment & Media: Linux, Nginx, Gunicorn, DigitalOcean Spaces, FFmpeg.`,
      suggestions: ['Tell me about Axon Careers LMS', 'Tell me about MJK Finance'],
    };
  }

  // 6. Projects overview
  if (hasAny(q, ['project', 'projects', 'work', 'portfolio', 'built', 'product', 'products'])) {
    const products = exhibitionProjects
      .filter((p) => p.category === 'products')
      .map((p) => p.name)
      .join(', ');
    const websites = exhibitionProjects
      .filter((p) => p.category === 'websites')
      .map((p) => p.name)
      .join(', ');

    return {
      text: `Ashin’s client work spans two areas:\n\n• Digital Products: ${products}\n• Websites & CMS: ${websites}\n\nAsk about any project by name for its role, context, and outcome.`,
      links: [{ label: 'View Selected Work', href: '#work' }],
      suggestions: ['Tell me about MJK Finance', 'Tell me about Axon Careers LMS'],
    };
  }

  // 7. Experience / About
  if (hasAny(q, ['experience', 'about', 'who', 'background', 'years', '2024', 'ashin', 'role'])) {
    return {
      text: 'Ashin Raj M. is a Full-Stack Developer with professional and freelance experience since Jan 2024.\n\nHe builds scalable web applications, SEO-friendly websites, and business-focused digital products—connecting Python, Django, DRF, and PostgreSQL with React and Next.js through production deployment on Linux, Nginx, and Gunicorn.',
      links: [{ label: 'Read About Section', href: '#about' }],
      suggestions: ["What is Ashin's tech stack?", 'How can I contact Ashin?'],
    };
  }

  // 8. Keyword overlap fallback across projects & systems
  const tokens = q.split(' ').filter((w) => w.length > 2);
  let bestProject = null;
  let bestScore = 0;

  for (const project of exhibitionProjects) {
    const haystack = normalize(
      `${project.name} ${project.tag} ${project.oneLiner} ${project.role} ${project.context} ${project.outcome}`
    );
    const score = tokens.reduce((acc, tok) => acc + (haystack.includes(tok) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestProject = project;
    }
  }

  if (bestProject && bestScore > 0) {
    return formatProjectReply(bestProject);
  }

  return {
    text: 'I can help with questions about Ashin’s client projects (MJK Finance, Axon Careers LMS, ABE-PTE, Aurex Builders, Urban Group, AlphaArc, Imperium Health Group), his tech stack, SEO-friendly websites, or how to reach him.',
    links: [
      {
        label: 'Email ashinrajeevan319@gmail.com',
        href: 'mailto:ashinrajeevan319@gmail.com',
        external: true,
      },
    ],
    suggestions: starterQuestions,
  };
}
