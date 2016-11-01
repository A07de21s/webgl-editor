Sidebar.History = function(editor) 
{
  var signals = editor.signals;
  var config = editor.config;
  var history = editor.history;
  var container = new UI.Panel();
  container.add(new UI.Text('历史记录'));

  //

  var persistent = new UI.THREE.Boolean(config.getKey('settings/history'), 
                                        '保留操作记录');
  persistent.setPosition('absolute').setRight('8px');
  persistent.onChange(function() 
  {
    var value = this.getValue();

    config.setKey('settings/history', value);

    if (value) 
    {
      alert('在 session 中保留操作记录.\n 这可能会影响纹理渲染时的性能.');

      var lastUndoCmd = history.undos[history.undos.length - 1];
      var lastUndoId = (lastUndoCmd !== undefined) ? lastUndoCmd.id : 0;
      editor.history.enableSerialization(lastUndoId);
    } 
    else 
    {
      signals.historyChanged.dispatch();
    }
  });
  container.add(persistent);

  container.add(new UI.Break(), new UI.Break());

  var ignoreObjectSelectedSignal = false;

  var outliner = new UI.Outliner(editor);
  outliner.onChange(function() 
  {
    ignoreObjectSelectedSignal = true;
    editor.history.goToState(parseInt(outliner.getValue()));
    ignoreObjectSelectedSignal = false;
  });
  container.add(outliner);

  //

  var refreshUI = function() 
  {
    var options = [];
    var enumerator = 1;

    function buildOption(object) 
    {
      var option = document.createElement('div');
      option.value = object.id;
      return option;
    }

    (function addObjects(objects) 
     {
      for (var i = 0, l = objects.length; i < l; i++) 
      {
        var object = objects[i];
        var option = buildOption(object);
        option.innerHTML = '&nbsp;' + object.name;
        options.push(option);
      }
    })(history.undos);


    (function addObjects(objects, pad) 
     {
      for (var i = objects.length - 1; i >= 0; i--) 
      {
        var object = objects[i];
        var option = buildOption(object);
        option.innerHTML = '&nbsp;' + object.name;
        option.style.opacity = 0.3;
        options.push(option);
      }
    })(history.redos, '&nbsp;');
    outliner.setOptions(options);
  };

  refreshUI();

  // events

  signals.editorCleared.add(refreshUI);

  signals.historyChanged.add(refreshUI);
  signals.historyChanged.add(function(cmd) 
  {
    outliner.setValue(cmd !== undefined ? cmd.id : null);
  });

  return container;
};
