import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { scheduleOnce, later } from '@ember/runloop';

export default Component.extend({

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

  init() {
    this._super(...arguments);
    this.updateButtonWidth();
    this.set('origText', this.get('text'));
  },

  updateButtonWidth: function() {
    scheduleOnce('afterRender', this, function() {
      const container = this.$('.task-button-container');
      const content = this.$('.task-button-content');
      if (container && content && content.outerWidth() > 0) {
        container.css('width', content.outerWidth() + 'px');
      }
    });
  },

  setShowStatus: observer('isRunning', function() {
    if (this.get('isRunning')) {
      this.set('origText', this.$().text());
      later(this, function() {
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
