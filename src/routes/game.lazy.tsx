import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/game')({
  component: Game,
})

function Game() {
  return <div className="p-2">Hello from Game!</div>
}