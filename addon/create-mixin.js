/* global Mousetrap */

import Ember from 'ember';

export default function(bindEvent, unbindEvent) {

  return Ember.Mixin.create({
    keyboardShortcutsService: Ember.inject.service('keyboard-shortcuts'),
    keyboardShortcutsPriority: 0,
    mousetraps:[],

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
      var shortcuts = this.get('keyboardShortcuts');
      var self = this;
      if (Ember.typeOf(shortcuts) !== 'object') { return; }

      this.mousetraps = [];

      Object.keys(shortcuts).forEach(function(shortcut) {
        const actionObject   = shortcuts[shortcut];
        let mousetrap;
        let preventDefault = true;

        function invokeAction(action, eventType) {
          var type = Ember.typeOf(action);
          var callback;
          if (type === 'string') {
            callback = function(){
              self.send(action);
              return preventDefault !== true;
            }
          }
          else if (type === 'function') {
            callback = action.bind(self)
          }
          else {
            throw new Error('Invalid value for keyboard shortcut: ' + action);
          }
          mousetrap.bind(shortcut, callback, eventType);
        }

        if (Ember.typeOf(actionObject) === 'object') {
          if (actionObject.global === false) {
            mousetrap = new Mousetrap(document);
          } else if (actionObject.scoped) {
            if (Ember.typeOf(actionObject.scoped) === 'boolean') {
              mousetrap = new Mousetrap(this.get('element'));
            } else if (Ember.typeOf(actionObject.scoped) === 'string') {
              mousetrap = new Mousetrap(document.querySelector(actionObject.scoped));
            }
          } else if (actionObject.targetElement) {
            mousetrap = new Mousetrap(actionObject.targetElement);
          } else {
            mousetrap = new Mousetrap(document.body);
          }

          if (actionObject.preventDefault === false) {
            preventDefault = false;
          }

          invokeAction(actionObject.action, actionObject.eventType);
        } else {
          mousetrap = new Mousetrap(document.body);
          invokeAction(actionObject);
        }
        self.mousetraps.push(mousetrap);
      });

      this.keyboardShortcutsBound = true;
    },

    unbindShortcuts: function() {
      const _removeEvent = (object, type, callback) => {
        if (object.removeEventListener) {
          object.removeEventListener(type, callback, false);
          return;
        }
        object.detachEvent('on' + type, callback);
      }
      this.mousetraps.forEach(
        (mousetrap) => {
          // manually unbind JS event
          _removeEvent(mousetrap.target, 'keypress', mousetrap._handleKeyEvent);
          _removeEvent(mousetrap.target, 'keydown', mousetrap._handleKeyEvent);
          _removeEvent(mousetrap.target, 'keyup', mousetrap._handleKeyEvent);
          mousetrap.reset()
        }
      );
      this.mousetraps = []
      this.keyboardShortcutsBound = false;
    }

  });


}
