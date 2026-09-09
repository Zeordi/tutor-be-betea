/** Thin placeholder until Daily.co / LiveKit keys exist. */
export const DailyService = {
  async createRoom(opts: { name: string; properties?: Record<string, unknown> }) {
    return {
      id: opts.name,
      name: opts.name,
      join_url: "https://example.daily.co/" + opts.name,
    };
  },
  async joinRoom(roomId: string) {
    return {
      id: roomId,
      join_url: "https://example.daily.co/" + roomId,
    };
  },
};

export default DailyService;