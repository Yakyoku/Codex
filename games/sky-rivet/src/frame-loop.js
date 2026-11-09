// One owner for both window and XR animation frames. Old callbacks are harmless
// even if a browser dispatches a cancelled frame after a session transition.
export class FrameLoop {
  constructor(callback) {
    this.callback = callback;
    this.source = null;
    this.pending = null;
    this.epoch = 0;
  }

  start(source) {
    if (this.source === source) return;
    this.stop();
    this.source = source;
    this.schedule(this.epoch);
  }

  stop() {
    const source = this.source, pending = this.pending;
    this.epoch++;
    this.source = null;
    this.pending = null;
    if (source && pending !== null) {
      try { source.cancelAnimationFrame(pending); }
      catch (error) { if (error.name !== 'InvalidStateError') throw error; }
    }
  }

  schedule(epoch) {
    const source = this.source;
    if (!source || epoch !== this.epoch) return;
    this.pending = source.requestAnimationFrame((time, frame) => {
      if (epoch !== this.epoch || source !== this.source) return;
      this.pending = null;
      try {
        this.callback(time, frame);
      } catch (error) {
        this.stop();
        throw error;
      }
      if (epoch === this.epoch && source === this.source) this.schedule(epoch);
    });
  }
}
