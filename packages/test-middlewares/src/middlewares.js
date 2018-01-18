module.exports = {
  in: [
    async (context, next, done) => {
      const muted = await context.brain.userGet(context.userMessage.user, '_isMuted');
      if (muted) {
        done();
      } else {
        next(done);
      }
    },
  ],
};
