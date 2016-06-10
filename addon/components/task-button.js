import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  showStatus: false,

  isRunning: computed('task.{isRunning,label}', function() {
    if (this.get('label')) {
      return this.get('label') === this.get('task.label') && this.get('task.isRunning');
    } else {
      return this.get('task.isRunning');
    }
  }),

  fixButtonWidth: Ember.on('init', function() {
      this.updateButtonWidth();
  }),

  updateButtonWidth: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      const container = this.$('.task-button-container');
      const content = this.$('.task-button-content');
      if (container && content) {
        container.css('width', content.outerWidth() + 'px');
      }
    });
  },

  setShowStatus: Ember.observer('isRunning', function() {
    if (this.get('isRunning')) {
      Ember.run.later(this, function() {
        if (this.get('isRunning')) {
          this.set('showStatus', true);
          this.updateButtonWidth();
        }
      }, 250);
    } else {
      this.set('showStatus', false);
      this.updateButtonWidth();
    }
  })

});
