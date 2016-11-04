# WebGL Editor

## 基本核心函数

`init()`

该函数用于初始化引擎, 在函数中主要初始化的东西有

* 向前端页面添加 `<div>` 以承载 webgl

	```
	container = document.createElement('div');
	document.body.appendChild(container);
	```

* 初始化场景

  ```
  scene = new THREE.Scene();
  ```

* 初始化相机

  	```
  	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  	camera.position.set(500, 800, 1300);
  	camera.lookAt(new THREE.Vector3());
  	
  	```
                                                                                                                                                                  
* 初始化光照

  ```
  var ambientLight = new THREE.AmbientLight(0x606060);
  var ambientLight = new THREE.AmbientLight(0x606060);
  scene.add(ambientLight);
  
  ```
  
  >我们向场景中添加任何元素或者对象 需要使用 `scene.add();` 

`Render()`

该函数作用渲染场景, 当每次对场景进行编辑或修改后 都需调用改函数

## 核心操作对象
在 `webgl-editor` 中我们使用 `object` 来维护场景中的 3D 对象的所有属性和扩展数据, 通常使用以下语句获取场景被选中的对象

```
var object = editor.selected;
```

## 重要文件说明
* `Sidebar.Object.js`

该文件描述 `Object` 维护类, 该类主要用于维护场景中选中对象的属性,包括有对象类型, id, 名称, 扩展数据等等, 在类中提供 `update()` 函数以维护具体的对象属性, 函数详情

```
  function update() 
  {
    var object = editor.selected;
    if (object !== null) 
    {
      var newPosition = new THREE.Vector3(objectPositionX.getValue(), 
                                          objectPositionY.getValue(), 
                                          objectPositionZ.getValue());
                                          
      if (object.position.distanceTo(newPosition) >= 0.01)
        editor.execute(new SetPositionCommand(object, newPosition));

      var newRotation = new THREE.Euler(
          objectRotationX.getValue() * THREE.Math.DEG2RAD,
          objectRotationY.getValue() * THREE.Math.DEG2RAD, 
          objectRotationZ.getValue() * THREE.Math.DEG2RAD);
          
      if (object.rotation.toVector3().distanceTo(newRotation.toVector3()) >= 0.01)
        editor.execute(new SetRotationCommand(object, newRotation));

      var newScale = new THREE.Vector3(objectScaleX.getValue(), 
                                       objectScaleY.getValue(), 
                                       objectScaleZ.getValue());
      if (object.scale.distanceTo(newScale) >= 0.01)
        editor.execute(new SetScaleCommand(object, newScale));

      if (object.fov !== undefined && 
          Math.abs(object.fov - objectFov.getValue()) >= 0.01) 
      {
        editor.execute(new SetValueCommand(object, 'fov', objectFov.getValue()));
        object.updateProjectionMatrix();
      }

      if (object.near !== undefined && 
          Math.abs(object.near - objectNear.getValue()) >= 0.01) 
      {
        editor.execute(new SetValueCommand(object, 'near', objectNear.getValue()));
      }

      if (object.far !== undefined && 
          Math.abs(object.far - objectFar.getValue()) >= 0.01) 
      {
        editor.execute(new SetValueCommand(object, 'far', objectFar.getValue()));
      }

      if (object.intensity !== undefined && 
          Math.abs(object.intensity - objectIntensity.getValue()) >= 0.01) 
      {
        editor.execute(new SetValueCommand(object, 'intensity',
                       objectIntensity.getValue()));
      }

      if (object.color !== undefined && 
          object.color.getHex() !== objectColor.getHexValue()) 
      {
        editor.execute(new SetColorCommand(object, 'color', 
                       objectColor.getHexValue()));
      }

      if (object.groundColor !== undefined && 
          object.groundColor.getHex() !== objectGroundColor.getHexValue()) 
      {
        editor.execute(new SetColorCommand(object, 'groundColor', 
                                           objectGroundColor.getHexValue()));
      }

      if (object.distance !== undefined && 
          Math.abs(object.distance - objectDistance.getValue()) >= 0.01) 
      {
        editor.execute(new SetValueCommand(object, 'distance', 
                                           objectDistance.getValue()));
      }

      if (object.angle !== undefined && 
          Math.abs(object.angle - objectAngle.getValue()) >= 0.01) 
      {
        editor.execute(new SetValueCommand(object, 'angle', 
                                           objectAngle.getValue()));
      }

      if (object.penumbra !== undefined && 
          Math.abs(object.penumbra - objectPenumbra.getValue()) >= 0.01) 
      {
        editor.execute(new SetValueCommand(object, 'penumbra', 
                                           objectPenumbra.getValue()));
      }

      if (object.decay !== undefined && 
          Math.abs(object.decay - objectDecay.getValue()) >= 0.01)
      {
        editor.execute(new SetValueCommand(object, 'decay', 
                                           objectDecay.getValue()));
      }

      if (object.visible !== objectVisible.getValue()) 
      {
        editor.execute(new SetValueCommand(object, 'visible', 
                                           objectVisible.getValue()));
      }

      if (object.castShadow !== undefined && 
          object.castShadow !== objectCastShadow.getValue()) 
      {
        editor.execute(new SetValueCommand(object, 'castShadow', 
                                           objectCastShadow.getValue()));
      }

      if (object.receiveShadow !== undefined && 
          object.receiveShadow !== objectReceiveShadow.getValue()) 
      {
        editor.execute(new SetValueCommand(object, 'receiveShadow', 
                                           objectReceiveShadow.getValue()));
        object.material.needsUpdate = true;
      }

      if (object.shadow !== undefined) 
      {
        if (object.shadow.radius !== objectShadowRadius.getValue()) 
        {
          editor.execute(new SetValueCommand(object.shadow, 'radius',
                                             objectShadowRadius.getValue()));
        }
      }

      try 
      {
        var userData = JSON.parse(objectUserData.getValue());
        if (JSON.stringify(object.userData) != JSON.stringify(userData)) 
        {
          editor.execute(new SetValueCommand(object, 'userData', userData));
        }
      } 
      catch (exception) 
      {
        console.warn(exception);
      }
    }
  }
```


* `Loader.js`

本文件描述 `Loader` 类, 该类用于向场景中导入 3D模型 (对于加载模型的说明详见模型加载问题说明文档), 场景信息文件(JSON 描述)