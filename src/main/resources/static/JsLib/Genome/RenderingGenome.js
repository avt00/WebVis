/**
 * Created by user on 10.01.2017.
 */
function Genome() {
    this.container = null;
    this.renderSystem = new RenderSystem();
    this.allObjects = null;
    this.beads = {};
    this.OneMeshBeads = null;
    this.bonds = {};
    this.group = null;
    this.SelectedLockBeadInfo = null;
    this.SelectedBeadInfo = null;
    this.LockedBeadInfo = {};
    this.selectedCSSObject = null;
    this.state = null;
    this.rayCaster = new THREE.Raycaster();

    this.genMaps = {};
    this.keysGenMaps = [];
    this.foundKeys = [];

    this.searcherBead = [];

    this.init = function (IsCssRender) {
        var selectedBead = createSimpleSphere();
        selectedBead.visible = false;
        this.renderSystem.scene.add(selectedBead);
        this.SelectedBeadInfo = new PairGenomeAndHtml(selectedBead, null, drawSimpleLine(new THREE.Vector3(), new THREE.Vector3()));
        this.renderSystem.scene.add(this.SelectedBeadInfo.line);
        //
        this.renderSystem.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1500 );
        this.renderSystem.camera.position.z = 50;
        this.renderSystem.camera.updateMatrixWorld(true);

        if(IsCssRender!=null && IsCssRender)
            this.renderSystem.initCssRender();
    };

    this.initState = function (state) {
        if(state!=null){
            this.state = state;
            if(state.camera != null){
                var cameraObject = loader.parse( this.state.camera );
                this.renderSystem.camera.copy( cameraObject );
                this.renderSystem.camera.updateProjectionMatrix();
                this.renderSystem.onWindowResize();
            }
            if(this.state.selectedBeadKey!=null){
                // this.selectedCssObject = createCssObject(this.state.pointInfo, this.renderSystem.camera.position);
                // this.renderSystem.cssScene.add(this.selectedCssObject);
                var keyBead = this.state.selectedBeadKey.split('_')[0];
                this.SelectedBeadInfo.beadInfo =  this.allObjects[keyBead].points[this.state.selectedBeadKey];
                this.SelectedBeadInfo.selectedBead.visible = true;
                this.SelectedBeadInfo.selectedBead.position.set(this.SelectedBeadInfo.beadInfo.x, this.SelectedBeadInfo.beadInfo.y, this.SelectedBeadInfo.beadInfo.z);
                this.SelectedBeadInfo.selectedBead.scale.set(this.SelectedBeadInfo.beadInfo.r +0.01, this.SelectedBeadInfo.beadInfo.r +0.01, this.SelectedBeadInfo.beadInfo.r+0.01 );
                this.renderSystem.camera.updateMatrixWorld(true);
                var position = ObjectSphericalToScreen(this.SelectedBeadInfo.selectedBead, this.renderSystem.camera,  window.innerWidth, window.innerHeight);
                updatePositionLine(this.SelectedBeadInfo.line, this.SelectedBeadInfo.selectedBead.position, this.SelectedBeadInfo.selectedBead.position);
                this.SelectedBeadInfo.selectedBeadHtml = createPopup(this.SelectedBeadInfo.beadInfo, position, false);
            }
            if(this.state.lockElements){
                for (var index = 0; index < this.state.lockElements.length; index++){
                    var key = this.state.lockElements[index];
                    var keyBead = key.split('_')[0];
                    var pointInfo = this.allObjects[keyBead].points[key];
                    var bead = createSimpleSphere();
                    bead.position.set(pointInfo.x, pointInfo.y, pointInfo.z);
                    bead.scale.set(pointInfo.r +0.01, pointInfo.r +0.01, pointInfo.r+0.01 );
                    bead.visible = false;
                    var position = ObjectSphericalToScreen(this.SelectedBeadInfo.selectedBead, this.renderSystem.camera,  window.innerWidth, window.innerHeight);
                    var htmlBlock = createPopup(pointInfo, position, true);
                    htmlBlock.addClass('lock');
                    var line = drawSimpleLine(new THREE.Vector3(), new THREE.Vector3());
                    this.LockedBeadInfo[this.state.lockElements[index]] = new PairGenomeAndHtml(bead, htmlBlock, line, pointInfo);
                }
            }
        }
    };

    this.onClick = function (event) {
        var x = ( event.clientX / window.innerWidth ) * 2 - 1;
        var y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        var mouse = new THREE.Vector2(x, y);
        // need fixed this!!!
        var minDistToCamera = 1000;
        var pointInfo = null;
        this.rayCaster = new THREE.Raycaster();
        this.rayCaster.setFromCamera(mouse, this.renderSystem.camera);
        for (var key in this.allObjects){
            if(!this.allObjects[key].visible)
                continue;
            for(var keyBead in this.allObjects[key].points){
                if(!this.allObjects[key].points[keyBead].visible)
                    continue;
                var point = new THREE.Vector3(this.allObjects[key].points[keyBead].x, this.allObjects[key].points[keyBead].y, this.allObjects[key].points[keyBead].z);
                var distance = this.rayCaster.ray.distanceToPoint(point);
                // raycaster.inter
                var distanceToCamera = this.rayCaster.ray.origin.distanceTo(point);
                if(distance < this.allObjects[key].points[keyBead].r && minDistToCamera > distanceToCamera){
                    minDistToCamera = distanceToCamera;
                    pointInfo = this.allObjects[key].points[keyBead];
                }
            }
        }
        // need fixed this!!!
        if(minDistToCamera < 1000){
            if(this.LockedBeadInfo[pointInfo.beadName]!=null){
                this.selectLockElement(pointInfo.beadName);
                return;
            }

            if(this.SelectedBeadInfo!=null)
            {
                clearPopupObject(this.SelectedBeadInfo.selectedBeadHtml);
                this.SelectedBeadInfo.activate(pointInfo);
            }
            else{
                this.SelectedBeadInfo = new PairGenomeAndHtml();
                this.SelectedBeadInfo.init(pointInfo);
                this.renderSystem.scene.add(this.SelectedBeadInfo.line);
                this.renderSystem.scene.add(this.SelectedBeadInfo.selectedBead);
            }
            this.SelectedBeadInfo.selectedBeadHtml = createPopup(pointInfo, {x:event.clientX, y:event.clientY}, false);
            updatePositionLine(this.SelectedBeadInfo.line, new THREE.Vector3(pointInfo.x, pointInfo.y, pointInfo.z), this.SelectedBeadInfo.selectedBead.position);
        }
        else {
            this.closeSelected();
            this.hideLockSelected();
            this.updateAlphaAllBeads(1);
        }
    };

    this.selectByInfo = function (pointInfo) {
        if(this.SelectedBeadInfo!=null)
        {
            clearPopupObject(this.SelectedBeadInfo.selectedBeadHtml);
            this.SelectedBeadInfo.activate(pointInfo);
        }
        else{
            this.SelectedBeadInfo = new PairGenomeAndHtml();
            this.SelectedBeadInfo.init(pointInfo);
            this.renderSystem.scene.add(this.SelectedBeadInfo.line);
            this.renderSystem.scene.add(this.SelectedBeadInfo.selectedBead);
        }
        this.SelectedBeadInfo.selectedBeadHtml = createPopup(pointInfo, {x:event.clientX, y:event.clientY}, false);
        updatePositionLine(this.SelectedBeadInfo.line, new THREE.Vector3(pointInfo.x, pointInfo.y, pointInfo.z), this.SelectedBeadInfo.selectedBead.position);
    };

    this.createMesh = function (allObjects, state) {
        this.allObjects = allObjects;
        if(this.group != null)
            this.renderSystem.scene.remove(this.group);
        this.beads = {};
        this.bonds = {};
        this.group = new THREE.Group();

        this.OneMeshBeads = createOneMeshGenome(allObjects, palette);
        this.group.add(this.OneMeshBeads);
        // for (var key in this.allObjects){
        //     var chain = getMeshPointsSeparate(this.allObjects[key], palette[indexColor]);
        //     chain.colorBead = palette[indexColor];
        //     // var spline = getMeshSpline(this.allObjects[key], palette[indexColor]);
        //     if(state!=null && !state.selected.includes(key))
        //         chain.visible = false;
        //     this.group.add(chain);
        //     // this.group.add(spline);
        //
        //     this.beads[key] = chain;
        //     // this.bonds[key] = spline;
        //     indexColor++;
        //
        //     if(indexColor == 1){
        //         minExpression = chain.material.uniforms.u_minExpression.value;
        //         maxExpression = chain.material.uniforms.u_maxExpression.value;
        //     }
        //     if(minExpression > chain.material.uniforms.u_minExpression.value)
        //         minExpression = chain.material.uniforms.u_minExpression.value;
        //     if(maxExpression < chain.material.uniforms.u_maxExpression.value)
        //         maxExpression = chain.material.uniforms.u_maxExpression.value;
        // }
        // var keys = Object.keys(this.beads);
        // for(var i =0; i < keys.length; i++){
        //     this.beads[keys[i]].material.uniforms.u_minExpressionGlobal.value = minExpression;
        //     this.beads[keys[i]].material.uniforms.u_maxExpressionGlobal.value = maxExpression;
        // }
        this.renderSystem.scene.add(this.group);
    };

    this.changeVisible = function(key, value) {
        this.beads[key].visible = value > 0;
    };

    this.changeVisibleNew = function(key) {
        var mesh = this.OneMeshBeads;
        var value = this.allObjects[key].visible ? 0 : 1;
        this.allObjects[key].visible = !this.allObjects[key].visible;
        $.each(this.allObjects[key].points, function (i, point) {
            var colorAtt = mesh.geometry.getAttribute("color");
            colorAtt.array[point.index*4+3] = value;
            mesh.geometry.attributes.color.needsUpdate = true;
        });
    };

    this.UpdateExpression = function(isTurn) {
        var allChains = this.allObjects;
        var keys = Object.keys(allChains);
        var minValueExpression = this.OneMeshBeads.material.uniforms.u_minExpressionGlobal.value;
        var maxValueExpression = this.OneMeshBeads.material.uniforms.u_maxExpressionGlobal.value;
        var expressionAtt = this.OneMeshBeads.geometry.getAttribute("expression");
        $.each(keys, function (i, key) {
            $.each(allChains[key].points, function (i, point) {
                var expressionValue = expressionAtt.array[point.index] ;
                var normalValue = (expressionValue - minValueExpression)/(maxValueExpression - minValueExpression);
                if(normalValue < 0.2)
                    point.visible = false;
                else {
                    point.visible = true;
                    console.log(i);
                }
                point.avrExTest1 = normalValue;
            });
        });
    };

    this.changeVisibleBead = function(key, keyBead, value) {
        var mesh = this.OneMeshBeads;
        var bead = this.allObjects[key].points[keyBead];
        var index = bead.index;
        var colorAtt = mesh.geometry.getAttribute("color");
        colorAtt.array[index*4+3] = value;
        mesh.geometry.attributes.color.needsUpdate = true;

        if(value==0)
            bead.visible = false;
        else
            bead.visible = true;
    };

    this.moveHtmlBlock = function (beadInfo) {
        if(beadInfo == null || beadInfo.selectedBeadHtml==null || beadInfo.line==null || !beadInfo.line.visible){
            return;
        }
        var rect = beadInfo.selectedBeadHtml[0].getBoundingClientRect();
        var screenPosition = ScreenToSpherical(rect.left, rect.top, this.renderSystem.camera,  window.innerWidth , window.innerHeight);
        beadInfo.line.geometry.vertices[ 0 ].x=screenPosition.x;
        beadInfo.line.geometry.vertices[ 0 ].y=screenPosition.y;
        beadInfo.line.geometry.vertices[ 0 ].z=screenPosition.z;
        beadInfo.line.geometry.verticesNeedUpdate = true;
    };

    this.OnLock = function () {
        var id = this.SelectedBeadInfo.selectedBeadHtml.attr('id');
        this.LockedBeadInfo[id] = new PairGenomeAndHtml(this.SelectedBeadInfo.selectedBead, this.SelectedBeadInfo.selectedBeadHtml, this.SelectedBeadInfo.line, this.SelectedBeadInfo.beadInfo );

        this.renderSystem.scene.remove(this.SelectedBeadInfo.line);
        this.renderSystem.scene.remove(this.SelectedBeadInfo.selectedBead);
        this.SelectedBeadInfo = null;
        // this.SelectedBeadInfo.line.visible = false;
        // this.SelectedBeadInfo.selectedBead.visible = false;
    };

    this.OnUnlock = function (key) {
        this.closeSelected();
        var unlockedElement = this.LockedBeadInfo[key];
        // this.SelectedBeadInfo.line.visible = true;
        // this.SelectedBeadInfo.selectedBead.visible = true;
        this.SelectedBeadInfo = new PairGenomeAndHtml();
        this.SelectedBeadInfo.beadInfo = unlockedElement.beadInfo;
        this.SelectedBeadInfo.selectedBeadHtml = unlockedElement.selectedBeadHtml;
        this.SelectedBeadInfo.line = unlockedElement.line;
        this.SelectedBeadInfo.selectedBead = unlockedElement.selectedBead;
        this.renderSystem.scene.add(unlockedElement.line);
        this.renderSystem.scene.add(unlockedElement.selectedBead);
    };


    this.hideLockSelected = function () {
        if(this.SelectedLockBeadInfo==null)
            return;
        this.renderSystem.scene.remove(this.SelectedLockBeadInfo.line);
        this.renderSystem.scene.remove(this.SelectedLockBeadInfo.selectedBead);
        this.SelectedLockBeadInfo = null;
    };

    this.closeSelected = function () {
        if(this.SelectedBeadInfo==null)
            return;
        clearPopupObject(this.SelectedBeadInfo.selectedBeadHtml);
        this.SelectedBeadInfo.deactivate();
        this.renderSystem.cssScene.remove(this.selectedCssObject);
    };

    this.closeForm = function (key) {
        if(this.SelectedBeadInfo != null && this.SelectedBeadInfo.beadInfo!=null && this.SelectedBeadInfo.beadInfo.beadName===key)
            this.closeSelected();
        else{
            var lockedElement = this.LockedBeadInfo[key];
            clearPopupObject(lockedElement.selectedBeadHtml);
            this.renderSystem.scene.remove(lockedElement.line);
            this.renderSystem.scene.remove(lockedElement.selectedBead);
            delete this.LockedBeadInfo[key];
        }
    };

    this.exportBead = function (key) {
        if(this.SelectedBeadInfo != null && this.SelectedBeadInfo.beadInfo.beadName===key)
            this.SelectedBeadInfo.export();
        else{
            this.LockedBeadInfo[key].export();
        }
    };

    this.selectLockElement = function (key) {
        this.hideLockSelected();
        this.SelectedLockBeadInfo = this.LockedBeadInfo[key];
        var rect = this.SelectedLockBeadInfo.selectedBeadHtml[0].getBoundingClientRect();
        var screenPosition = ScreenToSpherical(rect.left, rect.top, this.renderSystem.camera,  window.innerWidth , window.innerHeight);
        updatePositionLine(this.SelectedLockBeadInfo.line, screenPosition, this.SelectedLockBeadInfo.selectedBead.position);
        this.renderSystem.scene.add(this.SelectedLockBeadInfo.line);
        this.renderSystem.scene.add(this.SelectedLockBeadInfo.selectedBead);
        this.SelectedLockBeadInfo.selectedBead.visible = true;
    };

    this.selectAllFound = function () {
        var input = document.getElementById("searcherValue");
        var filterText = input.value.toUpperCase();
        this.updateAlphaAllBeads(0);
        for(var index = 0; index < this.foundKeys.length; index++){
            if(this.foundKeys[index].gen.toUpperCase()!==filterText)
                continue;
            var chrId = this.foundKeys[index].chr;
            var beadId = this.foundKeys[index].bead;
            this.changeVisibleBead(chrId, beadId, 1);
        }
    };

    this.updateAlphaAllBeads = function (value) {
        if(!this.OneMeshBeads.material.uniforms.u_UseExpressionGlobal.value)
            for(var key in this.allObjects) {
                for(var keyBead in this.allObjects[key].points) {
                    this.changeVisibleBead(key, keyBead, value);
                }
            }
    };

    this.paintByExpression = function () {
        for(var bead in this.beads) {
            this.beads[bead].material.uniforms.color.value.w = 1;
        }

    };

    this.createGenMap = function (data) {
        this.genMaps = {};
        this.keysGenMaps = [];

        var keys = Object.keys(data);
        var mapGene = this.genMaps;
        var keysGenMaps = this.keysGenMaps;
        $.each(keys, function (i, key) {
            $.each(data[key], function (i, chrom) {
                for(var keyBead in chrom){
                    var point = chrom[keyBead];
                    point.chrId = key;
                    $.each(point.geneInfos, function (j, value) {
                        if(mapGene[value.genomeName]=== undefined){
                            mapGene[value.genomeName] = new Object();
                            mapGene[value.genomeName].beadElements = [];
                            keysGenMaps.push(value.genomeName);
                        }
                        mapGene[value.genomeName].beadElements.push(point);
                    });
                }
            });
        });
    };

    this.searchGene = function() {
        var input = document.getElementById("searcherValue");
        var filterText = input.value.toUpperCase();
        var genMaps = this.genMaps;
        this.foundKeys = [];
        var foundKeys = this.foundKeys;
        if(filterText.length == 0){
            $('#listid').empty();
            return;
        }
        if(filterText.length <2)
            return;
        $('#listid').empty();
        $('#listid').show();
        var IsFoundSomething = false;
        $.each(this.keysGenMaps, function (i, key) {
            if(key.toUpperCase().indexOf(filterText) > -1){
                IsFoundSomething = true;
                var listBeadinfo = genMaps[key].beadElements;
                $.each(listBeadinfo, function (i, element) {
                    $('<div/>')
                        .addClass('element')
                        .text(key)
                        .appendTo($('#listid'))
                        .click(function () {
                            $('#listid').hide();
                            $('#searcherGene').hide();
                            genome.selectByInfo(element);
                        })
                        .append($('<div/>')
                            .addClass('subElement')
                            .text(element.beadName));
                    foundKeys.push({chr: element.chrId, bead: element.beadName, gen: key});
                });
            }
        });
        if(!IsFoundSomething) {
            $('<div/>')
                .addClass('element')
                .text("Not found")
                .appendTo($('#listid'));
        }
        return foundKeys;
    }

}


