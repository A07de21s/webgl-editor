Menubar.Help = function(editor) 
{
  var container = new UI.Panel();
  container.setClass('menu');

  var title = new UI.Panel();
  title.setClass('title');
  title.setTextContent('帮助');
  container.add(title);

  var options = new UI.Panel();
  options.setClass('options');
  container.add(options);
/*
  // Source code

  var option = new UI.Row();
  option.setClass('option');
  option.setTextContent('Source code');
  option.onClick(function() 
  {
    window.open('https://github.com/mrdoob/three.js/tree/master/editor', '_blank')
  });
  options.add(option);
*/
  // About

  var option = new UI.Row();
  option.setClass('option');
  option.setTextContent('关于');
  option.onClick(function() 
  {
    window.open('http://www.ddtech.com.cn/', '_blank');
  });
  options.add(option);

  return container;
};
