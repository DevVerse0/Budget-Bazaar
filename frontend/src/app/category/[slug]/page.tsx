export const runtime = 'edge';
export default function Cat({params}:{params:{slug:string}}){ return (<div className='container-bb py-6'><h1 className='font-bold capitalize'>{params.slug}</h1></div>); }
