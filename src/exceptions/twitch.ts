export class StreamerNotFound extends Error {
  constructor() {
    super('Streamer not found');
    this.name = 'StreamerNotFoundError';
  }
}
