import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PlayerProvider } from "@/lib/player";
import { usePlayer } from "@/lib/player-context";

function Consumer() {
  const player = usePlayer();
  return <button onClick={() => player.setSpeed(1.5)}>{player.speed}</button>;
}

describe("Player context boundary", () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  });
  afterEach(() => { cleanup(); vi.restoreAllMocks(); });

  it("shares the provider with consumers after rerendering", () => {
    const view = render(<PlayerProvider><Consumer /></PlayerProvider>);
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    expect(screen.getByRole("button", { name: "1.5" })).toBeInTheDocument();
    view.rerender(<PlayerProvider><Consumer /></PlayerProvider>);
    expect(screen.getByRole("button", { name: "1.5" })).toBeInTheDocument();
  });

  it("exports only the provider from the refreshable component module", async () => {
    const exports = await import("@/lib/player");
    expect(Object.keys(exports)).toEqual(["PlayerProvider"]);
  });
});