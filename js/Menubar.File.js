Menubar.File = function(editor) 
{
  var container = new UI.Panel();
  container.setClass('menu');

  var title = new UI.Panel();
  title.setClass('title');
  title.setTextContent('文件');
  container.add(title);

  var options = new UI.Panel();
  options.setClass('options');
  container.add(options);

  // New

  var option = new UI.Row();
  option.setClass('option');
  option.setTextContent('新建');
  option.onClick(function() 
  {
    //if (confirm('Any unsaved data will be lost. Are you sure?'))
    if (confirm('当前场景没有保存, 如果继续会丢失当前场景!'))
      editor.clear();
  });
  options.add(option);

  //

  options.add(new UI.HorizontalRule());

  // Import

  var fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.addEventListener('change', function(event) 
  {
    editor.loader.loadFile(fileInput.files[0]);
  });

  var option = new UI.Row();
  option.setClass('option');
  option.setTextContent('导入');
  option.onClick(function() 
  {
    fileInput.click();
  });
  options.add(option);

  //

  options.add(new UI.HorizontalRule());

  // Export Geometry

  var option = new UI.Row();
  option.setClass('option');
  option.setTextContent('导出几何体');
  option.onClick(function() 
  {
    var object = editor.selected;
    if (object === null) 
    {
      // alert('No object selected.');
      alert('没有任何选中对象');
      return;
    }

    var geometry = object.geometry;

    if (geometry === undefined) 
    {
      // alert('The selected object doesn\'t have geometry.');
      alert('当前对象不是或不包含几何体');
      return;
    }

    var output = geometry.toJSON();

    try 
    {
      output = JSON.stringify(output, null, '\t');
      output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
    } 
    catch (e) 
    {
      output = JSON.stringify(output);
    }

    saveString(output, 'geometry.json');
  });
  options.add(option);

  // Export Object

  var option = new UI.Row();
  option.setClass('option');
  option.setTextContent('导出对象');
  option.onClick(function() 
  {
    var object = editor.selected;

    if (object === null) 
    {
      // alert('No object selected');
      alert('没有选中对象')
      return;
    }

    var output = object.toJSON();

    try 
    {
      output = JSON.stringify(output, null, '\t');
      output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
    } 
    catch (e) 
    {
      output = JSON.stringify(output);
    }

    saveString(output, 'model.json');
  });
  options.add(option);

  // Export Scene

  var option = new UI.Row();
  option.setClass('option');
  option.setTextContent('导出场景');
  option.onClick(function() 
  {
    var output = editor.scene.toJSON();
    try 
    {
      output = JSON.stringify(output, null, '\t');
      output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
    } 
    catch (e) 
    {
      output = JSON.stringify(output);
    }

    saveString(output, 'scene.json');
  });
  options.add(option);

  // Export OBJ

  var option = new UI.Row();
  option.setClass('option');
  option.setTextContent('导出 OBJ');
  option.onClick(function() 
  {
    var object = editor.selected;

    if (object === null) 
    {
      alert('没有选中对象');
      return;
    }

    var exporter = new THREE.OBJExporter();

    saveString(exporter.parse(object), 'model.obj');
  });
  options.add(option);

  // Export STL

  var option = new UI.Row();
  option.setClass('option');
  option.setTextContent('导出 STL');
  option.onClick(function() 
  {
    var exporter = new THREE.STLExporter();
    saveString(exporter.parse(editor.scene), 'model.stl');
  });
  options.add(option);

  //

  options.add(new UI.HorizontalRule());

  // Publish

  var option = new UI.Row();
  option.setClass('option');
  option.setTextContent('发布');
  option.onClick(function() 
  {
    var zip = new JSZip();

    //

    var output = editor.toJSON();
    output.metadata.type = 'App';
    delete output.history;

    var vr = output.project.vr;

    output = JSON.stringify(output, null, '\t');
    output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

    zip.file('app.json', output);

    //

    var manager = new THREE.LoadingManager(function() 
    {
      save(zip.generate({ type: 'blob' }), 'download.zip');
    });

    var loader = new THREE.XHRLoader(manager);
    loader.load('js/libs/app/index.html', function(content) 
    {
      var includes = [];
      if (vr) 
      {
        includes.push('<script src="js/VRControls.js"></script>');
        includes.push('<script src="js/VREffect.js"></script>');
        includes.push('<script src="js/WebVR.js"></script>');
      }

      content = content.replace('<!-- includes -->', includes.join('\n\t\t'));
      zip.file('index.html', content);
    });
    loader.load('js/libs/app.js', function(content) 
    {
      zip.file('js/app.js', content);
    });
    loader.load('../build/three.min.js', function(content) 
    {
      zip.file('js/three.min.js', content);
    });

    if (vr) 
    {
      loader.load('../examples/js/controls/VRControls.js', function(content) 
      {
        zip.file('js/VRControls.js', content);
      });

      loader.load('../examples/js/effects/VREffect.js', function(content) 
      {
        zip.file('js/VREffect.js', content);
      });

      loader.load('../examples/js/WebVR.js', function(content) 
      {
        zip.file('js/WebVR.js', content);
      });
    }
  });
  options.add(option);

  /*
  // Publish (Dropbox)

  var option = new UI.Row();
  option.setClass( 'option' );
  option.setTextContent( 'Publish (Dropbox)' );
  option.onClick( function () {

  	var parameters = {
  		files: [
  			{ 'url': 'data:text/plain;base64,' + window.btoa( "Hello, World" ), 'filename': 'app/test.txt' }
  		]
  	};

  	Dropbox.save( parameters );

  } );
  options.add( option );
  */


  //

  var link = document.createElement('a');
  link.style.display = 'none';
  document.body.appendChild(link); // Firefox workaround, see #6594

  function save(blob, filename) 
  {

    link.href = URL.createObjectURL(blob);
    link.download = filename || 'data.json';
    link.click();

    // URL.revokeObjectURL( url ); breaks Firefox...

  }

  function saveString(text, filename) 
  {
    save(new Blob([text], { type: 'text/plain' }), filename);
  }

  return container;
};
