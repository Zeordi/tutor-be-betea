export const DailyService = {
  createRoom: async (opts: { name: string; properties?: any }) => ({
    id: opts.name,
    join_url: "https://example.daily.co/" + opts.name,
  }),
  joinRoom: async (roomId: string) => ({
    id: roomId,
    join_url: "https://example.daily.co/" + roomId,
  }),
};