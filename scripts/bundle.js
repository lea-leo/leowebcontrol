window.onload = function() {

    var oPopinHtml = document.querySelector(".popin");
    var drawNavigation = false;
    var drawConnection = false;
    var disconnectFromLeo = false;
    var isWebBTActivated = navigator.bluetooth;
    var deviceLeo = null;
    var characteristicServiceLeo = null;
    var uuidService = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
    var uuidCharacteristicService = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
    var bytesWithHeader = [
        0xBA, // Static header
        0xBA, // Static header
        0xAA, // Static header
        0xAA // Static header
    ];
    // commande couleur LED
    var cUpdateColor = 0x03;
    // commande direction
    var cDirection = 0x02;

    /*
     Shapes
     Objet plat acceptant 4 clés ;
     - classes : { normal : "class1 class2" : hover : "class3 class4" }
     - cells : Tableau des cellules concernées : [ [x1,y1], [x2,y2], ...]. Dans la grille le point [0,0] est au centre de l'écran
     - onTouchStart : function(){ ... }
     - onTouchEnd : function(){ ... }
     */
    // Ecran 1 : connection
    // Bouton connexion BT
    var bluetooth = {
        classes : {
            normal : "grey upper",
            hover : "blue upper"
        },
        cells : [
            [-5,-1],[-4,-1],[-4,1],[-3,1],[-3,2],[-2,2],[-2,3],
            [-5,8],[-4,8],[-4,7],[-3,7],[-3,6],[-2,6],[-2,5],
            [-1,-3], [-1,-2], [-1,-1], [-1,1], [-1,2], [-1,3], [-1,4], [-1,5], [-1,6], [-1,7], [-1,8], [-1,9], [-1,10],
            [1,-3], [1,-2], [1,-1], [1,1], [1,2], [1,3], [1,4], [1,5], [1,6], [1,7], [1,8], [1,9], [1,10],
            [2,-2],[2,-1],[3,-1],[3,1],[4,1],[4,2],[5,2],[4,3],[3,3],[3,4],[2,4],[3,5],[4,5],[4,6],[5,6],[4,7],[3,7],[3,8],[2,8],[2,9],
        ],
        onTouchStart : function(){},
        onTouchEnd : function(){
            if (navigator.bluetooth) {
                // Demande connexion BT
                _showMessage("Connexion à Léo en cours...");
                navigator.bluetooth.requestDevice({
                    "filters": [{
                        "name": "LEO"
                    }],
                    optionalServices:[uuidService]
                }).then(device => {
                    deviceLeo = device;
                // Connexion OK : récupération du service BT
                deviceLeo.gatt.connect().then(server => {
                    return server.getPrimaryService(uuidService);
            }, error => {
                    _showMessage("Erreur lors de la connexion à Léo : " + error);
                }).then(service => {
                    return service.getCharacteristic(uuidCharacteristicService).then(characteristic => {
                        characteristicServiceLeo = characteristic;
                _showMessage("Vous êtes maintenant connecté à Léo... à vous de jouer !");
                drawNavigation = true;
            });
            }, error => {
                    _showMessage("Erreur lors de la connexion à Léo : " + error);
                });
            }, error => {
                    _showMessage("Erreur lors de la connexion à Léo : " + error);
                });
            }
        }
    };
    // Titre LEO
    var led = {
        classes : {
            normal : "blue upper",
            hover : "blue upper"
        },
        cells : [
            [-7,-11], [-7,-10], [-7,-9], [-7,-8], [-7,-7],[-6,-7],[-5,-7],[-4,-7],
            [2,-11], [1,-11], [-1,-11], [-2,-11], [-2,-10],[-1,-9],[1,-9],[-2,-8],[-2,-7],[-1,-7],[1,-7],[2,-7],
            [4,-11], [5,-11], [6,-11], [7,-10], [7,-9],[7,-8],[7,-7],[6,-7],[5,-7],[4,-7],[4,-8],[4,-9],[4,-10]
        ]
    };
    // Ecran 2
    var topleft = {
        classes : { normal : "grey upper", hover : "blue upper" },
        cells : [ [-5,-10], [-6,-10], [-7,-10], [-7,-9], [-7,-8]],
        onTouchStart : function(){  },
        onTouchEnd : function(){  }
    };
    var topright = {
        classes : { normal : "grey upper", hover : "blue upper" },
        cells : [ [5,-10], [6,-10], [7,-10], [7,-9], [7,-8]]
    };
    var bottomleft = {
        classes : { normal : "grey upper", hover : "blue upper" },
        cells : [ [-7,2], [-7,3], [-7,4], [-6,4], [-5,4]]
    };
    var bottomright = {
        classes : { normal : "grey upper", hover : "blue upper" },
        cells : [ [7,2], [7,3], [7,4], [6,4], [5,4]]
    };
    var top = {
        classes : { normal : "grey upper", hover : "blue upper" },
        cells : [
            [-1,-11], [1,-11],
            [-2,-10],[-1,-10], [1,-10],[2,-10],
            [-3,-9], [-2,-9],[-1,-9], [1,-9],[2,-9],[3,-9],
            [-4,-8],[-3,-8], [-2,-8],[-1,-8], [1,-8],[2,-8],[3,-8],[4,-8]
        ],
        onTouchStart : function(){
            _callWrite(cDirection, [1]);
        },
        onTouchEnd : function(){
            _callWrite(cDirection, [0]);
        }
    };
    var bottom = {
        classes : { normal : "grey upper", hover : "blue upper" },
        cells : [
            [-1,5], [1,5],
            [-2,4],[-1,4], [1,4],[2,4],
            [-3,3], [-2,3],[-1,3], [1,3],[2,3],[3,3],
            [-4,2],[-3,2], [-2,2],[-1,2], [1,2],[2,2],[3,2],[4,2]
        ],
        onTouchStart : function(){
            _callWrite(cDirection, [2]);
        },
        onTouchEnd : function(){
            _callWrite(cDirection, [0]);
        }
    };
    var left = {
        classes : { normal : "grey upper", hover : "blue upper" },
        cells : [
            [-8,-4], [-8,-3],
            [-7,-5],[-7,-4], [-7,-3],[-7,-2],
            [-6,-6],[-6,-5],[-6,-4], [-6,-3],[-6,-2],[-6,-1],
            [-5,-7],[-5,-6],[-5,-5],[-5,-4], [-5,-3],[-5,-2],[-5,-1],[-5,1]
        ],
        onTouchStart : function(){
            _callWrite(cDirection, [3]);
        },
        onTouchEnd : function(){
            _callWrite(cDirection, [0]);
        }
    };
    var right = {
        classes : { normal : "grey upper", hover : "blue upper" },
        cells : [
            [8,-4], [8,-3],
            [7,-5],[7,-4], [7,-3],[7,-2],
            [6,-6],[6,-5],[6,-4], [6,-3],[6,-2],[6,-1],
            [5,-7],[5,-6],[5,-5],[5,-4], [5,-3],[5,-2],[5,-1],[5,1]
        ],
        onTouchStart : function(){
            _callWrite(cDirection, [4]);
        },
        onTouchEnd : function(){
            _callWrite(cDirection, [0]);
        }
    };
    var g = {
        classes : { normal : "grey upper", hover : "blue upper" },
        cells : [
            [3,-6],[2,-6],[1,-6], [-1,-6],[-2,-6],[-3,-6],
            [-3,-5],[-3,-4],[-3,-3], [-3,-2],[-3,-1],
            [-2,-1],[-1,-1],[1,-1], [2,-1],[3,-1],
            [3,-2],[3,-3],[3,-4],
            [2,-4],[1,-4],[-1,-4],
            [-1,-3]
        ],
        onTouchStart : function(){
            _callWrite(cDirection, [5]);
        },
        onTouchEnd : function(){
            _callWrite(cDirection, [0]);
        }
    };
    var deco = {
        classes : { normal : "grey upper", hover : "blue upper" },
        cells : [
            [1,9],[-1,9],[1,10], [-1,10],
            [-2,8],[2,8],[-2,11],[2,11]
        ],
        onTouchEnd : function(){
            _disconnect(true);
        }
    };

    /*
     Drawings
     Objet plat acceptant 2 clés

     - size : taille minimale de la grille : { width : Number, height : Number }
     - shapes : Tableau de shapes, voir au dessu
     */
    var connection = {
        size : { width : 18, height : 26 },
        shapes : [bluetooth, led]
    };
    var navigation = {
        size : { width : 18, height : 26 },
        shapes : [topleft, topright, bottomleft, bottomright, top, bottom, left, right, g, deco]
    };
    oPopinHtml.addEventListener("touchend", function(e) {
        // On ne cache pas la popin dans le cas où
        // l'utilisateur n'a pas activé l'interface bluetooth
        if (isWebBTActivated) {
            // oPopinHtml.hide();
            oPopinHtml.style.display = "none";
            if (drawNavigation) {
                drawNavigation = false;
                _draw(navigation);
            } else if (drawConnection) {
                drawConnection = false;
                _draw(connection);
            } else if (disconnectFromLeo) {
                disconnectFromLeo = false;
                _disconnect();
            }
        }
    });

    /**
     * Permet d'afficher un message dans une popin
     * @param message à afficher
     * @private
     */
    function _showMessage(message) {
        document.querySelector(".popin .message").innerHTML = message;
        oPopinHtml.style.display = "";
    }

    if (!isWebBTActivated) {
        isActivateWebBT = true;
        _showMessage("Interface Web Bluetooth indisponible. Veuillez l'activer :<p><a class='link' target=\"_blank\" href=\"chrome://flags/#enable-web-bluetooth\">chrome://flags/#enable-web-bluetooth</a></p>", true);
    }

    /**
     * Fonction qui permet de dessiner une forme
     * @param drawing la forme à dessiner
     */
    function _draw(drawing){

        //var oGridHtml = $(".grid");
        var oGridHtml = document.querySelector(".grid");
        //oGridHtml.empty();
        oGridHtml.innerHTML = "";

        var body = document.body,
            html = document.documentElement;

        var screenHeight = Math.max( body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);

        var screenWidth = Math.max( body.scrollWidth, body.offsetWidth,
            html.clientWidth, html.scrollWidth, html.offsetWidth);

        var screenSize = {
            width : screenWidth,
            height : screenHeight
        };

        var sizeX = screenSize.width / drawing.size.width ;
        sizeX = sizeX > 40 ? 40 : Math.floor(sizeX) ;
        var sizeY = screenSize.height / drawing.size.height ;
        sizeY = sizeY > 40 ? 40 : Math.floor(sizeY) ;

        if(sizeX < sizeY) sizeY = sizeX;
        if(sizeY < sizeX) sizeX = sizeY;

        var size = sizeX ;

        var grid = {
            nbOfCellsX : Math.ceil(Math.ceil(screenSize.width / size) / 2) * 2 ,
            nbOfCellsY : Math.ceil(Math.ceil(screenSize.height / size) / 2) * 2 ,
        };

        grid.minX = grid.nbOfCellsX / -2 ;
        grid.maxX = grid.nbOfCellsX / 2 + 1 ;
        grid.minY = grid.nbOfCellsY / -2 ;
        grid.maxY = grid.nbOfCellsY / 2 + 1 ;
        grid.width = grid.nbOfCellsX * size ;
        grid.height = grid.nbOfCellsY * size ;

        oGridHtml.style.width = grid.width + "px";
        oGridHtml.style.height = grid.height + "px";

        for(var y = grid.minY ; y < grid.maxY ; y++){
            if(y === 0) continue ;
            for(var x = grid.minX ; x < grid.maxX ; x++){
                if(x === 0) continue ;
                var element = document.createElement("div");
                element.className = "lego darkgrey";
                element.setAttribute("x",x);
                element.setAttribute("y",y);
                element.style.width = size+"px";
                element.style.height = size+"px";
                oGridHtml.appendChild(element);
            }
        }

        drawing.shapes.forEach(function(shape) {
            // On calcul les sélecteurs DOM pour aller chercher toutes les divs qui forment le dessin
            var selectors = shape.cells.map(function(cell){ return('[x="'+ cell[0] +'"][y="'+ cell[1] +'"]') ; });
            // Parcours des divs qui forment le dessin
            var selector = selectors.forEach(function(selectorCell) {
                // Récupération de la div
                var cell = document.querySelector(selectorCell);
                // On appplique la classe CSS indiquée
                cell.className += " " + shape.classes.normal;
                // Event touchstart
                cell.addEventListener("touchstart", function() {
                    // Pour chaque div qui forme le dessin, on applique le changement de classe CSS
                    selectors.forEach(function(selectorCellEvent) {
                        var cellEvent = document.querySelector(selectorCellEvent);
                        cellEvent.className = cellEvent.className.replace(shape.classes.normal, shape.classes.hover);
                    });
                    if (typeof shape.onTouchStart === "function") {
                        shape.onTouchStart();
                    }
                });
                // Event touchend
                cell.addEventListener("touchend", function() {
                    // Pour chaque div qui forme le dessin, on applique le changement de classe CSS
                    selectors.forEach(function(selectorCellEvent) {
                        var cellEvent = document.querySelector(selectorCellEvent);
                        cellEvent.className = cellEvent.className.replace(shape.classes.hover, shape.classes.normal);
                    });
                    if (typeof shape.onTouchEnd === "function") {
                        shape.onTouchEnd();
                    }
                });
            });
        });
    }

    /**
     * Appel caractéristique write du service BT
     * @param message à envoyer
     * @private
     */
    function _callWrite(cCommande, valuesArray) {
        if(characteristicServiceLeo) {
            characteristicServiceLeo.writeValue(_dataToSend(bytesWithHeader, cCommande, valuesArray)).then(value => {
            }, error => {
                _showMessage("Erreur lors de l'envoi de la commande à LEO : " + error + ". Veuillez vous reconnecter.");
                disconnectFromLeo = true;
            });
        } else {
            _disconnect();
        }
    }

    /**
     * Permet de se déconnecter de Léo
     * @param withMessage indique s'il faut afficher le message de déconnexion
     * @private
     */
    function _disconnect(withMessage) {
        if (deviceLeo && deviceLeo.gatt.connected) {
            deviceLeo.gatt.disconnect();
            if (withMessage) {
	    	// Affichage du message de déconnexion
	    	// donc il faut afficher l'écran de déconnexion après fermeture de la popin
                drawConnection = true;
                _showMessage("Déconnexion OK !");
            } else {
                _draw(connection);
	        }
        } else {
            _draw(connection);
        }
    }

    /**
     * Crée les données à envoyer
     * @param headerBytes
     * @param commandByte
     * @param byteValue
     * @returns {ArrayBuffer}
     * @private
     */
    function _dataToSend(headerBytes, commandByte, byteValue) {
        var buf = new ArrayBuffer(headerBytes.length + 1 + byteValue.length);
        var bufView = new Uint8Array(buf);
        var idx = 0;

        for (let i = 0; i < headerBytes.length; i+=1) {
            bufView[idx++] = headerBytes[i];
        }

        bufView[idx++] = commandByte;

        // Gestion de l'inversion par paire des bytes
        for (let i = 0; i < byteValue.length; i+=1) {
            bufView[idx++] = byteValue[i];
        }
        return buf;
    }

    window.onresize = function() {
        if (deviceLeo && deviceLeo.gatt.connected) {
            _draw(navigation);
        } else {
            _draw(connection);
        }
    };

    // Point d'entrée
    _draw(connection);

};
