export default function Card({ children, className = "" }) {
  return <div className={`bg-white dark:bg-slate-800 p-4 rounded-md shadow-sm ${className}`}>{children}</div>;
}
