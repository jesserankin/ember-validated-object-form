/* global Mousetrap */

import Ember from 'ember';

export default function(bindEvent, unbindEvent) {

  return Ember.Mixin.create({
    keyboardShortcutsService: Ember.inject.service('keyboard-shortcuts'),
    keyboardShortcutsPriority: 0,

    setupShortcuts: Ember.on(bindEvent, function() {
      var service = this.get('keyboardShortcutsService');
      var priority = this.get('keyboardShortcutsPriority');
      this.keyboardShortcutsBound = false;

      this.keyboardShortcutsRegistered = true;
      service.registerListener(this, priority);
    }),

    teardownShortcuts: Ember.on(unbindEvent, function() {
      if (this.keyboardShortcutsBound) {
        this.unbindShortcuts();
      }
      this.keyboardShortcutsRegistered = false;
      this.get('keyboardShortcutsService').unregisterListener(this);
    }),

    updatePriority: Ember.on('init', Ember.observer('keyboardShortcutsPriority','keyboardShortcutsService.currentPriority', function() {
      var currentPriority = this.get('keyboardShortcutsService.currentPriority');
      var service = this.get('keyboardShortcutsService');
      var priority = this.get('keyboardShortcutsPriority');

      if (this.keyboardShortcutsRegistered) {
        if (currentPriority === priority) {
          if (!this.keyboardShortcutsBound ) {
            this.keyboardShortcutsBound = true;
            this.bindShortcuts();
          }
        } else {
          if (this.keyboardShortcutsBound) {
            this.unbindShortcuts();
          }
        }
      }
    })),

    bindShortcuts: function() {
      var self = this;
      var shortcuts = this.get('keyboardShortcuts');

      if (Ember.typeOf(shortcuts) !== 'object') { return; }

      this.mousetraps = [];

      Object.keys(shortcuts).forEach(function(shortcut) {
        var actionObject   = shortcuts[shortcut];
        var mousetrap      = new Mousetrap(document.body);
        var preventDefault = true;

        function invokeAction(action, eventType) {
          var type = Ember.typeOf(action);

          if (type === 'string') {
            mousetrap.bind(shortcut, function(){
              self.send(action);
              return preventDefault !== true;
            }, eventType);
          }
          else if (type === 'function') {
            mousetrap.bind(shortcut, action.bind(self), eventType);
          }
          else {
            throw new Error('Invalid value for keyboard shortcut: ' + action);
          }
        }

        if (Ember.typeOf(actionObject) === 'object') {
          if (actionObject.global === false) {
            mousetrap = new Mousetrap(document);
          } else if (actionObject.scoped) {
            if (Ember.typeOf(actionObject.scoped) === 'boolean') {
              mousetrap = new Mousetrap(self.get('element'));
            } else if (Ember.typeOf(actionObject.scoped) === 'string') {
              mousetrap = new Mousetrap(document.querySelector(actionObject.scoped));
            }
          } else if (actionObject.targetElement) {
            mousetrap = new Mousetrap(actionObject.targetElement);
          }

          if (actionObject.preventDefault === false) {
            preventDefault = false;
          }

          invokeAction(actionObject.action, actionObject.eventType);
        } else {
          invokeAction(actionObject);
        }

        self.mousetraps.push(mousetrap);

      });
      this.keyboardShortcutsBound = true;
    },

    unbindShortcuts: function() {
      this.mousetraps.forEach(
        (mousetrap) => mousetrap.reset()
      );
      this.keyboardShortcutsBound = false;
    }

  });


}
