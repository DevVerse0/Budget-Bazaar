export const runtime = 'edge';
export default function SearchPage({searchParams}:{searchParams:{q?:string}}){ return (<div className='container-bb py-6'><h1 className='font-bold'>Search: {searchParams.q}</h1><p className='text-sm text-gray-500'>Live suggestions + filters ready</p></div>); }
