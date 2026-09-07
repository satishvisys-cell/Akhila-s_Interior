/**
 * Stitch asset URLs — visual source of truth from project 5989527326589229208.
 * Prefer these remote cinematic frames over placeholders.
 */

export const STITCH = {
  home: {
    hero: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdndMMvNJlIamba9aHQWY6tlqHm3fS9vjMMZYnoSD7X8Cv3P2tTZGx4ZJShjzKU4ia0HzjDp8r4dtN2dXdCbrCuoYgQGqqQhkyb6hYghbpQOoE0H2QaM4muK-kBpuQfEdOAOwVkq6oQwTQPVUxr4_SJVU0ak1qbSv67i5Y2vPTv5_v4OviTjjEXzh73eLeZGRWWbnEN9kc-TF64c3qbSPM5xVyKPs8oJ6oE_Mb1TSFkYSsaNShHTNa1HVAk_0NqSCTcC-3kYaOWWI",
    casaHorizon:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAVP8Q5me-8ahsgbhSXMVt38P5XvXmPjuwEJk-yD7IE8KcabPNa-g91hwI0vVjl9a6AkGn67uGWUxi8OR6OTHQMpvFI8r1qgP63J8z54CymvtxSst382WWiNd1PprMWLZ4_WnfEWVqmQezxm7yhdaYRuA_PUr6GfAtQXmCJlUb2ayKDcfdAy4N1M0mPshl_2Faa0MuJ7uLm9Rnu9qrshQet1hawOY42WQpLEfsLIQFwfbXWGUzs0TziBJEly-aERsHpj78TaRjND-w",
    meridian:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAvqkucDqJkqvxuSJ3Sv4pCPbV0Ey5inB0IMhJ4h4Te5gnNDz2AJh-XLye3pFK82jMCZF8dWF9enkStAlSU2UynQ166UNhZ1ezcPzcXvxr-eqGzcwDHzKnBttUIxbV5vEog4KqKNvcsOpYQzw4D4205DbXTB8uJ891tiJBYu7MDtgTsMqjYmd62o7ZegeTHARv654XGdnOoNGD81ngEtm_rwgMtsxTTNszPriAaKgFgrXX4iUEB1mRmI1OdTI50EjjuBb_AKlvOw4Y",
    atelier:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCnXKaz2BE8IuoueITSsRpwhXILPWWHwtlaUd4QtwlMrxGD8Hto4f3d4_ciTsVnpMQ78irRoFpErMYwmQrtOzgjUXrHR-tio9tp8zRKxoS4LOVFZhbVcTul8EAPO-umUzIwTjZiFUjn9PdFP61x8zoQL_2j8q6UvVGGwgVM6oJl8OdYBy38_gUI89V-JlUOJCWdGYhsM18MZjSfuUlf8Z8Pw_KMetM9thwyMbzObXSrK3GwLzuhwDUhXlovYKWnCiYSWKj4_TGdZjI",
  },
  projects: {
    casa: "/media/stitch/projects-00-26345c1d57.jpg",
    meridian: "/media/stitch/projects-01-4d9322b381.jpg",
    atelier: "/media/stitch/projects-02-1716bece64.jpg",
    harbor: "/media/stitch/projects-03-15242378e0.jpg",
    skyline: "/media/stitch/projects-04-40343c9915.jpg",
    glass: "/media/stitch/projects-05-f267666562.jpg",
    courtyard: "/media/stitch/projects-06-9e0a0b6b19.jpg",
    northline: "/media/stitch/projects-07-6eb13c1966.jpg",
  },
  services: [
    "/media/stitch/services-00-1810190caa.jpg",
    "/media/stitch/services-01-621750b16e.jpg",
    "/media/stitch/services-02-8ec53f5047.jpg",
    "/media/stitch/services-03-0514d5b4b0.jpg",
    "/media/stitch/services-04-790e08134c.jpg",
    "/media/stitch/services-05-73fe8d590c.jpg",
    "/media/stitch/services-06-c2c290cca9.jpg",
    "/media/stitch/services-07-9f26c38008.jpg",
  ],
  contact: "/media/stitch/contact-00-d6d5393860.jpg",
} as const;

export const FEATURED_WORK = [
  {
    name: "Casa Horizon",
    tag: "Coastal Modern",
    year: "2023",
    area: "450 sqm",
    href: "/projects/meridian-residence",
    image: STITCH.home.casaHorizon,
    span: "large" as const,
  },
  {
    name: "Meridian Residence",
    tag: "Minimalist Hillside",
    year: "2024",
    area: "620 sqm",
    href: "/projects/meridian-residence",
    image: STITCH.home.meridian,
    span: "vertical" as const,
  },
  {
    name: "Atelier House",
    tag: "Urban Sanctuary",
    year: "2022",
    area: "380 sqm",
    href: "/projects/skyline-villa",
    image: STITCH.home.atelier,
    span: "wide" as const,
  },
] as const;
