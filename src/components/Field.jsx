// Reusable controlled input / select / textarea with validation message
export default function Field({ label, error, as = 'input', children, ...props }) {
  const Tag = as
  return (
    <label className="field">
      <span>{label}</span>
      <Tag {...props} className={error ? 'invalid' : ''}>{children}</Tag>
      {error && <small className="err">{error}</small>}
    </label>
  )
}
