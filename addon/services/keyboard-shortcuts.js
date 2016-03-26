import Ember from 'ember';

export default Ember.Service.extend({

  listeners: Ember.A(),

  currentPriority: Ember.computed('listeners.@each', function() {
    var listeners = this.get('listeners');
    if (listeners.length) {
      var priorities = listeners.map((l) => l.priority);
      return Math.max(...priorities);
    } else {
      return 0;
    }
  }),

  registerListener: function(listener, priority) {
    var listeners = this.get('listeners');
    listeners.pushObject({listener: listener, priority: priority});
    this.set('listeners', listeners);
  },

  unregisterListener: function(listener) {
    var listeners = this.get('listeners');
    listeners = listeners.reject((l) => l.listener === listener);
    this.set('listeners', listeners);
  }

});
