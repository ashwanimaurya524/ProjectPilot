import { Rocket } from "lucide-react"

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
        <Rocket size={22} />
      </div>

      <div>
        <h1 className="text-lg font-bold">
          ProjectPilot
        </h1>

        <p className="text-xs text-slate-400">
          AI Project Manager
        </p>
      </div>
    </div>
  )
}

export default Logo