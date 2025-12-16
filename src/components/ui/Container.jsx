// src/components/ui/Container.jsx
export default function Container({ children, className = "" }) {
  return <div className={`max-w-6xl mx-auto ${className}`}>{children}</div>;
}
