export default function EmptyState({title,action}:{title:string; action?:string}){
  return (<div className="text-center py-16 border rounded-xl bg-white"><p className="text-lg font-semibold">{title}</p>{action && <button className="mt-4 bg-gold px-6 py-2 rounded font-semibold">{action}</button>}</div>);
}
