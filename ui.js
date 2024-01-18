// Modified from chrisandriessen.nl

function runBg() {
    ranBg = true;
    (function() {
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1000 / 30); // 60
        };
        window.requestAnimationFrame = requestAnimationFrame;
    })();
    
    // Terrain stuff.
    var background = document.getElementById("bg"),
        bgCtx = background.getContext("2d"),
        width = window.innerWidth,
        height = document.body.offsetHeight;
    
    (height < 400) ? height = 400: height;
    
    background.width = width;
    background.height = height;
    
    function Terrain(options) {
        options = options || {};
        this.terrain = document.createElement("canvas");
        this.terCtx = this.terrain.getContext("2d");
        this.scrollDelay = options.scrollDelay || 90;
        this.lastScroll = new Date().getTime();
        
        this.terrain.width = width;
        this.terrain.height = height;
        this.fillStyle = options.fillStyle || "#191D4C";
        this.mHeight = options.mHeight || height;
        
        // generate
        this.points = [];
        
        var displacement = options.displacement || 140,
            power = Math.pow(2, Math.ceil(Math.log(width) / (Math.log(2))));
        
        // set the start height and end height for the terrain
        this.points[0] = this.mHeight; //(this.mHeight - (Math.random() * this.mHeight / 2)) - displacement;
        this.points[power] = this.points[0];
        
        // create the rest of the points
        for (var i = 1; i < power; i *= 2) {
            for (var j = (power / i) / 2; j < power; j += power / i) {
                this.points[j] = ((this.points[j - (power / i) / 2] + this.points[j + (power / i) / 2]) / 2) + Math.floor(Math.random() * -displacement + displacement);
            }
            displacement *= 0.6;
        }
        
        document.body.appendChild(this.terrain);
    }
    
    Terrain.prototype.update = function() {
    
    };
    
    // Second canvas used for the stars
    bgCtx.fillStyle = "#05004c";
    bgCtx.fillRect(0, 0, width, height);
    
    // stars
    function Star(options) {
        this.size = Math.random() * 2;
        this.speed = Math.random() * 0.05; // .05 // my 0.025
        this.x = options.x;
        this.y = options.y;
    }
    
    Star.prototype.reset = function() {
        this.size = Math.random() * 2;
        this.speed = Math.random() * 0.025; // .05 // my 0.025
        this.x = width;
        this.y = Math.random() * height;
        // alert(this.x + ";" + this.y);
        //                 this.x = width;
        //                     this.y = Math.random() * height;
    };
    
    Star.prototype.update = function() {
        this.x -= this.speed;
        // this.y += this.speed; // not used. delete for move to left only // removed due to glitch after prolonged use (no star y reset?)
        if (this.x < 0) { // this.x < 0)
            // alert("reset");
            this.reset();
        } else {
            bgCtx.fillRect(this.x, this.y, this.size, this.size);
        }
    };
    
    function ShootingStar() {
        this.reset();
    }
    
    ShootingStar.prototype.reset = function() {
        this.x = Math.random() * width;
        this.y = 0;
        this.len = (Math.random() * 60) + 20; // 80) + 10
        this.speed = (Math.random() * 6) + 6; // * 10) + 6
        this.size = (Math.random() * 1.5) + 0.1; // 1) + 0.1
        // this is used so the shooting stars arent constant
        this.waitTime = new Date().getTime() + (Math.random() * 3000); // orig * 3000) + 500 // my 6000) + 3000
        this.active = false;
    };
    
    ShootingStar.prototype.update = function() {
        if (this.active) {
            this.x -= this.speed;
            this.y += this.speed;
            if (this.x <= (0 - this.len) || this.y >= (height + this.len)) { // (this.x < 0 || this.y >= height)
                this.reset();
            } else {
                bgCtx.lineWidth = this.size;
                bgCtx.beginPath();
                bgCtx.moveTo(this.x, this.y);
                bgCtx.lineTo(this.x + this.len, this.y - this.len);
                bgCtx.stroke();
            }
        } else {
            if (this.waitTime < new Date().getTime()) {
                this.active = true;
            }
        }
    };
    
    var entities = [];
    
    // init the stars
    for (var i = 0; i < height; i++) {
        entities.push(new Star({
            x: Math.random() * width,
            y: Math.random() * height
        }));
    }
    
    // Add 2 shooting stars that just cycle.
    entities.push(new ShootingStar()); // had TWO
    // 			entities.push(new ShootingStar());
    // 			entities.push(new ShootingStar());
    // 			entities.push(new ShootingStar());
    // 			entities.push(new ShootingStar());
    entities.push(new Terrain({
        mHeight: (height / 2) - 120
    }));
    entities.push(new Terrain({
        displacement: 120,
        scrollDelay: 50,
        fillStyle: "rgb(17,20,40)",
        mHeight: (height / 2) - 60
    }));
    entities.push(new Terrain({
        displacement: 100,
        scrollDelay: 20,
        fillStyle: "rgb(10,10,5)",
        mHeight: height / 2
    }));
    
    //animate background
    function animate() {
        bgCtx.fillStyle = "#131321";
        bgCtx.fillRect(0, 0, width, height);
        bgCtx.fillStyle = "#ffffff";
        bgCtx.strokeStyle = "#ffffff";
        
        var entLen = entities.length;
        
        while (entLen--) {
            entities[entLen].update();
        }
        requestAnimationFrame(animate);
    }
    animate();
}

$(function() {
    // modified custom-select from somewhere
    var x, i, j, l, ll, selElmnt, a, b, c;
    x = document.getElementsByClassName("cselect");
    l = x.length;
    for (i = 0; i < l; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        ll = selElmnt.length;
        a = document.createElement("DIV");
        a.setAttribute("class", "cselectsel");
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[i].appendChild(a);
        b = document.createElement("DIV");
        b.setAttribute("class", "cselectitems cselecthide");
        for (j = 1; j < ll; j++) {
    		c = document.createElement("DIV");
    		c.innerHTML = selElmnt.options[j].innerHTML;
    		c.addEventListener("click", function() {
    			var y, i, k, s, h, sl, yl;
    			s = this.parentNode.parentNode.getElementsByTagName("select")[0];
    			sl = s.length;
    			h = this.parentNode.previousSibling;
    			for (i = 0; i < sl; i++) {
    				if (s.options[i].innerHTML == this.innerHTML) {
    					s.selectedIndex = i;
    					h.innerHTML = this.innerHTML;
    					y = this.parentNode.getElementsByClassName("cselectsame");
    					yl = y.length;
    					for (k = 0; k < yl; k++) {
    						y[k].removeAttribute("class");
    					}
    					this.setAttribute("class", "cselectsame");
    					break;
    				}
    			}
    			h.click();
    		});
    		b.appendChild(c);
    	}
    	x[i].appendChild(b);
    	a.addEventListener("click", function(e) {
    		e.stopPropagation();
    		closeAllSelect(this);
    		this.nextSibling.classList.toggle("cselecthide");
    		this.classList.toggle("cselectarrowact");
    		chooseMethod(this);
    	});
    }
    
    function closeAllSelect(elmnt) {
    	var x, y, i, xl, yl, arrNo = [];
    	x = document.getElementsByClassName("cselectitems");
    	y = document.getElementsByClassName("cselectsel");
    	xl = x.length;
    	yl = y.length;
    	for (i = 0; i < yl; i++) {
    		if (elmnt == y[i]) {
    			arrNo.push(i);
    		} else {
    			y[i].classList.remove("cselectarrowact");
    		}
    	}
    	for (i = 0; i < xl; i++) {
    		if (arrNo.indexOf(i)) {
    			x[i].classList.add("cselecthide");
    		}
    	}
    }

    document.addEventListener("click", closeAllSelect);
});

function chooseMethod(element) {
    // too lazy to make this modular so enjoy your non-nintendo switch
    switch(element.innerHTML) {
        case "./":
            $("#mtext").html("<br><br>dleovl<br>135246");
            $("#twitter").show();
			$("#github").hide();
            break;
		// i cba to detect whether or not the click comes from the nav or the actual items so replace
        case "./repo/":
            window.location.replace("./repo/");
            break;
        case "whoami":
			$("#mtext").html("<br><br>i am dleovl<br>i do things");
            $("#twitter").hide();
			$("#github").show();
            break;
    }
}

function github() {
	window.open("https://github.com/dleovl/", "_blank");
}

function twitter() {
	window.open("https://twitter.com/dleovl/", "_blank");
}

$(function() {
    $("#cover").show();
    $("#cover").animate(
        {
            top: 0
        },
        {
            easing: "swing",
            duration: 1000
        }
    );
    runBg();
    $("#github").hide();

    $("#cover").animate(
        {
            top: -$("#cover").height()
        },
        {
            easing: "swing",
            duration: 1000,
            complete: function() {
                $("#cover").hide();
            }
        }
    );
});