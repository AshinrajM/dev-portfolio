import { Layers3, Database, Globe2, Code2 } from 'lucide-react';

export const projectCategories = [
  { id: 'products', label: 'Digital Products' },
  { id: 'websites', label: 'Websites & CMS' },
];

/**
 * Add new project entries here; the editorial exhibition layout
 * automatically groups and alternates rows without structural changes.
 */
export const exhibitionProjects = [
  {
    id: '01',
    name: 'MJK Finance',
    category: 'products',
    tag: 'MULTI-BRANCH MICRO-FINANCE',
    oneLiner:
      'Multi-branch micro-finance platform managing loan approvals, daily collections, and branch performance.',
    role: 'Full-Stack Developer — Django REST Framework, Next.js, PostgreSQL, Nginx & Gunicorn',
    context:
      'Multi-branch micro-finance operations require strict role-based access, multi-stage loan approvals, dynamic installment scheduling, and daily collection tracking with overdue alerts.',
    outcome:
      'Built and deployed a secure VPS-hosted platform with real-time branch manager dashboards, full customer lifecycle management, and reliable security for field agents and administrators.',
    liveUrl: '',
    domain: 'mjk-finance.internal',
    color: '#e9eddf',
    screenshot: '',
  },
  {
    id: '02',
    name: 'Axon Careers LMS',
    category: 'products',
    tag: 'FULL-STACK LMS',
    oneLiner:
      'Full-stack LMS powering free and paid courses, enrollments, and secure video streaming.',
    role: 'Full-Stack Developer — Python, Django, DRF, PostgreSQL, Next.js, DigitalOcean Spaces, FFmpeg & Celery',
    context:
      'Online education platforms require coordinated course management, free and paid enrollment workflows, background media processing, and protected video delivery.',
    outcome:
      'Delivered a structured digital learning platform with REST API integration, FFmpeg/Celery video pipelines on DigitalOcean Spaces, and role-based administration.',
    liveUrl: '',
    domain: 'axon-lms.platform',
    color: '#e6e4ee',
    screenshot: '',
  },
  {
    id: '03',
    name: 'ABE-PTE',
    category: 'products',
    tag: 'ONLINE ASSESSMENT',
    oneLiner:
      'Timed PTE mock-test platform with AI-assisted speaking and writing evaluation.',
    role: 'Product Engineer — React, Next.js & Django REST',
    context:
      'High-stakes mock assessments demand precise timer synchronization and distraction-free response capture.',
    outcome:
      'Built a responsive assessment interface paired with Django REST APIs and AI-assisted speaking and writing scoring.',
    liveUrl: '',
    domain: 'abe-pte.app',
    color: '#f0e4dc',
    screenshot: '',
  },
  {
    id: '04',
    name: 'Aurex Builders',
    category: 'websites',
    tag: 'ARCHITECTURE & CONSTRUCTION',
    oneLiner:
      'Editorial digital presence showcasing residential and commercial developments with custom CMS.',
    role: 'Web & CMS Development',
    context:
      'A property developer needing an authoritative web presence to present ongoing and completed developments clearly.',
    outcome:
      'Launched a fast, structured website with CMS-driven project listings and clear inquiry pathways.',
    liveUrl: 'https://aurexbuilders.com',
    domain: 'aurexbuilders.com',
    color: '#e4e5db',
    screenshot: '/projects/aurexbuilders.jpg',
  },
  {
    id: '05',
    name: 'Urban Group',
    category: 'websites',
    tag: 'FLEXIBLE WORKSPACES',
    oneLiner:
      'Workspace and corporate platform showcasing private offices, coworking, and serviced spaces in Dubai.',
    role: 'Web & CMS Development',
    context:
      'Needed a cohesive digital flagship to present private offices, coworking, virtual offices, and meeting spaces.',
    outcome:
      'Delivered a responsive corporate site balancing visual clarity with effortless workspace discovery and booking.',
    liveUrl: 'https://urbangroup.ae',
    domain: 'urbangroup.ae',
    color: '#e8dfd3',
    screenshot: '/projects/urbangroup.jpg',
  },
  {
    id: '06',
    name: 'AlphaArc',
    category: 'websites',
    tag: 'GLOBAL EDUCATION & CAREERS',
    oneLiner:
      'Study-abroad and global careers platform connecting students with destinations and job opportunities.',
    role: 'Web & CMS Development',
    context:
      'An international education and career consultancy needing a clear platform for study destinations, programs, and placements.',
    outcome:
      'Built a responsive web and CMS platform featuring destination guides, job listings, and student inquiry flows.',
    liveUrl: 'https://alphaarc.in',
    domain: 'alphaarc.in',
    color: '#e1e5de',
    screenshot: '/projects/alphaarc.jpg',
  },
  {
    id: '07',
    name: 'Imperium Health Group',
    category: 'websites',
    tag: 'GLOBAL HEALTHCARE & MEDICAL TOURISM',
    oneLiner:
      'International healthcare and medical tourism platform connecting patients with trusted global hospitals.',
    role: 'Web & CMS Development',
    context:
      'A global medical tourism group operating across Turkey, Canada, USA, UK, and UAE needing a clear patient journey and service discovery experience.',
    outcome:
      'Built a responsive web and CMS platform featuring treatment search, partner hospitals, patient journeys, and direct consultation flows.',
    liveUrl: 'https://www.imperiumhealthgroup.com/',
    domain: 'imperiumhealthgroup.com',
    color: '#e2e7f0',
    screenshot: '/projects/imperium.jpg',
  },
];

export const systems = [
  {
    name: 'Experience',
    number: '01',
    icon: Globe2,
    title: 'The part people feel.',
    copy: 'Clear interfaces, semantic markup, and SEO-friendly websites that are fast, accessible, and built to rank.',
    tech: 'React / Next.js / Technical SEO / JavaScript',
    code: 'interface → interaction → experience',
  },
  {
    name: 'Architecture',
    number: '02',
    icon: Code2,
    title: 'Structure before scale.',
    copy: 'Backend systems and REST APIs built around real product requirements, with clear boundaries and maintainable logic.',
    tech: 'Python / Django / Django REST Framework',
    code: 'request → logic → response',
  },
  {
    name: 'Data',
    number: '03',
    icon: Database,
    title: 'A dependable foundation.',
    copy: 'Intentional data models, background tasks, and integrations that keep the right information moving.',
    tech: 'PostgreSQL / Redis / Celery / REST APIs',
    code: 'model → validate → persist',
  },
  {
    name: 'Delivery',
    number: '04',
    icon: Layers3,
    title: 'Beyond localhost.',
    copy: 'Deployment, cloud storage, and production infrastructure considered as part of the product—not an afterthought.',
    tech: 'Linux / Nginx / Deployment / Cloud storage',
    code: 'build → deploy → maintain',
  },
];
