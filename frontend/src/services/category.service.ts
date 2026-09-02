import { api } from './api';
export const categoryService = { list: ()=> api.get('/categories').then(r=>r.data) };
