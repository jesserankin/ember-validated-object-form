import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({

  classNames: ['task-button'],
  classNameBindings: ['inline'],

  showStatus: false,
  origText: null,

  didRender() {
    this.updateButtonWidth();
  },

  isRunning: computed('task.{isRunning,label}', function() {
    if (this.get('label')) {
      return this.get('label') === this.get('task.label') && this.get('task.isRunning');
    } else {
      return this.get('task.isRunning');
    }
  }),

  fixButtonWidth: Ember.on('init', function() {
      this.updateButtonWidth();
      this.set('origText', this.get('text'));
  }),

  updateButtonWidth: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      const container = this.$('.task-button-container');
      const content = this.$('.task-button-content');
      if (container && content && content.outerWidth() > 0) {
        container.css('width', content.outerWidth() + 'px');
      }
    });
  },

  setShowStatus: Ember.observer('isRunning', function() {
    if (this.get('isRunning')) {
      this.set('origText', this.$().text());
      Ember.run.later(this, function() {
        if (this.get('isRunning')) {
          this.set('showStatus', true);
          this.updateButtonWidth();
        }
      }, 250);
    } else {
      this.set('showStatus', false);
      this.updateButtonWidth();
      this.set('origText', null);
    }
  })

});
