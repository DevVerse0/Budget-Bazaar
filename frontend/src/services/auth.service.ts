import { api } from './api';
export const authService = { me: ()=> api.get('/auth/me').then(r=>r.data) };
