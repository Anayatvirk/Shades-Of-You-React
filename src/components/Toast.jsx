import { useApp } from '../context/AppContext'

export default function Toast() {
  const { toasts } = useApp()
  return (
    <div className="toasts">
      {toasts.map((t) => <div key={t.id} className="toast">{t.msg}</div>)}
    </div>
  )
}
