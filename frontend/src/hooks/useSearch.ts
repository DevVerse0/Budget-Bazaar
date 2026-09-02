'use client'; import { useState } from 'react'; export function useSearch(){ const [q,setQ]=useState(''); return {q,setQ}; }
