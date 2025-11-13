export const API_BASE = window.location.origin.includes('vercel.app')
  ? '' // produção: chama via rewrite (/api/...)
  : 'http://localhost:3000'; // desenvolvimento local